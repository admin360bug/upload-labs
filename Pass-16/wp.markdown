## 解题wp(By:独立团孙德胜Alan)
本pass主要考察二次渲染

## 1.打开第十六关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)



## 3.分析代码

##### ![](./img/3.png)

##### 源码中使用imagecreatefrom...函数对图片文件进行二次渲染。该函数调用了PHP GD库（GD库，是php处理图形的扩展库），对图片进行了转换。

##### 将一个正常显示的图片，上传到服务器。下载被渲染后与原始图片对比，在仍然相同的数据块部分内部插入Webshell代码，然后上传。

## 4.我们可以通过先上传一个图片文件，然后下载回来，再上传一次，再下载的方式绕过

具体原理，可见：

https://www.fujieace.com/penetration-test/upload-labs-pass-16.html

![](/img/5.png)
