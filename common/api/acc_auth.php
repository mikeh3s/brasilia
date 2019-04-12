<?php
session_start();
require_once("send_msg.php");
require_once("get_mac.php");

//校验上网类型//Verificar el tipo de acceso a internet.
if(!isset($_REQUEST['type'])) {

    echo json_encode(array('code' =>'type is null!' ));

    exit();

}
$ip = $_SERVER['REMOTE_ADDR'];
$mac = getMac($ip);
//上网类型(0、免费试用；1、短信验证上网；2、VIP(预留))
//Tipo de Internet (0, prueba gratuita; 1, verificación de SMS por Internet; 2, VIP (reservado))
//非短信认证，手机号码默认为0 //Autenticación sin SMS, el número de teléfono móvil por defecto es 0
$mobile = isset($_REQUEST['mobile'])?$_REQUEST['mobile']:'0000';
$type = $_REQUEST['type'];
//$expireNetFlow = $_REQUEST['expireNetFlow'];

//流量 //Trafico
$expireNetFlow = isset($_REQUEST['expireNetFlow'])?$_REQUEST['expireNetFlow']:null;
//时长 //Duración
$expireTime = isset($_REQUEST['expireTime'])?$_REQUEST['expireTime']:null;
//带宽 //Ancho de banda
$expireBandwidth = isset($_REQUEST['expireBandwidth'])?$_REQUEST['expireBandwidth']:null;

//socket消息内容 //Contenido del mensaje de socket
//socket消息内容
if($expireNetFlow && $expireTime && $expireBandwidth){
	$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\tEXPIRE_NET_FLOW=".$expireNetFlow."\tEXPIRE_TIME=".$expireTime."\tEXPIRE_BANDWIDTH=".$expireBandwidth."\t";

}else if($expireNetFlow && $expireTime){
	$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\tEXPIRE_NET_FLOW=".$expireNetFlow."\tEXPIRE_TIME=".$expireTime."\t";

}else if($expireNetFlow && $expireBandwidth){
	$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\tEXPIRE_NET_FLOW=".$expireNetFlow."\tEXPIRE_BANDWIDTH=".$expireBandwidth."\t";

}else if($expireTime && $expireBandwidth){
	$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\tEXPIRE_TIME=".$expireTime."\tEXPIRE_BANDWIDTH=".$expireBandwidth."\t";

}else if($expireNetFlow){
	$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\tEXPIRE_NET_FLOW=".$expireNetFlow."\t";

}else if($expireTime){
	$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\tEXPIRE_TIME=".$expireTime."\t";

}else if($expireBandwidth){
	$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\tEXPIRE_BANDWIDTH=".$expireBandwidth."\t";

}else{

	$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\t";
}

//$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\t";
//$reqMsg = "0000IP=".$ip."\tMAC=".$mac."\tTYPE=".$type."\tPHONE=".$mobile."\tEXPIRE_NET_FLOW=".$expireNetFlow."\t";

//上网类型为短信验证上网时，需要验证短信。
//Cuando el tipo de acceso a Internet es la autenticación de SMS, debe verificar el SMS.
if ($type == 1) {
	$result = @auth_socket($reqMsg);
	//shell_exec("短信认证 shell 命令");
  //Shell_exec ("Comando del shell de autenticación de SMS")
	//缓存鉴权状态（查询路由器列表和短信认证的时候发送）
  //Estado de autenticación de caché (enviado al consultar la lista de enrutadores y la autenticación de SMS)
	if($result["code"] == "ok"){
		echo json_encode($result);
	}else{
		echo json_encode( array( 'code' => '-1'));
	}

} else if($type == 2) {
	//shell_exec("直接上网 shell 命令"); //Shell_exec ("comando directo de shell de internet")
	$result = @auth_socket($reqMsg);
	if($result["code"] == "ok"){
		echo json_encode($result);
	}else{
		echo json_encode( array( 'code' => '-1'));
	}
} else if($type == 0) {
	//shell_exec("免费体验 shell 命令");
	$result = @auth_socket($reqMsg);
	if($result["code"] == "ok"){
		$_SESSION["isAuthed"]=true;
		echo json_encode($result);
	}else{
		echo json_encode( array( 'code' => '-1'));
	}
}

?>
