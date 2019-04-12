<?php

class LoginController extends Controller {

	//查询用户是否在线(放行外网) //Compruebe si el usuario está en línea (libere la red externa)
	public function checkInternetStatus() {
		$status = Device::getInternetStatus();
		if ($status) {
			return json_encode(array('code' => '0'));
		} else {
			return json_encode(array('code' => '1'));
		}
	}
	//按时间免费上网，默认5分钟 //Acceso gratuito a internet por tiempo, por defecto 5 minutos.
	public function freeSurf() {
		$ip = $_SERVER['REMOTE_ADDR'];
		$userMac = Device::getMac();
		$userId = "10086";//没有USERID的用户，默认ID //Usuario sin ID de usuario, ID por defecto
		$expireTime = "300";//设定上网超时时间 0表示不限时 //Establecer el tiempo de espera en línea 0 significa tiempo ilimitado
		$surplusFlow = "0";//单位为MB,0表示不限流量 //La unidad es MB, 0 significa flujo ilimitado.
		$isAuth = Device::accAuth($ip, $userMac, 1, $userID, md5($userID),$userID, $surplusFlow,$expireTime);
		return json_encode(array('code' => '0'));
	}
	//检查用户是否注册 //Compruebe si el usuario está registrados
	public function checkRegister() {
		$ip = $_SERVER['REMOTE_ADDR'];
		$userMac = Device::getMac();
		$deviceId = Device::getTermSn();

		$account = 'RyanPortal';
		$accountType = Config::get('vserver.alAccountType');
		$comeFrom = Config::get('vserver.alComeFrom');
		$expireTime = "0";//设定上网超时时间 0表示不限时 //Establecer el tiempo de espera en línea 0 significa tiempo ilimitado
		$data = array(
			'RM_JUGG' => json_encode(array(
				'deviceId' => $deviceId,
				'userMac' => $userMac,
				'account' => $account,
				'accountType' => $accountType,
				'comeFrom' => $comeFrom,
			)),
		);

		//上报点击事件
		//		$msg = "LocalRes|User_Mac=" . $userMac . ";Res_ID=" . "0001" . ";Res_Name=" . "一键上网点击" . ";Res_Type=" . "00" . ";Click=" . "1" . ";View=" . "0" . ";Flag=" . "0" . ";From=" . "01" . ";Access_Time=" . time() . ";\r\n";
		//$record = new Record($devSn, $userMac, time(), 'P0F0002', 'P0F05', '一键上网', $from, 'F01', $actResult = '', $extra = '');
		//socket 上报
		//		Device::access_socket("0020" . $msg);

		// $isModem = Device::getModem(); //查询路由

		// if (!$isModem) {
		// 	//路由不存在,当前网络不通
		// 	return json_encode(array('code' => '3'));
		// }

		try {
			$result = Utils::http_post(Config::get('vserver.antelopHost') . 'user/login', $data);
			$result = json_decode($result);

			if ($result->code === 'err.user.not.exists') {
				//用户不存在  未注册
				//El usuario no existe No registrado
				return json_encode(array('code' => '1'));
			} else if ($result->code === 'SUCCESS') {

//				Device::loginAuthBehavior("2", "0", "一键登录成功", $result->data->userInfo->userId);
				//成功,可以访问,给予放行
				$surplusFlow = $result->data->userInfo->leftFlow; //剩余流量,totalFlow(总流量),consumeFlow(消费流量)
				if ($surplusFlow === 0) {
//					Device::loginAuthBehavior("1", "-2", "流量已用完", $result->data->userInfo->userId);
					return json_encode(array('code' => '2')); //流量用完
				}
				$isAuth = Device::accAuth($ip, $userMac, 1, $result->data->userInfo->userId, md5($result->data->userInfo->userId),$result->data->userInfo->userId, sprintf("%.2f", $surplusFlow / (1024 * 1024)),$expireTime);
				return json_encode(array('code' => '0'));
			} else {
				//服务器异常
				return json_encode(array('code' => '3'));
			}
		} catch (Exception $e) {
			return json_encode(array('code' => '3'));
		}
	}

