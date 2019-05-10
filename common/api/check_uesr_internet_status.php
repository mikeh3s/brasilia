<?php
 require_once("get_mac.php");
 $ip = $_SERVER['REMOTE_ADDR'];
 $mac = getMac($ip);
 $mac = strtoupper($mac);//字符转成大写 // Convertir caracteres a mayúsculas
 $command = "iptables -t mangle -nvL internet |grep";
 $result = shell_exec("iptables -t mangle -nvL internet |grep ".$mac);
 if (isset($result)) {
	echo json_encode( array( 'code' => '0'));
 }else {
	echo json_encode( array( 'code' => '-1'));
 }
?>
