<?php
namespace Api\Controller;
use Think\Controller;
class BaseController extends Controller {

	//是否开启本地调试
	private $is_local_debug;

    public function __construct()
    {
		//是否开启本地调试。
		$this->is_local_debug = 0 ;

		//做一个检测，以免这个配置更新到线上。
		if (
			$this->is_local_debug > 0 
			&&$_SERVER['HTTP_HOST'] != '127.0.0.1' 
			&& $_SERVER['HTTP_HOST'] != 'wu.com' 
			&& strpos($_SERVER['HTTP_HOST'], "192.168") == false
		){
			$this->sendError("-1001","非本地环境禁止开通调试。请通知管理员关闭调试模式");
			exit();
		}

		//检测数据库文件是否有可写权限
		$this->checkDbWhitable();

    }


	public function checkLogin($redirect = true){

		//debug
		if ($this->is_local_debug > 0 ) {
			$login_user = D("User")->where("username = 'showdoc' ")->find();
			session("login_user" , $login_user);
		}
		
		if ( ! session("login_user")) {
			$cookie_token = cookie('cookie_token');
			if ($cookie_token) {
				$ret = D("UserToken")->getToken($cookie_token);
				if ($ret && $ret['token_expire'] > time() ) {
					D("UserToken")->setLastTime($cookie_token);
					$login_user = D("User")->where("uid = $ret[uid]")->find();
					unset($ret['password']);
					session("login_user" , $login_user);
					return $login_user ;
				}
			}
			if ($redirect) {
				$this->sendError(10102);
				exit();
			}
		}else{
			return  session("login_user") ;
		}
	}
	
	//检查是否是管理员
	public function checkAdmin($redirect = true){
		$login_user = session("login_user") ;
		if ($login_user) {
			if ($login_user['groupid'] == 1 ) {
				return true ;
			}
		}
		if ($redirect) {
			$this->sendError(10103);
			exit();
		}
		return false;
	}

	/**
	 * 返回json结果
	 */
	protected function sendResult($array){
		if (isset($array['error_code'])) {
			$result['error_code'] = $array['error_code'] ;
			$result['error_message'] = $array['error_message'] ;
		}
		else{
			$result['error_code'] = 0 ;
			$result['data'] = $array ;
		}
		
		if ($this->is_local_debug > 0 ) {
			header('Access-Control-Allow-Origin: *');//允许跨域请求
			header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie');
			header('Access-Control-Allow-Credentials : true');//允许跨域请求
		}
		echo json_encode($result);

		//如果开启API调试模式，则记录请求参数和返回结果
		if (C('API_LOG')) {
			$info = '';
			$info .= "\n\n【★★★★★★★★★★★】";
			$info .= "\n请求接口：".MODULE_NAME  ."/".CONTROLLER_NAME."/".ACTION_NAME."";
			$info .= "\n请求".'$_REQUEST'."：\n";
			$info .= json_encode($_REQUEST);
			$info .= "\n返回结果：\n";
			$info .= json_encode($result)."\n";	
			$info .= "【★★★★★★★★★★★】\n";		
			\Think\log::record($info , 'INFO');
		}

	}

	//返回错误提示
	protected function sendError($error_code , $error_message = ''){
		$error_code = $error_code ? $error_code : 10103 ;
		if (!$error_message) {
			$error_codes = C("error_codes");
			foreach ($error_codes as $key => $value) {
				if ($key == $error_code ) {
					$error_message = $value ;
				}
			}
		}
		$array['error_code'] = $error_code;
		$array['error_message'] = $error_message ;
		$this->sendResult($array);
	}

	//判断某用户是否有项目管理权限（项目成员member_group_id为1，是项目所在团队的成员并且成员权限为1 ，以及 项目创建者）
	protected function checkItemPermn($uid , $item_id){

		if (!$uid) {
			return false;
		}

		if (session("mamage_item_".$item_id)) {
			return true;
		}

		$item = D("Item")->where("item_id = '%d' ",array($item_id))->find();
		if ($item['uid'] && $item['uid'] == $uid) {
			session("mamage_item_".$item_id , 1 );
			return true;
		}
		$ItemMember = D("ItemMember")->where("item_id = '%d' and uid = '%d' and member_group_id = 1 ",array($item_id,$uid))->find();
		if ($ItemMember) {
			session("mamage_item_".$item_id , 1 );
			return true;
		}

		$ItemMember = D("TeamItemMember")->where("item_id = '%d' and member_uid = '%d' and member_group_id = 1 ",array($item_id,$uid))->find();
		if ($ItemMember) {
			session("mamage_item_".$item_id , 1 );
			return true;
		}

		return false;
	}

	//判断某用户是否为项目创建者
	protected function checkItemCreator($uid , $item_id){
		if (!$uid) {
			return false;
		}
		if (session("creat_item_".$item_id)) {
			return true;
		}

		$item = D("Item")->where("item_id = '%d' ",array($item_id))->find();
		if ($item['uid'] && $item['uid'] == $uid) {
			session("creat_item_".$item_id , 1 );
			return true;
		}
		return false;
	}

	//判断某用户是否有项目访问权限（公开项目的话所有人可访问，私有项目则项目成员、项目创建者和访问密码输入者可访问）
	protected function checkItemVisit($uid , $item_id, $refer_url= ''){
		if (session("visit_item_".$item_id)) {
			return true;
		}

		if ($this->checkItemCreator($uid , $item_id)) {
			session("visit_item_".$item_id , 1 );
			return true;
		}

		$ItemMember = D("ItemMember")->where("item_id = '%d' and uid = '%d'  ",array($item_id,$uid))->find();
		if ($ItemMember) {
			session("visit_item_".$item_id , 1 );
			return true;
		}
		
		$TeamItemMember = D("TeamItemMember")->where("item_id = '%d' and member_uid = '%d'  ",array($item_id,$uid))->find();
		if ($TeamItemMember) {
			session("visit_item_".$item_id , 1 );
			return true;
		}

		$item = D("Item")->where("item_id = '%d' ",array($item_id))->find();
		if ($item['password']) {
			return false;
		}else{
			session("visit_item_".$item_id , 1 );
			return true;
		}

	}
	//检查数据库文件是否可写
	protected function checkDbWhitable(){
		$file = C("DB_NAME") ;
	    if ( $fp = @fopen($file, 'a+')) {
	       @fclose($fp);
	       return true ;
	    } else {
	    	$this->sendError("10103","Sqlite/showdoc.db.php文件不可写");
	    	exit();
	    }
	}


}