	public function getAuthCode() {
		$userMac = Device::getMac();
		//上报点击事件
		//		$msg = "LocalRes|User_Mac=" . $userMac . ";Res_ID=" . "0002" . ";Res_Name=" . "获取验证码" . ";Res_Type=" . "00" . ";Click=" . "1" . ";View=" . "0" . ";Flag=" . "0" . ";From=" . "01" . ";Access_Time=" . time() . ";\r\n";

		//socket 上报
		//		Device::access_socket("0020" . $msg);

		$phone = $_REQUEST['phone'];

		//date_default_timezone_set("Asia/Shanghai");
		$timestamp = date('YmdHis');

		$key = Config::get('vserver.alKey');
		$secret = Config::get('vserver.alSecret');
		$token = md5($key . $phone . $timestamp . $secret);

		$data = array(
			'RM_JUGG' => json_encode(array(
				'timestamp' => $timestamp,
				'phone' => $phone,
				'key' => $key,
				'token' => $token,
			)),
		);

		try {
			$result = Utils::http_post(Config::get('vserver.antelopHost') . 'user/vcode', $data);
			$result = json_decode($result);
			if ($result->code === 'SUCCESS') {
				//成功 获取验证码上报
				//				Device::loginAuthBehavior("3", "0", "验证码获取成功", $phone);
				return json_encode(array('code' => '0'));
			} else if ($result->code === 'err.user.exists') {
				//用户已存在
				return json_encode(array('code' => '3'));
			} else {
				//超时,请求短信服务失败
				//				Device::loginAuthBehavior("3", "-1", "验证码返回失败", $phone);
				return json_encode(array('code' => '1'));
			}
		} catch (Exception $e) {
//			Device::loginAuthBehavior("3", "-3", "验证码网络未响应", $phone);
			return json_encode(array('code' => '2'));
		}
	}

	//验证手机号和验证码
	public function doValidate() {
		$ip = $_SERVER['REMOTE_ADDR'];
		$userMac = Device::getMac();
		//上报点击事件
		//		$msg = "LocalRes|User_Mac=" . $userMac . ";Res_ID=" . "0003" . ";Res_Name=" . "登录点击" . ";Res_Type=" . "00" . ";Click=" . "1" . ";View=" . "0" . ";Flag=" . "0" . ";From=" . "01" . ";Access_Time=" . time() . ";\r\n";

		//socket 上报
		//		Device::access_socket("0020" . $msg);

		$deviceId = Device::getTermSn();

		$mobile = $_REQUEST['phone'];
		$validCode = $_REQUEST['authcode'];
		$account = $mobile;

		//date_default_timezone_set("Asia/Shanghai");
		$timestamp = date('YmdHis');

		$accountType = Config::get('vserver.alAccountType');
		$comeFrom = Config::get('vserver.alComeFrom');
		$key = Config::get('vserver.alKey');
		$secret = Config::get('vserver.alSecret');
		$token = md5($account . $accountType . $comeFrom . $deviceId . $key . $timestamp . $userMac . $validCode . $secret);

		$data = array(
			'RM_JUGG' => json_encode(array(
				'timestamp' => $timestamp,
				'deviceId' => $deviceId,
				'userMac' => $userMac,
				'account' => $account,
				'accountType' => $accountType,
				'comeFrom' => $comeFrom,
				'validCode' => $validCode,
				'key' => $key,
				'token' => $token,
			)),
		);

		try {
			//认证上报
			// $msg = "UserRegister|User_Mac=" . $userMac . ";IP=" . $ip . ";Phone=" . $mobile . ";Term_Sn=" . $deviceId . ";Register_Time=" . time() . ";\r\n";
			// Device::access_socket("0020" . $msg);

			$result = Utils::http_post(Config::get('vserver.antelopHost') . "user/register", $data);
			$result = json_decode($result);

			if ($result->code === 'SUCCESS') {
//				Device::loginAuthBehavior("1", "0", "注册成功", $mobile);
				//成功,可以访问,给予放行
				$surplusFlow = $result->data->userInfo->leftFlow; //剩余流量,totalFlow(总流量),consumeFlow(消费流量)

				if ($surplusFlow === 0) {
//					Device::loginAuthBehavior("1", "-2", "流量已用完", $mobile);
					return json_encode(array('code' => '2')); //流量用完
				}

				$isAuth = Device::accAuth($ip, $userMac, 1, $result->data->userInfo->userId, md5($result->data->userInfo->account), $result->data->userInfo->sid, sprintf("%.2f", $surplusFlow / (1024 * 1024)),$expireTime);
				if ($isAuth) {
					//	setcookie('phone', $mobile, time() + 3600 * 24 * 30); //放入cookie
					return json_encode(array('code' => '0'));
				}
			} else if ($result->code === 'err.user.vcode.invalid') {
//				Device::loginAuthBehavior("1", "-1", "验证码输入错误", $mobile);
				return json_encode(array('code' => '1')); //验证码不正确
			} else {
				return json_encode(array('code' => '4')); //timestame超时,请求参数错误,token验证失败,请求短信服务失败
			}
		} catch (Exception $e) {
//			Device::loginAuthBehavior("1", "-3", "注册网络未响应", $mobile);
			return json_encode(array('code' => '3')); //网络异常
		}
	}
}
