<?php

//得到歌词
	session_start();
	$url = $_REQUEST['url'];
	
	/*$url = "../music/yangcong.lrc";*/
	if (!is_file($url)) {
		echo 'No lyric';
	} //文件不存在
	//echo $url;
	$lrc = file_get_contents($url);
	
	/*$format = mb_detect_encoding($lrc, 'UTF-8', true);
	
	if ($format) {
		$lrc = iconv("utf-8", "utf-8//IGNORE", $lrc);
	} else {
		$lrc = iconv("gbk", "utf-8//IGNORE", $lrc); //gbk转utf-8
	}*/
	
	echo $lrc;
	exit();
?>

<html>
<head>
<title>test</title>
</head>
<body>
<div>test content</div>
</body>
</html>