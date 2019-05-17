<?php
	// Inicia la session para poder validarla despues con la variable
	session_start();
	//La variable guarda el dato de que es igual a 1 para poder validarla
	//Este dato se destruye despues de un tiempo para hacer otra session
	// $user_name = $_REQUEST['fname'];
	// Variable para saber si ya hizo la encuesta	
	$user_poll_stat = "0";
	//Comentar desde este punto para hacer pruebas en PC
	// require_once("get_config.php");
	// require_once("get_ad.php");
	
	// if(isset($_REQUEST["preview"])){
	// 	$preview = $_REQUEST["preview"];
	// 	if(isset($_SESSION["preview"])) {
	// 			$_SESSION["preview"] = $preview;
	// 		}
	// 		else{
	// 				$_SESSION["preview"] = $preview;
	// 	}
	// }
	// else{
	// 		if(isset($_SESSION["preview"])) {
	// 				$preview = $_SESSION["preview"];
	// 			}
	// 	else{
	// 			require_once("init_data.php");
		
	// 			//apk需要服务器域名
	// 			//Requerir el nombre de dominio del servidor.
	// 		$domain = getDomain();
	// 		header("Host:".$domain);
	// 	}
	// }
	

	// $isModem = getModem(); //查询路由 //Ruta de consulta
	// $host= $_SERVER['HTTP_HOST'];
	
	// //读取全屏广告 //Leer anuncios a pantalla completa
	// //参数说明 第一个：广告位编号 第二个：当前时间 第三个：当前位置（站点）
	// //Descripción del parámetro Primero: Número de espacio publicitario Segundo: Hora actual Tercero: Posición actual (sitio)
	// $fullAd = getAd("010001", date("H"), "");
	// $interval = $fullAd["interval"];
	// $imgArr = $fullAd["img"];
	
	// //apk需要PHPSESSID认证来阻止广告弹出
	// //Apk requiere la autenticación PHPSESSID para evitar que aparezcan anuncios.
	// $sessionId = session_id();
	// header("Cookie: PHPSESSID=".$sessionId);
	
	// //获取跳转网址 //Obtener URL de salto
	// $dataContent = file_get_contents("../data/jump_url");
	// $apiData = json_decode($dataContent, true);
	// $url = $apiData["apk_jump_url"];
	// header("jumpUrl:".$url);
	// //获取平台服务器地址
	// //Obtener la dirección del servidor de la plataforma.
	// $serverDataContent = file_get_contents("../data/server_api");
	// $serverData = json_decode($serverDataContent, true);
	// $serverHost = $serverData["server_host"];
	// header("serverHost:".$serverHost);
	//Fin de la funcion que optiene Mac y SN
	
//Comentar hasta esta aera para hacer pruebas en PC 

// Sección de prueba
// Descomentar estas dos variables para hacer pruebas
 $macAdd = "20:54:fa:19:bf:74";
 $termSN = "9303MZH20180525004";

$type = '';
$modelIp = gethostbyaddr($_SERVER['REMOTE_ADDR']);

// Comentar estas dos varaibles para hacer pruebas
// $macAdd = $_SESSION["mac"];
// $termSN = $_SESSION["termSn"];
// Comentar estas dos varaibles para hacer pruebas

	$user_mac = $macAdd;
	$user_SN = $termSN;
	$user_session_stat = "1";
	setcookie("userMac", $user_mac);
	setcookie("userSN", $user_SN);
	setcookie("sessionStat" ,$user_session_stat);

$tablet_browser = 0;
$mobile_browser = 0;
$body_class = 'desktop';

if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
	 $tablet_browser++;
	 $body_class = "tablet";
}

if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
	 $mobile_browser++;
	 $body_class = "mobile";
}

if ((strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml') > 0) or ((isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE'])))) {
	 $mobile_browser++;
	 $body_class = "mobile";
}

$mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'], 0, 4));
$mobile_agents = array(
	 'w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac',
	 'blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno',
	 'ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-',
	 'maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-',
	 'newt','noki','palm','pana','pant','phil','play','port','prox',
	 'qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar',
	 'sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-',
	 'tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp',
	 'wapr','webc','winw','winw','xda ','xda-');

if (in_array($mobile_ua,$mobile_agents)) {
	 $mobile_browser++;
}

if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']),'opera mini') > 0) {
	 $mobile_browser++;
	 //Check for tablets on opera mini alternative headers
	 $stock_ua = strtolower(isset($_SERVER['HTTP_X_OPERAMINI_PHONE_UA'])?$_SERVER['HTTP_X_OPERAMINI_PHONE_UA']:(isset($_SERVER['HTTP_DEVICE_STOCK_UA'])?$_SERVER['HTTP_DEVICE_STOCK_UA']:''));
	 if (preg_match('/(tablet|ipad|playbook)|(android(?!.*mobile))/i', $stock_ua)) {
		 $tablet_browser++;
	 }
}
if ($tablet_browser > 0) {
// Si es tablet has lo que necesites
	$type = 'TABLET';
	$model = $modelIp;
}
else if ($mobile_browser > 0) {
// Si es dispositivo mobil has lo que necesites
	$type = 'MOVIL';
	$model = $modelIp;
}
else {
// Si es ordenador de escritorio has lo que necesites
	$type = 'PC';
	$model = $modelIp;
}

	date_default_timezone_set('America/Bogota');
try{
$data = array(
	'fname'  => empty($_REQUEST['name'])   ? NULL : (@$_REQUEST['name']),
	'email'  => empty($_REQUEST['email'])   ? NULL : (@$_REQUEST['email']),
	'phone'  => empty($_REQUEST['phone'])   ? NULL : (@$_REQUEST['phone']),
	'edad'   => empty($_REQUEST['age'])    ? NULL : (@$_REQUEST['age']),
	'genero' => empty($_REQUEST['gender'])  ? NULL : (@$_REQUEST['gender']),
	'serie_Dispo' => $termSN,
	'Fecha_ingre' => empty($_REQUEST['time'])  ? NULL : (@$_REQUEST['time']),
	'mac' 	=> $macAdd,
	'pmac' 	=> $type,
	'model'	=> $model
);
$data = http_build_query($data);
$data = urlencode($data);

@$fichero = file_get_contents("http://52.202.142.36/buswifi/proccess.php?dataString={$data}");
if(!@$fichero){
$data= array(
	'serie_Dispo' => $termSN,
	'sep'	 => '|',
	'Fecha_ingre' => empty($_REQUEST['time'])  ? NULL : (@$_REQUEST['time']),
	'sep1'	 => '|',
	'fname'  => empty($_REQUEST['name'])   ? NULL : (@$_REQUEST['name']),
	'sep2'	 => '|',
	'email'  => empty($_REQUEST['email'])   ? NULL : (@$_REQUEST['email']),
	'sep3'	 => '|',
	'phone'  => empty($_REQUEST['phone'])   ? NULL : (@$_REQUEST['phone']),
	'sep4'	 => '|',
	'edad'   => empty($_REQUEST['age'])    ? NULL : (@$_REQUEST['age']),
	'sep5'	 => '|',
	'genero' => empty($_REQUEST['gender'])  ? NULL : (@$_REQUEST['gender']),
	'sep6'	 => '|',
	'mac' => $macAdd,
	'sep7'	 => '|',
	'pmac' => $type,
	'sep8	'	 => '|',
	'model'	=> $model

);
    $file=fopen("subir.txt","a") or die("Problemas");
    //vamos añadiendo el contenido
    $salto=''. PHP_EOL ;
		foreach( $data as $linea ) 
		{
            fwrite( $file, $linea );	
		}
    fwrite($file,$salto);
    fclose($file);
	throw new Exception('success');

}

echo $fichero;

}catch(Exception $e){
 echo $e->getMessage();
}
?>
