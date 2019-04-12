<?php
session_start();
require("http_post.php");
require_once("get_mac.php");
//平台登录接口 // Interfaz de inicio de sesión de plataforma
$dataContent = file_get_contents("../data/server_api");
$apiData = json_decode($dataContent, true);
$url = $apiData["server_host"];
$ip = $_SERVER['REMOTE_ADDR'];
$mac = getMac($ip);
//mac校验
if(empty($mac)) return;

$data = array(
	 'mac' => $mac
);
$result = @http_post($url."/auth/checkUserInfo.hd", $data);
//$result = @http_post('http://ruancan.eicp.net:61503/auth/checkUserInfo.hd', $data);
//$result = @http_post('http://172.16.22.150:61503/auth/checkUserInfo.hd', $data);
//打印登录结果 //Imprimir el resultado de inicio de sesión
echo $result;
exit();
?>
