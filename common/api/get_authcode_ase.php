<?php
session_start();

require("http_post.php");
require_once("ase.php");
//获取平台获取验证码短信接口//Consigue la plataforma para obtener el código de verificación de la interfaz SMS.
$dataContent = file_get_contents("../data/server_api");
$apiData = json_decode($dataContent, true);
$url = $apiData["auth_host"];

//获取加密钥匙//Obtener la clave de cifrado
$dataContent = file_get_contents("../data/ase_api");
$aseData = json_decode($dataContent, true);
$privateKey = $aseData["privateKey"];
$iv = $aseData["iv"];
$mobile = $_REQUEST['mobile'];

//手机号码校验//Verificación de número de móvil
if(empty($mobile)) return;
//手机号码加密
$mobile = encrypt($mobile,$privateKey,$iv);
//手机号码解密
//$mobile = decrypt($mobile,$privateKey,$iv);

//平台发送短信//Cifrado de número móvil
$data = array(
	 'phone' => $mobile
);
//$result = http_post('http://172.16.22.150:61503/auth/getAuthCode.hd', $data);
//$result = @http_post('http://ruancan.eicp.net:61503/auth/getAuthCode.hd', $data);
$result = @http_post($url."/auth/getAuthCode.hd", $data);
//打印平台短信发送结果

echo $result;
exit();


?>
