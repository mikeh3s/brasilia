/**
 * Created by qhao on 2015/4/27.
 */
var JumpUrl="";
var appId = "";
var clientId = "";
var mid = "0701";//当前页面编号
var dir = "../../advertisement/data/";
var adImgheight = 200;//top广告图片高度
var logintype = "";
var isModem;
$(function(){
    $("#internetNotOK").css("display","none");//暂时不能上网提醒默认隐藏
    var userInfo = getQueryString("userInfo");

    getInternetModem();//获取当前网络状态

    getDefaultCheckValue(userInfo);//默认协议选中状态

    if(userInfo){
        console.log("userInfo:",userInfo);
        userInfo = phoneDecryption(userInfo);
        $('#otherInfoTab a:last').tab('show');//初始化显示哪个tab
        logintype = 'facebook';

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        getJumpurl();//获取跳转网址

        getFacebookAppId(userInfo);//获取facebook appid
    }
    else{
        $('#otherInfoTab a:first').tab('show');//初始化显示哪个tab
        logintype = 'surf';

        getJumpurl();//获取跳转网址
        login();//直接上网
    }




    /*加载页面数据*/
    $(".container").attr("id",mid);

    $('#otherInfoTab a').click(function(e){
        $('.error_detail').text("");
        e.preventDefault();//阻止a链接的跳转行为
        $(this).tab('show');//显示当前选中的链接及关联的content
        if($(this).attr('id') == 'facebook'){
            logintype = 'facebook';
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            getJumpurl();//获取跳转网址
            getFacebookAppId(userInfo);//获取facebook appid
        }
        //google登陆页签点击事件
        else if($(this).attr('id') == 'google'){
            logintype = 'google';
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s);
                js.id = id;
                js.type = 'text/javascript';
                js.async = true;
                js.src = "https://apis.google.com/js/client.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'google-jssdk'));

            getJumpurl();//获取跳转网址
            getGoogleAppId(userInfo);//获取google clint
        }

        else if($(this).attr('id') == 'wechat'){
            //$("#weixinLoginBtn").click(function(){
            //    console.log("微信认证");
            //    window.location.href = "../web/portal.html";
            //})
            console.log("微信认证");
            window.location.href = "../web/portal.html"+"?id="+Math.random();
        }
        else{
            logintype = 'surf';
            getJumpurl();//获取跳转网址
            login();//直接上网
        }
    })


    //页面曝光上报
    setTimeout(function(){
        //页面曝光上报
        pageViewUploadData();
    },200);

	/*跳转到主页*/
    $(".menu-btn").click(function(){
        var resId = "02";
        var resName = "home";
        var resType = resId;
        $.hongdian.uploadData({
            resId:resId,
            resName:resName,
            resType:resType,
            click:1,
            flag:1//资源类型为菜单（0：普通资源，1：菜单，2：广告）
        }, function() {
            if(userInfo){
                window.location.href = "../../homePage/web/homePage.html?userInfo="+userInfo+"&id="+Math.random();
            }else{
                window.location.href = "../../homePage/web/homePage.html"+"?id="+Math.random();
            }
        });
    });
});


/**
 * getDefaultCheckValue() 默认协议选中状态 //Protocolo predeterminado estado seleccionado
 * 参数说明：
 */
