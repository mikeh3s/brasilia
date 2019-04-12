/**
 * Created by qhao on 2015/4/22.
 */

var mid = "0201";//主页页面编号 //Número de página de inicio
var dir = "../../advertisement/data/";
$(function(){
    $(".container").attr("id",mid);

    /*设置games的高度*/
    var widht = $("#contentRight").width();
    var height = widht * (162/334);
	$("#games img").width(widht);
    $("#games img").height(height);

    /*窗口变化事件*/
    // Evento de cambio de ventana
    $(window).resize(function(){
        /*设置games的高度*/
        //Ajuste de altura y ancho de el video
        var widht = $("#video").width();
        var height = widht * (162/334);
		$("#games img").width(widht);
        $("#games img").height(height);
    });

    //判断用户是否认证过
    var userInfo = getQueryString("userInfo");
    if(userInfo){
        userInfo = phoneDecryption(userInfo);
        userInfo = phoneEncrypt(userInfo);
    }

    /*主页菜单*/
    Generate_home_Menu(userInfo);

    //页面曝光上报
    pageViewHomeUploadData();

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
            // if(userInfo){
            //     window.location.href = "../../homePage/web/homePagePoll.php?userInfo="+userInfo;
            // }else{
            //     window.location.href = "../../homePage/web/homePagePoll.php";
            // }
            window.location.href = "../../homePage/web/homePage.html"+"?id="+Math.random();
        });

    });
});


/**
 * getAd01() 根据广告策略获取广告
 * 参数说明：
 */
function getAd01(){
    //默认策略
    var adPath = dir + mid +"01";

    //解析广告配置文件
    var request = $.ajax({
        url: adPath ,
        type: "GET",
        dataType: 'json' //类型
    });

    request.success(function(data) {//加载成功则需要加载广告
        var SlideDiv = "";
        $.each(data.img, function(index,values){
            //SlideDiv += '<div class="swiper-slide"><img style="z-index: 1000;" id="'+ values.id  + '"  title="'+ values.title  + '" src="'+ values.src + '" href="'+ values.href + '" ></div>';
            SlideDiv += '<span class="swiper-slide">' +
                '<a style="width: 100%;">' +
                '<img class="slideImg" id="'+ values.id  + '" title="'+ values.title  + '"' +
                ' src="'+ values.imgsrc + '" width="100%" href="'+ values.href + '" />' +
                '</a></span>';
        });
        $( ".bigslide").append(SlideDiv);

        /*滑动广告swiper*/
        var adSwiper = new Swiper('#adSlide',{
            pagination: '.pagination',
            autoplay:data.interval*1000,
            autoplayDisableOnInteraction : false,//用户操作swiper之后，是否禁止autoplay。默认为true：停止。
            loop:true,
            grabCursor: true,
            paginationClickable: true,
            calculateHeight:true,//当值为true时，Swiper根据slides内容计算容器高度。响应式布局中或不知道slides高度时十分有用（就像响应式的图片）
            onInit: function(swiper){//广告初始化时第一张上报
                //Swiper初始化了
                var imgObj = $(".bigslide .swiper-slide").find("img");
                var resId = $(imgObj[0]).attr("id");
                var resName = $(imgObj[0]).attr("title");
                //广告浏览上报
                $.hongdian.uploadData({
                    resId:resId,
                    resName:resName,
                    resType:mid +"01",//广告类型为广告位如：010101
                    click:0,
                    view:1,
                    flag:2,//资源类型为菜单（0：普通资源，1：菜单，2：广告）
                    totalDuration:data.interval,
                    from:""
                });
            },
            onSlideChangeStart:function(){ //广告滑动时上报
                var imgObj = $(".bigslide .swiper-slide").find("img");
                var activeIndex = adSwiper.activeIndex;
                var resId = $(imgObj[activeIndex]).attr("id");
                var resName = $(imgObj[activeIndex]).attr("title");
                //广告浏览上报
                $.hongdian.uploadData({
                    resId:resId,
                    resName:resName,
                    resType:mid +"01",//广告类型为广告位如：010101
                    click:0,
                    view:1,
                    flag:2,//资源类型为菜单（0：普通资源，1：菜单，2：广告）
                    totalDuration:data.interval,
                    from:""
                });
            }
        });

		setSwiperHeight();/*设置swiper的高度*//*设置大广告swiper*/

        $(".bigslide .swiper-slide img").each(function(){
            $(this).click(function() {
                //广告点击
                var resId = $(this).attr("id");
                var resName = $(this).attr("title");
                var href = $(this).attr("href");
                $.hongdian.uploadData({
                    resId:resId,
                    resName:resName,
                    resType:mid +"01",
                    click:1,
                    view:0,
                    flag:2,////资源类型为菜单（0：普通资源，1：菜单，2：广告）
                    from:""
                }, function() {
                    if(href){
                        window.location.href = href;
                    }

                });
            });
        });

    });

    request.error(function(){
        console.dir("无法获取资源");
    });
};


