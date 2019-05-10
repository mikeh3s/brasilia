<?php
//session_start();
/*
 *	author: Ryan nan
 *	设备厂商提供的接口整合(以下为宏电DEMO，可修改)
 *	Integración de la interfaz proporcionada por los
 *	fabricantes de equipos (la siguiente es la DEMO de Hongdian, que se puede modificar)
 */
class Device {

	//得到设备mac
	//Obtener dispositivo mac
	public static function getMac() {

		$ip = $_SERVER['REMOTE_ADDR'];

		$arp = "arp";

		$mac = shell_exec("$arp -n " . $ip);

		preg_match('/..:..:..:..:..:../', $mac, $matches);

		@$mac = $matches[0];

		if (!isset($mac)) {

			//return '44:8A:5B:C9:EA:FF'; //测试时用pc无效
			return;

		} else {

			return $mac;

		}
	}

	/**
	 * 获取设备编号
	 *Obtener número de dispositivo
	 */
	public static function getTermSn() {
		return Device::getDeviceConfig("Device_SN");
	}

	/*
	 *	检查当前网络信号
	 *Compruebe la señal de red actual
	 */
	public static function getModem() {
		$modem = shell_exec("route -n | grep modem"); //3G卡
		//$modem = shell_exec("route -n | grep eth0"); //有线
		echo $modem;
		return isset($modem);
	}

	/*
	 *	查询用户是否在线(放行)，是否可以连接外网
	 *Pregunte si el usuario está en línea (versión), si puede conectarse a la red externa
	 */
	public static function getInternetStatus() {
		$mac = strtoupper(Device::getMac()); //字符转成大写//Convertir caracteres a mayúsculas
		$status = shell_exec("iptables -t mangle -nvL internet |grep " . $mac);
		return isset($status);
	}

	/*
	 *	查询当前是3G还是4G信号及信号值
	 *Pregunta si es una señal 3G o 4G y un valor de señal
	 */
	public static function getSignal() {
		 $command = "cat /tmp/modem.info |grep nettype";
		 $nettype = "";
		 //$command =  "cat /tmp/modem.info |grep nettype | awk '{print $1}'";
		 $result = shell_exec($command);
		 $resultArr =  explode(":",$result);
		 if ($resultArr[1]) {
			$result = strtolower($resultArr[1]);
			$pos = strpos($result,"lte");
			if($pos !== false){
				$nettype = '4G';
			}else{
				$nettype = '3G';
			}
		 }
		$signal = shell_exec("cat /tmp/modem.info | grep csq | awk -F':' '{print  $2}'");
		return $nettype."-".$signal;
	}

	/*
	 *	查询当前固件版本号
	 *Consultar el número de versión actual del firmware
	 */
	public static function getDeviceVersion() {
		$version = shell_exec("cat /tmp/device.info | grep AppVersion | awk -F'=' '{print  $2}'");
		return $version;
	}

	/*
	 *	查询当前DNS IP地址
	 *Consulta la dirección IP actual del DNS
	 */
	public static function getDNSServer() {
		$server = shell_exec("nslookup www.baidu.com | grep Server | awk -F':' '{print  $2}'");
		return $server;
	}

	//放行//Liberar
	public static function accAuth($ip, $mac, $type, $userId, $account, $sid, $surplusFlow,$expireTime) {

		//socket消息内容
		$reqMsg = "0000IP=" . $ip . "\tMAC=" . $mac . "\tTYPE=" . $type . "\tPHONE=" . $account . "\tEXPIRE_NET_FLOW=" . $surplusFlow . "\tEXPIRE_TIME=" .$expireTime;
		$_SESSION['userId'] = $userId;
		//上网类型(0、免费试用；1、短信验证上网；2、VIP(预留)) //Tipo de Internet (0, prueba gratuita; 1, verificación de SMS por Internet; 2, VIP (reservado)
		//上网类型为短信验证上网时，需要验证短信。//Cuando el tipo de acceso a Internet es la autenticación de SMS, debe verificar el SMS.
		if ($type == 1) {
			$result = Device::auth_socket($reqMsg);
			//shell_exec("短信认证 shell 命令"); //Comando de shell de autenticación de SMS
			//缓存鉴权状态（查询路由器列表和短信认证的时候发送） //Estado de autenticación de caché (enviado al consultar la lista de enrutadores y la autenticación de SMS)
			if ($result["code"] == "ok") {
				return true;
			} else {
				return false;
			}

		} else if ($type == 2) {
			//shell_exec("直接上网 shell 命令");
			$result = Device::auth_socket($reqMsg);
			if ($result["code"] == "ok") {
				return ture;
			} else {
				return false;
			}
		} else if ($type == 0) {
			$result = Device::auth_socket($reqMsg);
			if ($result["code"] == "ok") {
				$_SESSION["isAuthed"] = true;
				return ture;
			} else {
				return false;
			}
		}
	}

