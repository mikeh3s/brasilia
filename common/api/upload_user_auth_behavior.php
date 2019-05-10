<?php
	session_start();
	require_once("send_msg.php");
	require_once("get_mac.php");
	require_once("get_termsn.php");

	$headers = $_REQUEST["headers"];

	$options = $_REQUEST["options"];

	$ip = $_SERVER['REMOTE_ADDR'];

	$userMac = getMac($ip);

	$options["userMac"] = $userMac;

	$options["termSn"] = getTermSn();

	$options["time"] = time();

	$options = json_encode($options,JSON_UNESCAPED_UNICODE);


	//离线资源访问上报格式 Formato de informes de acceso a recursos fuera de líneas
	$reqMsg = "0020".$headers.'|'.$options."\r\n";


	//socket 上报

	//判断是否保存预览session Determine si desea guardar la sesión de vista previa
	if(isset($_SESSION["preview"])) {
		$preview = $_SESSION["preview"];
		echo $preview;
	}
	else{
		uploadData($reqMsg);
	}

	function uploadData($reqMsg) {
		access_socket($reqMsg);
		//echo json_encode(array('code'=>'1'));
		echo json_encode( array( 'code' => 'ok'));
	}
	exit();

?>
