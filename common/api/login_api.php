<?php
session_start();
require("http_post.php");
require_once("../api/get_termsn.php");
 require_once("get_mac.php");
//平台登录接口 //Interfaz de inicio de sesión de plataforma
$dataContent = file_get_contents("../data/server_api");
$apiData = json_decode($dataContent, true);
$url = $apiData["server_host"];

$ip = $_SERVER['REMOTE_ADDR'];
$mac = getMac($ip);
$termSn = getTermSn();
$mobile = $_REQUEST['mobile'];
$password = $_REQUEST['password'];
$type = $_REQUEST['type'];

$data = array(
	 'phone' => $mobile,
	 'password' => $password,
	 'ip' => $ip,
	 'mac' => $mac,
	 'type' => $type,
	 'termSn' => $termSn
);
$result = @http_post($url."/auth/login.hd", $data);
//$result = @http_post('http://ruancan.eicp.net:61503/auth/login.hd', $data);
//$result = @http_post('http://172.16.22.150:61503/auth/login.hd', $data);
//打印登录结果
echo $result;

//echo json_encode(array('code'=>'ok'));exit();
?>