/**
 * setSwiperHeight() 设置swiper的高度
 *  参数说明：  adSlide  adSlide是slide的div的id
 */
function setSwiperHeight(){
    /*设置swiper的高度*/
    var swiperWidth = $(".swiper-slide").width();
	console.dir(swiperWidth);
    var swiperHeight = 0;
    if(swiperWidth < 640){
        swiperHeight = swiperWidth * (316/624);
    }else{
        swiperHeight = 316;
    }
    $(".slide-ad").height(swiperHeight);
	$("#adSlide").height(swiperHeight);
	$(".bigslide").height(swiperHeight);
    $("#adSlide .swiper-slide ").height(swiperHeight);
    $("#adSlide .swiper-slide img").height(swiperHeight);
};


/**
 * getAd02() 根据广告策略获取广告
 * 参数说明：
 */
function getAd02(){
    //默认策略
    var adPath = dir + mid +"02";

    //解析广告配置文件
    var request = $.ajax({
        url: adPath ,
        type: "GET",
        dataType: 'json' //类型
    });

    request.success(function(data) {//加载成功则需要加载广告
        var SlideDiv = "";
        $.each(data.img, function(index,values){
            SlideDiv += '<div class="swiper-slide">' +
                '<img style="z-index: 1000;" id="'+ values.id  + '"  ' +
                'title="'+ values.title  + '" src="'+ values.imgsrc + '" ' +
                'href="'+ values.href + '" ></div>';
        });
        $( ".smallslide").append(SlideDiv);

        /*滑动广告swiper*/
        var adSwiper = new Swiper('#showAdSlide',{
            pagination: '.pagination-show',
            autoplay:data.interval*1000,
            autoplayDisableOnInteraction : false,//用户操作swiper之后，是否禁止autoplay。默认为true：停止。
            loop:true,
            grabCursor: true,
            paginationClickable: true,
            calculateHeight:true,//当值为true时，Swiper根据slides内容计算容器高度。响应式布局中或不知道slides高度时十分有用（就像响应式的图片）
            onInit: function(swiper){//广告初始化时第一张上报
                //Swiper初始化了
                var imgObj = $(".smallslide .swiper-slide").find("img");
                var resId = $(imgObj[0]).attr("id");
                var resName = $(imgObj[0]).attr("title");
                //广告浏览上报
                $.hongdian.uploadData({
                    resId:resId,
                    resName:resName,
                    resType:mid +"02",//广告类型为广告位如：010101
                    click:0,
                    view:1,
                    flag:2,//资源类型为菜单（0：普通资源，1：菜单，2：广告）
                    totalDuration:data.interval,
                    from:""
                });
            },
            onSlideChangeStart:function(){ //广告滑动时上报
                var imgObj = $(".smallslide .swiper-slide").find("img");
                var activeIndex = adSwiper.activeIndex;
                var resId = $(imgObj[activeIndex]).attr("id");
                var resName = $(imgObj[activeIndex]).attr("title");
                //广告浏览上报
                $.hongdian.uploadData({
                    resId:resId,
                    resName:resName,
                    resType:mid +"02",//广告类型为广告位如：010101
                    click:0,
                    view:1,
                    flag:2,//资源类型为菜单（0：普通资源，1：菜单，2：广告）
                    totalDuration:data.interval,
                    from:""
                });
            }
        });

        setShowAdSwiperHeight();/*设置swiper的高度*//*设置小广告swiper*/

        $(window).bind('resize', function(e) {
            var swiperWidth = 0.58*$(".content-modul").width();
            var swiperHeight = (swiperWidth * (161/334))*2;
            $("#showAdDiv").height(swiperHeight);
            $("#showAdSlide").height(swiperHeight);
            $(".smallslide").height(swiperHeight);
            $("#showAdSlide .swiper-slide").height(swiperHeight);
            $("#showAdSlide .swiper-slide img").height(swiperHeight);

            $(".slide-ad").height(window.innerWidth*(316/624));
            $("#adSlide").height(window.innerWidth*(316/624));
            $(".bigslide").height(window.innerWidth*(316/624));
            $("#adSlide .swiper-slide ").height(window.innerWidth*(316/624));
            $("#adSlide .swiper-slide img").height(window.innerWidth*(316/624));
        });

        $(window).resize();

        $(".smallslide .swiper-slide img").each(function(){
            $(this).click(function() {
                //广告点击
                var resId = $(this).attr("id");
                var resName = $(this).attr("title");
                var href = $(this).attr("href");
                $.hongdian.uploadData({
                    resId:resId,
                    resName:resName,
                    resType:mid +"02",
                    click:1,
                    view:0,
                    flag:2,////资源类型为菜单（0：普通资源，1：菜单，2：广告）
                    from:""
                }, function() {
                    if(href){
                        window.location.href = href;
                    }

                });
            });
        });
    });

    request.error(function(){
        console.dir("无法获取资源");
    });
};