	//日志上报 //Informe de registro
	public static function uploadData($msg) {
		$mac = Device::getMac();
		$termSn = Device::getTermSn();
		$userId = isset($_SESSION['userId'])?$_SESSION['userId']:"";
		$time = time();
		$len = strlen($msg);
		$temp = "";
		$extra = array("devId"=>$termSn,"userId"=>$userId,"userMac" => $mac,"time"=>$time);

		if ($len > 0 &&($de_json = json_decode($msg,JSON_UNESCAPED_UNICODE)) != "null")
		{
			if ($msg[0] != '[')
			{
				$de_json = array_merge($extra,$de_json);
				$temp = "0020userPortal_V0.1|";
				$temp .= json_encode($de_json,JSON_UNESCAPED_UNICODE);
				$temp .= "\r\n";
			}
			else
			{
				$count_json = count($de_json);
				$temp = "0020";

				for ($i = 0; $i < $count_json; $i++)
				{
					$de_json[$i] = array_merge($extra,$de_json[$i]);
					$temp_buf = (string)"userPortal_V0.1|".(string)json_encode($de_json[$i],JSON_UNESCAPED_UNICODE)."\r\n";
					$temp_buf_len = strlen($temp_buf);
					$temp_len = strlen($temp);

					if ($temp_len + $temp_buf_len >= 2048)
					{
						Device::access_socket($temp);
						$temp = "0020";
					}
					$temp .= $temp_buf;
				}
			}
			$msg = $temp;
		}

		#echo $msg;
		Device::access_socket($msg);
	}

	//=======================================================
	//=======================================================
	//=======================================================
	// 以下所有方法都为宏电私有扩展方法，设备厂商根据自身情况扩展
	//Todos los métodos siguientes son métodos de extensión macrospivada y los proveedores de dispositivos se expanden según sus propias condiciones.
	//=======================================================
	//=======================================================
	//=======================================================

	/**
	 * 路由器中读取配置文件
	 *Lea el archivo de configuración en el enrutador
	 * 参数：配置名称
	 *Parámetro: nombre de configuración
	 */
	public static function getConfig($file, $param) {
		$value = "";
		$file = fopen($file, "r");
		while (!feof($file)) {
			//读取一条记录
			//Leer un registro

			$line = fgets($file);
			if (strpos($line, $param) === 0) {
				$arr = explode("=", $line);
				$value = trim($arr[1]);
				break;
			}

		}
		//关闭文件
		fclose($file);
		return $value;
	}

	/**
	 * 路由器中读取run.config配置文件
	 * 参数：配置名称
	 */
	public static function getRunConfig($param) {
		return Device::getConfig("/tmp/hdconfig/run.conf", $param);
	}

	/**
	 * 路由器中读取device.info配置文件
	 *Lea el archivo de configuración de device.info en el router
	 * 参数：配置名称
	 *Parámetro: nombre de configuración
	 */
	public static function getDeviceConfig($param) {
		return Device::getConfig("/tmp/device.info", $param);
	}

	/*
	 * 发送SOCKET消息 //Enviar un mensaje de SOCKET
	 * 无返回消息 //No hay mensaje de retorno
	 */
	public static function sendMsg($reqMsg, $server_side_sock) {
		try {
			// create unix udp socket
			$socket = socket_create(AF_UNIX, SOCK_DGRAM, 0);
			if (!$socket) {
				return -1;
			}

			// use socket to send data
			if (!socket_set_nonblock($socket)) {
				socket_close($socket);
				return -3;
			}

			// 对端端口
			//$server_side_sock = "/tmp/jifei.sock";
			//$server_side_sock = "/tmp/statistical.sock";

			$len = strlen($reqMsg);

			$bytes_sent = socket_sendto($socket, $reqMsg, $len, 0, $server_side_sock);
			if ($bytes_sent == -1) {
				socket_close($socket);
				return -4;
			} else if ($bytes_sent != $len) {
				socket_close($socket);
				return -5;
			}
			// close socket and delete own .sock file
			socket_close($socket);

			//socket 消息日志 // Registro de mensajes
			file_put_contents('/tmp/socket_msg', $reqMsg, FILE_APPEND + LOCK_EX);

		} catch (Exception $e) {
			$errorMsg = 'Error on line ' . $e->getLine() . ' in ' . $e->getFile() . ': ' . $e->getMessage();
			error_log($errorMsg, 0);
		}
	}