function getDefaultCheckValue(userInfo){
    //直接放行
    var request = $.ajax({
        url: "../data/protocol",
        type: "GET",
        dataType: 'json' //类型
    });

    request.success(function(protocol) {//加载协议 //Protocolo de carga
        if(protocol.length == 0){
            return;
        }
        var defaultCheckValue = "0";//checkValue
        if(defaultCheckValue == "1"){
            var defaultCheckImg = "../image/checkBox_choice.png";
            $("#LoginBtn").removeClass("disable_register_cntr");
            $("#LoginBtn").addClass("register_cntr");
        }
        else{
            var defaultCheckImg = "../image/checkBox_icon.png";
            $("#LoginBtn").removeClass("register_cntr");
            $("#LoginBtn").addClass("disable_register_cntr");
        }
        var checkbox = '<div id="agreeCheckBox" style="max-width: 50px;" checkValue="' + defaultCheckValue + '" class="agree_img">' +
            '<img src="' + defaultCheckImg + '"/>' +
            '</div>';
        $('#Terms_btn').before(checkbox);

        /**选择框的显示位置**/
        //La posición de visualización del cuadro de selección.
        var agreeBoxWidth = $(".agree_img").width() +  $(".agree").width();
        $("#agreeCheckBox").width(agreeBoxWidth);
        /*选择框事件*/
        //Seleccionar caja de evento
        $("#agreeCheckBox").click(function() {
            var checkValue = $("#agreeCheckBox").attr("checkValue");
            if (checkValue == "1") {
                $("#agreeCheckBox img").attr("src", "../image/checkBox_icon.png");
                $("#agreeCheckBox").attr("checkValue", "0");
                $("#LoginBtn").removeClass("register_cntr");
                $("#LoginBtn").addClass("disable_register_cntr");

            } else {
                $("#agreeCheckBox img").attr("src", "../image/checkBox_choice.png");
                $("#agreeCheckBox").attr("checkValue", "1");
                $("#LoginBtn").removeClass("disable_register_cntr");
                $("#LoginBtn").addClass("register_cntr");
            }
        })
    });

    request.error(function(){
        console.dir("无法获取资源");
    });


    //默认设置为facebook
    /*logintype = 'facebook';
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));*/

    getJumpurl();//获取跳转网址
    //getFacebookAppId(userInfo);//获取facebook appid
}


/**
 * getFacebookAppId() 获取facebook appid
 * 参数说明：
 */
function getFacebookAppId(userInfo){
    var request = $.ajax({
        url: "../data/facebook_appId" ,
        type: "GET",
        dataType: 'json',  //类型
        timeout: 3000
    });

    request.success(function(data){
        appId = data.appId;
        if(!appId){
            return false;
        }

        window.fbAsyncInit = function() {
            FB.init({
                appId      : appId,
                xfbml      : true,
                version    : 'v2.2'
            });
            function facebookLogin() {
                FB.login(function (response) {
                    if (response.authResponse) {
                        FB.api('/me?fields=name,email,id', function (response) {
                            console.log('response');
                            console.log(response);
                            //console.dir(response);
                            //调用auth接口登录入库
                            //账户
                            var accId = response.email;
                            //用户名
                            var uesrName = response.name;
                            //邮箱
                            var email = response.email;
                            //城市
                            //var city = response.location.name;
                            var city = "";
                            //国家
                            var country = response.locale;
                            //年龄
                            var age = "";
                            //登录类型
                            var loginType = "register";
                            authLogin(loginType,accId,uesrName,email,city,country,age);
                        });
                    } else {
                        $('.error_detail').text('User cancelled login or did not fully authorize！');
                        $(".login_container").hideLoading();
                    }
                }, { scope: 'email,user_location'});
            }

            //facebook登陆上网
            $("#registerBtn").click(function(){
                $(".login_container").showLoading();
                console.log("facebook认证");
                if(userInfo){
                    //登录类型
                    console.log("userInfo:");
                    console.log(userInfo);
                    var loginType = "login";
                    authLogin(loginType,userInfo)
                }else{
                    facebookLogin();
                }
            })
        }
    });

    request.error(function(){
        console.dir("Unable to obtain resources ");
        $(".container").hideLoading();
    });
};

