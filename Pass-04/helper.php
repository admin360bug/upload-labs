<?php
include "../Parsedown.php";
$Parsedown = new Parsedown();
$Parsedown->setBreaksEnabled(true);
$Parsedown->setSafeMode(true);
$Parsedown->setMarkupEscaped(true);

if($_GET['action'] == 'get_prompt'){

    $file=file('wp.markdown'); //返回数组的内容
        foreach($file as $v){
                echo $Parsedown->text($v);

    }
}
?>