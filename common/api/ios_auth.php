<?php
	session_start();
	require_once("get_mac.php");
    $ip = $_SERVER['REMOTE_ADDR'];
	$mac = getMac($ip);
	
	shell_exec("echo ".$ip." > /tmp/ios_".$mac);
?>