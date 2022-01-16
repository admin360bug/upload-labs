<?php
	include 'config.php';
	include 'head.php';
	include 'readDir.php';
?>
<div class="container">
	<div class="row">
		<div class="input-group mb-1 col-3">
			<input type="text" class="form-control" placeholder="请输入题目名称">
			<span class="input-group-text" id="basic-addon2">
				<svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" height="16" width="16" class="octicon octicon-search">
					<path fill-rule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"></path>
				</svg>
			</span>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
			<?php
				for($i = 0; $i<count($dirArr);$i++) {
					echo '<li><a class="dropdown-item" href="'."./$dirArr[$i]/index.php".'">'.$dirArr[$i].'</a></li>';
					echo "\n";
				}
			?>
				
			</ul>

		</div>
		<script>

			$(".form-control").on('input',function(e){
				
				var searchVal =new RegExp($(this).val(),"i");

				for(var i=0;i<$(".dropdown-menu .dropdown-item").length;i++){
					var child = $(".dropdown-menu .dropdown-item")[i];
					var text = child.innerText;
					var isY = searchVal.test(text);
					if(!isY){
						$(child).css("display","none");
					}else{
						$(child).css("display","block");
					}
				}

			});
			$(".form-control").focus(function(){
				 $(".dropdown-menu").css("display","block");
			})

			$(".form-control").blur(function(){
				 setTimeout(function(){$(".dropdown-menu").css("display","none")},800);
			})


		</script>
<?php
	$index = $_GET["index"] ?? 0;
	
	//防止sql注入，强制类型转换
	settype($index, 'integer');
	$offset = $index * 12;

	// $query = "SELECT id,name FROM list  LIMIT 12 OFFSET $offset;";
	// $queryCount =  "SELECT count(id) FROM list";
	// $dsn="mysql:host=".hostname.";dbname=".database;
	// $db = new PDO($dsn, username, password);
    // $result = $db->query($query);
	// $count = 0;
	// $result2 = $db->query($queryCount);
	// foreach ($result2 as $row) {
	// 	$count = $row[0];
	// }
	$count = count($dirArr);

	$maxI = $offset+12;
	if($maxI>$count){
		$maxI = $count;
	}
	$countPage = ceil( $count / 12);
	echo $countPage;

	echo '		<div class="container">
	<div class="row row-cols-4 row-cols-md-3 row-cols-lg-4 g-2 g-lg-3 task_list gx-5 m-auto list">';


	for($i = $offset; $i<$maxI;$i++) {
		echo <<< EOT
				<div class="col">
					<a  href="./{$dirArr[$i]}/index.php" id="{$i}"> {$dirArr[$i]} </a>
				</div>
		EOT;
    }


	echo '</div></div>';
	if($countPage>0){
		$preIndex = $index - 1;
		if($preIndex<0){
			$preIndex = 0;
		}

		echo <<< EOT
			
			<div class="navigation_wrapper">
				<nav aria-label="Page navigation example">
				<ul class="pagination">
					<li class="page-item">
					<a class="page-link" href="./task.php?index={$preIndex}" aria-label="Previous">
						<span aria-hidden="true">&laquo;</span>
					</a>
					</li>
		EOT;
		for($i = 0;$i<$countPage;$i++){
			$href = "./task.php?index=".$i;
			echo '<li class="page-item"><a class="page-link" href="'.$href.'">'.($i+1).'</a></li>';
		}
		$nextIndex = $index+1;
		if($nextIndex>$countPage-1){
			$nextIndex = $countPage-1;
		}

		echo <<< EOT
					<li class="page-item">
					<a class="page-link" href="./task.php?index={$nextIndex}" aria-label="Next">
						<span aria-hidden="true">&raquo;</span>
					</a>
					</li>
				</ul>
				</nav>
			<div>
		EOT;
	}
?>


<script type="text/javascript">

	$('.list .col a').click(function(e){
		var id = $(this).attr('id');
		console.log(id);
	    if (typeof(Storage) !== "undefined") {
	        if(typeof(localStorage.requested) !== "undefined"){
	            var arr = JSON.parse(localStorage.requested);
	            for(var i=0;i<arr.length;i++){
	                if(arr[i]==id){
	                    break;
	                }
	                if(i==arr.length-1){
	                    arr.push(id);
	                    localStorage.requested = JSON.stringify(arr);
	                    break;
	                }
	            }
			
	        }else{
	            var arr = [id];
	            localStorage.requested = JSON.stringify(arr);
	        }
	    } 
	});

	if (typeof(Storage) !== "undefined") {
	    if(typeof(localStorage.requested) !== "undefined"){
	        var arr = JSON.parse(localStorage.requested);
	        for(var i=0;i<arr.length;i++){
				$('#'+arr[i]).css("background","transparent");
	            // $("#menulist li>div")[arr[i]-1].className="";
	        }
	    }
	}

</script>

</div>
</html>