	/*
	 * 发送SOCKET消息
	 * 有返回消息
	 */
	public static function sendMsgWithRep($reqMsg, $server_side_sock) {
		try {
			// create unix udp socket
			$socket = socket_create(AF_UNIX, SOCK_DGRAM, 0);
			if (!$socket) {
				//error_log( "Unable to create AF_UNIX socket."."<br>", 0 );
				//throw new Exception("Unable to create AF_UNIX socket.");
				return -1;
			}

			/*本地侦听端口*/
			$client_side_sock = "/tmp/statistical_ack.sock";
			if (!socket_bind($socket, $client_side_sock)) {
				//error_log( "Unable to bind to $client_side_sock"."<br>", 0 );
				//throw new Exception("Unable to bind to $client_side_sock");
				return -2;
			}

			// use socket to send data
			if (!socket_set_nonblock($socket)) {
				//error_log( "Unable to set nonblocking mode for $socket"."<br>", 0 );
				//throw new Exception("Unable to set nonblocking mode for $socket");
				socket_close($socket);
				unlink($client_side_sock);
				return -3;
			}

			// 对端端口
			//$server_side_sock = "/tmp/statistical.sock";

			$len = strlen($reqMsg);

			// at this point 'server' process must be running and bound to receive from serv.sock
			$bytes_sent = socket_sendto($socket, $reqMsg, $len, 0, $server_side_sock);
			if ($bytes_sent == -1) {
				//error_log( "An error occured while sending to the $socket"."<br>", 0 );
				//throw new Exception("An error occured while sending to the $socket");
				socket_close($socket);
				unlink($client_side_sock);
				return -4;
			} else if ($bytes_sent != $len) {
				//error_log( $bytes_sent." bytes have been sent instead of the". $len . " bytes expected"."<br>", 0 );
				//throw new Exception($bytes_sent." bytes have been sent instead of the". $len . " bytes expected");
				socket_close($socket);
				unlink($client_side_sock);
				return -5;
			}

			//sleep(3);

			$re = "";
			$count = 0;
			while (1) {
				usleep(10);
				$bytes_sent = @socket_recvfrom($socket, $re, 256, 0, $server_side_sock);
				if ($bytes_sent > 0) {
					break;
				}
				$count++;
				if ($count > 500) //超时5秒
				{
					break;
				}
			}

			// close socket and delete own .sock file
			socket_close($socket);
			unlink($client_side_sock);
			//socket 消息日志
			file_put_contents('/tmp/socket_msg', $reqMsg, FILE_APPEND + LOCK_EX);

			return $re;
			//return 0;

		} catch (Exception $e) {
			$errorMsg = 'Error on line ' . $e->getLine() . ' in ' . $e->getFile() . ': ' . $e->getMessage();
			error_log($errorMsg, 0);
		}
	}

	/**
	 *	认证socket
	 *
	 */
	public static function auth_socket($reqMsg) {
		Device::sendMsg($reqMsg, "/tmp/jifei.sock");
		//return json_encode( array( 'code' => 'ok'));
		return array('code' => 'ok');
	}

	/*
	 *	资源上报socket
	 */
	public static function access_socket($reqMsg) {
		Device::sendMsg($reqMsg, "/tmp/statistical.sock");
		return json_encode(array('code' => 'ok'));
	}

	public static function loginAuthBehavior($behavior, $respStatus, $respMsg, $phone) {
		$mac = Device::getMac();
		$ip = $_SERVER['REMOTE_ADDR'];
		//behavior :1、注册；2、登录；3、获取验证码//Comportamiento: 1, registro; 2, inicio de sesión; 3, obtener el código de verificación
		//respStatus:0、成功；-1、失败；-2、流量已用完；-3、网络未响应//respStatus: 0, éxito; -1, error; -2, el tráfico se ha agotado; -3, la red no responde
		$msg = "UserAuthBehav|User_Mac=" . $mac . ";Ip=" . $ip . ";Phone=" . $phone . ";Time_Stamp=" . time() . ";Behavior=" . $behavior . ";Resp_Status=" . $respStatus . ";Resp_Msg=" . $respMsg . ";\r\n";
		Device::access_socket("0020" . $msg);
	}
}
?>
