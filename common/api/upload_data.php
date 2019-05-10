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


	//离线资源访问上报格式
	$reqMsg = "0020".$headers.'|'.$options."\r\n";

	//离线资源访问上报格式

	//$msg = 'userPortal_V1.4|{"devSn":"9303ZH201400000000","dialIp":"172.25.5.174","flowTime":"1442902533","upFlowSum":"2330487","downFlowSum":"96913040","upFlowDiff":"178404","downFlowDiff":"20800660"}';

	//socket 上报

	//判断是否保存预览session
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