/**
 * 设置展示广告swiper的高度
 */
function setShowAdSwiperHeight(){
    /*设置swiper的高度*/
    var swiperWidth = 0.58*$(".content-modul").width();
    var swiperHeight = (swiperWidth * (161/334))*2;
	$("#showAdDiv").height(swiperHeight);
    $("#showAdSlide").height(swiperHeight);
    $(".smallslide").height(swiperHeight);
    $("#showAdSlide .swiper-slide").height(swiperHeight);
    $("#showAdSlide .swiper-slide img").height(swiperHeight);
};



/**
 *  MenuClick(userInfo) 首页一级菜单的按钮事件点击
 *  参数说明： userInfo  判断用户是否认证过
 */
function MenuClick(userInfo){

    $(".main-menu-link").click(function(){
        var resId = $(this).attr("resId");
        var resName = $(this).attr("resName");
        var resType = resId;
        var href = $(this).attr("href");
        $.hongdian.uploadData({
            resId:resId,
            resName:resName,
            resType:resType,
            click:1,
            flag:1//资源类型为菜单（0：普通资源，1：菜单，2：广告）
        }, function() {
            if(userInfo){
                window.location.href = href+userInfo+"?id="+Math.random();
            }else{
                window.location.href = href+"?id="+Math.random();
            }
        });

    });

};


/**
 *  Generate_home_Menu 首页的菜单
 */
function Generate_home_Menu(userInfo){
    var request = $.ajax({
        url: "../data/02" ,
        type: "GET",
        dataType: 'json',  //类型
        timeout: 3000
    });

    request.success(function(data) {
        if(data.length == 0){
            return;
        }
        console.log(data);

        var contentR = "";
        var contentB = '';
        $.each(data, function(idx,menu){
            if(idx<2){
                contentR += '<div href="' + menu.href + '" ' +
                    'resId="' + menu.id + '" resName="' + menu.title + '" class="main-menu-link" id="home-' + menu.id + '"> ' +
                    '<img class="img-responsive" src="' + menu.img + '"/> ' +
                    '</div>';
            }
            else if(idx == 2){
                contentB += '<div id="home-' + menu.id + '" href="' + menu.href + '" ' +
                    'resId="' + menu.id + '" resName="' + menu.title + '" class="main-menu-link col-xs-5 modul-padding-right" > ' +
                    '<img class="img-responsive" src="' + menu.img + '"/> ' +
                    '</div>';
            }
            else{
                contentB += '<div id="home-' + menu.id + '" href="' + menu.href + '" ' +
                    'resId="' + menu.id + '" resName="' + menu.title + '" class="main-menu-link col-xs-7 modul-padding-left"> ' +
                    '<img class="img-responsive" src="' + menu.img + '"/> ' +
                    '</div>';
            }
        });

        $("#contentRight").append(contentR);
        $("#contentBottom").append(contentB);

        /*主页菜单单击事件*/
        MenuClick(userInfo);

    });

    request.error(function(){
        console.dir("无法获取资源");
        return;
    });
};



/**
 *  pageViewHomeUploadData() 首页页面曝光上报
 *  参数说明：
 */
function pageViewHomeUploadData(){
    var resId = "02";//一级菜单id
    var resName = "home";
    var resType = resId;
    $.hongdian.uploadData({
        resId:resId,
        resName:resName,
        resType:resType,
        view:1,
        click:0,
        flag:1
    }, function() {
    });
}
