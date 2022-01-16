<?php
    function getDir($dir) {
        $dirArray[]=NULL;
        if (false != ($handle = opendir ( $dir ))) {
            $i=0;
            while ( false !== ($file = readdir ( $handle )) ) {
                //去掉"“.”、“..”以及带“.xxx”后缀的文件
                if ($file != "." && $file != ".."&&!strpos($file,".")) {
                     if (preg_match("/pass/i",$file)){
                        $dirArray[$i]=$file;
                        $i++;
                     }
                }
            }
            //关闭句柄
            closedir ( $handle );
        }
        return $dirArray;
    }

    $dirArr = getDir(".");