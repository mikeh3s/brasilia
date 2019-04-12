<?php
session_start();
require("http_post.php");
require_once("../api/get_termsn.php");
 require_once("get_mac.php");
//平台登录接口
$dataContent = file_get_contents("../data/server_api");
$apiData = json_decode($dataContent, true);
$url = $apiData["server_host"];

$ip = $_SERVER['REMOTE_ADDR'];
$mac = getMac($ip);
$termSn = getTermSn();
$accId = $_REQUEST['accId'];
$regType = $_REQUEST['regType'];
$type = $_REQUEST['type'];
$uesrName = $_REQUEST['uesrName'];
$email = $_REQUEST['email'];
$city = $_REQUEST['city'];
$country = $_REQUEST['country'];
$age = $_REQUEST['age'];
$data = array(
	 'accId' => $accId,
	 'regType' => $regType,
	 'ip' => $ip,
	 'mac' => $mac,
	 'type' => $type,
	 'termSn' => $termSn,
	 'uesrName' => $uesrName,
	 'email' => $email,
	 'city' => $city,
	 'country' => $country,
	 'age' => $age
);
//var_dump($data);
$result = @http_post($url."/auth/tripartiteLogin.hd", $data);
//$result = @http_post('http://172.16.22.39:8080/auth/tripartiteLogin.hd', $data);
//http://172.16.22.39:8080/auth/tripartiteLogin.hd?type=1&accId=venlley@126.com&uesrName=weyli&email=venlley@126.com&city=shenzhen&country=CN&age=&regType=facebook&ip=172.16.22.29&mac=14:da:e9:69:19:56&termSn=wuyansuo9303
//打印登录结果
echo $result;

//echo json_encode(array('code'=>'ok'));exit();
?>
