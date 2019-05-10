<?php
	/**
	 * 路由器中读取配置文件
	 * 参数：配置名称
	 *Spanish:
	 *Lea el archivo de configuración en el enrutador
	 *Parámetro: nombre de configuración
	 */
	function getConfig($file, $param) {
		$value = "";
		$file = fopen($file,"r");
		while(!feof($file)) {
			//读取一条记录
			//Lee registro
			$line = fgets($file);
			if (strpos($line, $param) === 0) {
				$arr = explode("=",$line);
				$value = trim($arr[1]);
				break;
			}

		  }
		//关闭文件
		//Cierra el archvo
		fclose($file);
		return $value;
	}

	/**
	 * 路由器中读取run.config配置文件
	 *Lee el archivo run.config en el enrutador
	 * 参数：配置名称
	 *Parametro: $param Nombre de la configuracion
	 */
	function getRunConfig($param) {
		return getConfig("/tmp/hdconfig/run.conf", $param);
	}


	/**
	 * 路由器中读取cli.conf配置文件
	 *Lee el archivo de configuración cli.conf en el enrutador
	 * 参数：配置名称
	 *Parametro: $param Nombre de la configuracion
	 */
	function getCliConfig($param) {
		//return getConfigofCli("/tmp/hdconfig/cli.conf", $param);
		$value = "";
		$file = fopen("/tmp/hdconfig/cli.conf","r");
		while(!feof($file)) {
			//读取一条记录
			//Lee un registro
			$line = fgets($file);
			if (strpos($line, $param) === 0 || strpos($line, $param) > 0) {
				$line = str_replace($param,"",$line);
				$arr = explode("/",$line);
				$value = trim($arr[0]);
				break;
			}

		  }
		//关闭文件
		//Cierra el archivo
		fclose($file);
		return $value;
	}


	/**
	 * 路由器中读取设备ip
	 *Leer el dispositivo ip en el enrutador
	 * 参数：配置名称
	 *Parámetro: nombre de configuración
	 */
	function getIpAddress(){
		return getCliConfig("ip address");
	}


	/**
	 * 路由器中读取device.info配置文件
	 *Lea el archivo de configuración de device.info en el router
	 * 参数：配置名称
	 *Parámetro: nombre de configuración
	 */
	function getDeviceConfig($param) {
		return getConfig("/tmp/device.info", $param);
	}

	/**
	 * 获取本地域名
	 *Obtiene un nombre de dominio local
	 */
	function getDomain() {
		return getRunConfig("domain address");
	}

	/**
	 * 获取认证服务器地址
	 *Obtener la dirección del servidor de autenticación
	 */
	function getAuthHost() {
		return getRunConfig("auth host");
	}

	/**
	 * 获取欢迎页
	 *Recibe la página de bienvenida
	 */
	function getWelcome() {
		return getRunConfig("page welcome");
	}

	/**
	 * 获取设备编号
	 *Obtener número de dispositivo
	 */
	function getTermSn() {
		return getDeviceConfig("Device_SN");
	}

	/**
	 * 获取设备mac
	 *Obtener dispositivo mac
	 */
	function getApMac() {
		return getDeviceConfig("AP_MAC");
	}


	/**
	 * 获取上网时长
	 *Obtener tiempo en linea
	 */
	function getexpireTime() {
		return getRunConfig("expire time");
	}

	/*
	 *	检查当前网络信号
	 *Comprueva la señal de red actual
	 */
	function getModem() {
		//$modem = shell_exec("route -n | grep modem"); //3G卡
		$modem = shell_exec("route -n | grep eth0"); //有线
		return isset($modem);
	}

	//测试
	//Prueba
	//echo "==".getTermSn()."==";
	//echo "==".getIpAddress()."==";
?>
