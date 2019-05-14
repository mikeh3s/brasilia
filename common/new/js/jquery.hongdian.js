(function($) {
	$.hongdian = {};
	//上报数据
	$.hongdian.uploadData = function (settings, callback) {
		var options = {
			resId : "",//资源编号
			resName : "",//资源名称
			resType : "",//资源类型
			click : 0,//点击次数
			view : 0,//浏览次数
			playDuration : 0,//播放时长
			totalDuration:0,//总时长
			flag : 0,//类别(0：普通资源，1：菜单，2：广告,3:apk,4:视频)
			from :""//从哪来
    	};
		$.extend(options, settings);
		console.log(options);
		$.post("../../common/api/upload_data.php", {headers:"userPortal_V1.4",options:options},
			function(data,status){
				if(typeof callback == "function"){callback(data);}
			},
			"json"
		);
	};
	//======
	//认证行为上报
	$.hongdian.userAuthBehavior = function (settings, callback) {
		var options = {
			behavior : "",//行为类型	1、注册；2、登录；3、获取验证码 Tipo de comportamiento 1, registro; 2, inicio de sesión; 3, obtener el código de verificación
			respStatus : "",//行为响应状//0、成功；-1、失败；-2、流量已用完；-3、网络未响应 Respuesta de comportamiento ///, éxito; -1, fallo; -2, el flujo se ha agotado; -3, la red no responde
			respMsg : "",//行为响应信息 Información de respuesta de comportamiento
			phone:""//手机号码 Número de móvil
    	};
		$.extend(options, settings);
		console.log(options);
		$.post("/common/api/upload_user_auth_behavior.php",  {headers:"userPortal_V1.4",options:options},
			function(data,status){
				if(typeof callback == "function"){callback(data);}
			},
			"json"
		);
	};
})(jQuery);