//google账户登陆api
function getGoogleAppId(userInfo){

    var startApp = {};
    var googleUser = {};
    var request = $.ajax({
        url: "../data/google_clientId" ,
        type: "GET",
        dataType: 'json',  //类型
        timeout: 3000
    });
    request.success(function(data){
        clientId = data.clientId;
        if(!clientId){
            return false;
        }
    });
    request.error(function(){
        console.dir("Unable to obtain resources ");//无法获取资源
        $(".container").hideLoading();
    });
    startApp.onSuccess = function(googleUser) {
        var profile = googleUser.getBasicProfile();
        var authProfile = googleUser.getAuthResponse();

        var uesrName = profile.getName();
        var userImage = profile.getImageUrl();
        var accId = profile.getEmail();//用户名/邮箱
        var idToken = authProfile.id_token;
        var city = "";
        var country = "";
        var age = "";
        console.log("google返回结果");
        var result={
             profile : profile,
             authProfile : authProfile,
             userName : uesrName,
             userImage : userImage,
             userEmail : accId,
             idToken : idToken
        }
        console.log(result);
        var loginType = "register";
        authLogin(loginType,accId,uesrName,accId,city,country,age);
    };

    startApp.onFailure = function(error) {
        console.log(error);
        $('.error_detail').text('User cancelled login or did not fully authorize！');
        $(".login_container").hideLoading();
    };

    startApp.init = function() {
        gapi.load('auth2', function() {
            auth2 = gapi.auth2.init({
                client_id: clientId,
                cookiepolicy: 'single_host_origin',
                scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
            });

            auth2.attachClickHandler('googleLoginBtn', {}, startApp.onSuccess, startApp.onFailure);
        });
    };
    startApp.init();
    return startApp;
}


//authLogin("register","venlley@126.com","weyli","venlley@126.com","shenzhen","CN","");
//调用auth接口登录入库
function authLogin(loginType,accId,uesrName,email,city,country,age){
    if(!isModem){
        return;
    }
    //确认上网
    var behavior = "2";//1、注册；2、登录；3、获取验证码
    var respStatus= "";//0、成功；-1、失败；-2、流量已用完；-3、网络未响应
    var respMsg = "";

    //登录类型
    var loginType = loginType;
    //账户
    var accId = accId;
    if(loginType == "register"){
        //用户名
        var uesrName = uesrName;
        //邮箱
        var email = email;
        //城市
        var city = city;
        //国家
        var country = country;
        //年龄
        var age = age;
    }else{
        //用户名
        var uesrName = "";
        //邮箱
        var email = "";
        //城市
        var city = "";
        //国家
        var country = "";
        //年龄
        var age = "";
    }

    $(".container").showLoading();
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "../../common/api/facebook_login_api.php",
        data: 'type=1&accId=' + accId+ '&uesrName=' + uesrName + '&email=' + email + '&city=' + city + '&country=' + country + '&age=' + age +'&regType=facebook',
        success: function(data){
            // console.dir(data);
            if(data){
                if(data['code'] == '0'){
                    //认证行为上报
                    respStatus = "0";
                    userAuthBehavior(behavior,respStatus,respMsg,accId);

                    var expireNetFlow = 0;//外网流量//Tráfico de red externa
                    expireNetFlow = data.surplusFlow;//剩余流量,data.totalFlow(总流量),data.consumeFlow(消费流量)，
                    $.ajax({
                        method: 'post',
                        url: "../../common/api/acc_auth.php",
                        data:'type=1&expireNetFlow=' +expireNetFlow,
                        dataType: 'json',
                        success: function(data) {
                            if(data['code'] != 'ok') {
                                $('.error_detail').text('Network unable to connect ！');//网络无法连接
                                $(".container").hideLoading();
                            } else {
                                //window.location.href = 'http://www.hao123.com';
                                setTimeout(function(){
                                    jumpHref(accId);
                                    //$('.error_detail').text('Network connected!');
                                }, 3000);

                            }
                        },
                        complete:function(){
                            setTimeout(function(){
                                $(".login_container").hideLoading();
                            }, 3000);
                        }
                    });
                }else if(data['code'] == '-2'){
                    $('.error_detail').text('Hello，he flow of traffic to you has been used up !');//您好，给你分配初始的流量已用完
                    //认证行为上报
                    respStatus = "-2";
                    userAuthBehavior(behavior,respStatus,respMsg,accId);
                }else{
                    $('.error_detail').text('logon failed !');//登陆失败
                    //认证行为上报
                    respStatus = "-1";
                    userAuthBehavior(behavior,respStatus,respMsg,accId);
                }
            }else{
                $('.error_detail').text('Internet failure !');
                $(".container").hideLoading();
                //认证行为上报
                respStatus = "-3";
                userAuthBehavior(behavior,respStatus,respMsg,accId);
            }


        },
        complete:function(XMLHttpRequest,status){
            if(status != "success"){
                $('.error_detail').text('unable to connect the server ！');//服务器连接失败
                //认证行为上报
                respStatus = "-3";
                userAuthBehavior(behavior,respStatus,respMsg,accId);
            }
            $(".login_container").hideLoading();
        }
    })
};



