// 设置cookie
 function setCookie(c_name, value, expiredays) {
	var exdate = new Date()
	exdate.setTime(exdate.getTime() + expiredays);
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
//获取cookie
function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if (c_start != -1) {
			c_start = c_start + c_name.length+1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1)
				c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	} else {
		return "";
	}
}
//删除cookie
function delCookie(c_name) 
{ 
    var exdate = new Date()
    exdate.setTime(exdate.getTime() - 1); 
    var cval=getCookie(c_name); 
    if(cval!=null) 
    document.cookie= c_name + "="+cval+";expires="+exdate.toGMTString(); 
} 
//==
//获取url参数值
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null){
       return unescape(r[2]);
	}else{
       return null;
	}
}

//对手机号加密
function phoneEncrypt(phone){
	 var firstSrt = phone.substr(0,1);
	 var secondStr = phone.substr(1,2);
	 var thirdStr = phone.substr(3,4);
	 var fourthStr = phone.substr(7,4);
	 var user = firstSrt+",12,"+secondStr+",1\t,"+thirdStr+",2\n,"+fourthStr;
	 phone = escape(user);
	 return phone;
}

//对手机号解密
function phoneDecryption(phone){
	 phone = unescape(phone);
	 phoneArr = phone.split(",");
	 phone = phoneArr[0] + phoneArr[2] + phoneArr[4] + phoneArr[6];
	 return phone;
}

//=======================
//是否苹果
var isApple = function(){
    var os = navigator.platform.toLowerCase();
    if(os.indexOf("ipad") != -1 || os.indexOf("iphone") != -1 ){
        return true;    
    }
    return false;
};

//===
//认证行为上报
var userAuthBehavior = function(behavior,respStatus,respMsg,phone){
	 $.hongdian.userAuthBehavior({
		behavior : behavior,//行为类型	1、注册；2、登录；3、获取验证码
		respStatus : respStatus,//行为响应状0、成功；-1、失败；-2、流量已用完；-3、网络未响应
		respMsg : respMsg,//行为响应信息
		phone:phone//手机号码
  });
}


/**
 *  pageViewUploadData() 注册页面曝光上报
 *  参数说明：
 */
function pageViewUploadData(){
	var resId = $(".menu-ul li.cur_menu").attr('id');//一级菜单id
	var resName = $(".menu-ul li.cur_menu").text();
	var resType = resId;
	$.hongdian.uploadData({
		resId:resId,
		resName:resName,
		resType:resType,
		view:1,
		click:0,
		//flag:0
		flag:1
	}, function() {
	});
};