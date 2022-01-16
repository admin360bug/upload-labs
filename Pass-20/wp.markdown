## 解题wp(By:独立团孙德胜Alan)
本pass主要考察代码审计能力

## 1.打开第二十关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](/img/2.png)

发现上传失败

## 3.分析代码

![](./img/3.png)

$file_name经过reset($file) . '.' . $file[count($file) - 1];处理。
上传的是数组的话，会跳过$file = explode('.', strtolower($file));

后缀有白名单过滤
$ext = end($file);
$allow_suffix = array('jpg','png','gif');
最终的文件名后缀取的是$file[count($file) - 1]，我们可以通过让$file为数组。$file[0]为smi1e.php/，也就是reset($file)，然后再令$file[2]为白名单中的jpg。

此时end($file)等于jpg，$file[count($file) - 1]为空。而 $file_name = reset($file) . '.' . $file[count($file) - 1];，也就是1.php/.，最终move_uploaded_file会忽略掉/.，最终上传1.php

说明：

empty函数：检查一下变量是否为空；返回值：如果变量是非零非空的值返回False，否则返回True;

三运运算符：(expr1) ? (expr2) : (expr3);  如果条件expr1 成立，执行expr2,否则执行expr3;

end函数：将内部指针指向数组最后一个元素并输出；

reset函数：将内部指针指向数组第一个元素并输出；

## 4.如图所示，两种方式均可

![](/img/4.png)