/**
 * getJumpurl() 获取跳转网址
 * 参数说明:
 */
function getJumpurl(){
    var url;
    var request = $.ajax({
        url: "../../common/data/jump_url" ,
        type: "GET",
        dataType: 'json',  //类型
        timeout: 3000
    });

    request.success(function(data){
        JumpUrl = data.jump_url;
    });

    request.error(function(){
        console.dir("Unable to obtain resources !");//无法获取资源
    });
};



/**
 * login() 直接上网 //Acceso directo a internet
 * 参数说明://Descripción del parámetro:
 */
function login(){
    $("#LoginBtn").click(function(){
        if(!isModem){
            //GenerateNewPopup('亲，网络开小差啦，请您先浏览本地资源哦！',5); //Estimado, la red se está agotando, ¡por favor busque primero los recursos locales!
            $("#internetNotOK").css("display","block");
            setTimeout(function(){
                $("#internetNotOK").css("display","none");
            },3000)
            return;
        }
        console.log("直接上网");
        var checkValue = $("#agreeCheckBox").attr("checkValue");
        if(checkValue == 0){
            return;
        }
        $('.error_detail').text("");

        $(".container").showLoading();
        var expireNetFlow = 1000;//外网流量

        var behavior = "2";//1、注册；2、登录；3、获取验证码
        var respStatus= "";//0、成功；-1、失败；-2、流量已用完；-3、网络未响应
        var respMsg = "";
        var mobile = "";

        $(".login_container").showLoading();
        $.ajax({
            method: 'post',
            url: "../../common/api/acc_auth.php",
            data:'type=1&expireNetFlow=' +expireNetFlow,
            dataType: 'json',
            success: function(data) {
                if(data['code'] != 'ok') {
                    $('.error_detail').text('Network can not connect');
                    //认证行为上报//Informe de comportamiento de certificación.
                    respStatus = "-3";
                    userAuthBehavior(behavior,respStatus,respMsg,mobile);
                } else {
                   // window.location.href = 'http://www.hao123.com';

                    setTimeout(function(){
                        jumpHref(mobile);
                    }, 3000);
                    //认证行为上报
                    respStatus = "0";
                    userAuthBehavior(behavior,respStatus,respMsg,mobile);
                }
                //jumpHref(mobile);
            },
            complete:function(XMLHttpRequest,status){
                setTimeout(function(){
                    $(".login_container").hideLoading();
                }, 3000);
            }
        });
    });
};


/**
 * jumpHref(mobile,jumpUrl) 跳转链接地址s
 * 参数说明:mobile 手机号, jumpUrl 链接地址
 */
function jumpHref(mobile){
    if(mobile){
        mobile = phoneEncrypt(mobile);
        window.location.href = JumpUrl+"?userInfo="+mobile+"&id="+Math.random();
    }
    else{
        window.location.href = JumpUrl+"?id="+Math.random();
    }
};


/**
 *  getInternetModem() 当前网络状态 //Estado actual de la red
 *  参数说明：//Descripción del parámetro:
 */
function getInternetModem(){
    $.ajax({
        method: 'get',
        url: "../../common/api/deviceModem.php",
        dataType: 'json',
        success: function(data) {
            console.log(data);
            isModem = data;
            if(!isModem){
                //路由不存在,当前网络不通 //La ruta no existe. La red actual no funciona.
                console.log("路由不存在,当前网络不通");
                //$("#internetNotOK").css("display","block");
            }if(data == 1){
                //$('.error_detail').text('Network connected!');
            }
        },
        complete:function(XMLHttpRequest,status){
        }
    });
};
