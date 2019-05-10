<?php
	session_start();
    header("Content-type:text/html;charset=utf-8");
	
	if(!isset($_REQUEST["filePath"])){
		echo "没有该文件";
        return ;
	}
	$file_path = "../../".$_REQUEST["filePath"];
	$file_name=basename($file_path);
    //首先要判断给定的文件存在与否
    if(!file_exists($file_path)){
        echo "没有该文件";
        return ;
    }
	
	//另一种方法
/*	$fp = fopen($file_path,"r"); // 打开文件
	$file_size=filesize($file_path);
	// 输入文件标签
	Header("Content-type: application/octet-stream");
	Header("Accept-Ranges: bytes");
	Header("Accept-Length: ".$file_size);
	Header("Content-Disposition: attachment; filename=" . $file_name);
	// 输出文件内容
	echo fread($fp,filesize($file_path));
	fclose($fp);
	exit();*/
	
    $fp=fopen($file_path,"r");
    $file_size=filesize($file_path);
    //下载文件需要用到的头
    Header("Content-type: application/octet-stream"); 
    Header("Accept-Ranges: bytes"); 
    Header("Accept-Length:".$file_size); 
    Header("Content-Disposition: attachment; filename=".$file_name); 
    $buffer=1024;
    $file_count=0;
    //向浏览器返回数据
    while(!feof($fp) && $file_count<$file_size){
        $file_con=fread($fp,$buffer);
        $file_count+=$buffer;
        echo $file_con;
    }
	fclose($fp);
	exit();
?>