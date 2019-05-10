<?php
 session_start();
 require("http_post.php");
 require_once("get_termsn.php");
 require_once("get_mac.php");
 require_once("send_msg.php");
 //平台注册接口 //Interfaz de registro de plataforma
 $dataContent = file_get_contents("../data/server_api");
 $apiData = json_decode($dataContent, true);
 $url = $apiData["server_host"];

 $ip = $_SERVER['REMOTE_ADDR'];
 $mac = getMac($ip);
 $termSn = getTermSn();
 $mobile = $_REQUEST['mobile'];
 $code = $_REQUEST['auth_code'];
 $password = $_REQUEST['password'];
 $type = $_REQUEST['type'];
 $resetPwd = $_REQUEST['resetPwd'];
 $data = array(
 	 'phone' => $mobile,
 	 'code' => $code,
 	 'password' => $password,
 	 'ip' => $ip,
 	 'mac' => $mac,
 	 'type' => $type,
 	 'termSn' => $termSn,
 	 'resetPwd' => $resetPwd
 );
$time = time();
$msg = "UserRegister|User_Mac=".$mac.";IP=".$ip.";Phone=".$mobile.";Term_Sn=".$termSn.";Register_Time=".$time.";\r\n";
//认证上报 //Informe de certificacion
access_socket("0020".$msg);
$result = @http_post($url."/auth/register.hd", $data);
 //$result = @http_post('http://ruancan.eicp.net:61503/auth/register.hd', $data);
 //打印登录结果
 echo $result;
 exit();


//echo json_encode(array('code'=>'ok'));exit();
?>
