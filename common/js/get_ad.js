/**
 * Created by qhao on 2015/4/22.
 */

/**
 * getAd(adPosition, hour, location) 根据广告策略获取广告
 * 参数说明：adPosition  广告位编号；
 *           hour  当前小时；
 *           location  当前位置,
 *           wrapper  要添加广告wiper-wrapper div层,
 *           pagination  是pagination的classname
 *           adSlide  adSlide是slide的div的id
 * eg: 01_10_01
 */
function getAd(adPosition, hour, location, wrapper, pagination ,adSlide) {
    var dir = "../../advertisement/data/";

    //默认策略
    var adPath = dir + adPosition;

    //解析广告配置文件
    var request = $.ajax({
        url: adPath ,
        type: "GET",
        dataType: 'json' //类型
    });

    request.success(function(data) {//加载成功则需要加载广告
        Generate_ad(data,wrapper,pagination,adSlide,adPosition);
    });

    request.error(function(){
        console.dir("无法获取资源");
    });

    /*
    //解析广告配置文件
    var adPath = dir + adPosition + "_" + hour + "_" + location;
    var adJson;

    //解析广告配置文件
    var request = $.ajax({
        url: adPath ,
        type: "GET",
        dataType: "json",
        timeout: 3000
    });

    request.success(function(data) {//加载成功则需要加载广告
        adJson = data;//得到新闻数据
        console.dir(JSON.stringify(adJson));
        Generate_ad(adJson,wrapper,pagination,adSlide,adPosition);
    });

    request.error(function(){
        //时段策略
        adPath = dir + adPosition + "_" + hour + "_-1";

        //解析广告配置文件
        var request = $.ajax({
            url: adPath ,
            type: "GET",
            dataType: 'json',  //类型
            timeout: 3000
        });

        request.success(function(data) {//加载成功则需要加载广告
            adJson = data;//得到新闻数据
            console.dir(JSON.stringify(adJson));
            Generate_ad(adJson,wrapper,pagination,adSlide,adPosition);
        });

        request.error(function(){
            //位置策略
            adPath = dir + adPosition + "_-1_" + location;

            //解析广告配置文件
            var request = $.ajax({
                url: adPath ,
                type: "GET",
                dataType: 'json',  //类型
                timeout: 3000
            });

            request.success(function(data) {//加载成功则需要加载广告
                adJson = data;//得到新闻数据
                console.dir(JSON.stringify(adJson));
                Generate_ad(adJson,wrapper,pagination,adSlide,adPosition);
            });

            request.error(function(){
                //默认策略
                adPath = dir + adPosition;

                //解析广告配置文件
                var request = $.ajax({
                    url: adPath ,
                    type: "GET",
                    dataType: 'json',  //类型
                    timeout: 3000
                });

                request.success(function(data) {//加载成功则需要加载广告
                    adJson = data;//得到新闻数据
//                    console.dir(JSON.stringify(adJson));
                    Generate_ad(adJson,wrapper,pagination,adSlide,adPosition);
                });

                request.error(function(){
                    console.dir("无法获取资源");
                });

            });
        });
    })
    */
};

/**
 * Generate_ad(result) 生成广告div
 * 参数说明: result  是广告数据，
 *           wrapper  要添加广告的滑动div,
 *           pagination  是pagination的classname
 *           adSlide  adSlide是slide的div的id
 *           adPosition  广告位编号；
 */
function Generate_ad(result,wrapper,pagination,adSlide,adPosition){
    $.each(result.img, function(index,values){
        var SlideDiv = "";
        SlideDiv += '<div class="swiper-slide"><img style="z-index: 1000;" id="'+ values.id  + '"  title="'+ values.title  + '" src="'+ values.imgsrc + '" href="'+ values.href + '" ></div>';
        $( "." + wrapper).append(SlideDiv);
    });
    /*滑动广告swiper*/
    var adSwiper = new Swiper('#' + adSlide,{
        pagination: '.' + pagination,
        autoplay:result.interval*1000,
        autoplayDisableOnInteraction : false,//用户操作swiper之后，是否禁止autoplay。默认为true：停止。
        loop:true,
        grabCursor: true,
        paginationClickable: true,
        calculateHeight:true,//当值为true时，Swiper根据slides内容计算容器高度。响应式布局中或不知道slides高度时十分有用（就像响应式的图片）
        onInit: function(swiper){//广告初始化时第一张上报
            //Swiper初始化了
            var imgObj = $("." + wrapper + " .swiper-slide").find("img");
            var resId = $(imgObj[0]).attr("id");
            var resName = $(imgObj[0]).attr("title");
            //广告浏览上报
            $.hongdian.uploadData({
                resId:resId,
                resName:resName,
                resType:adPosition,//广告类型为广告位如：010101
                click:0,
                view:1,
                flag:2,//资源类型为菜单（0：普通资源，1：菜单，2：广告）
                totalDuration:result.interval,
                from:""
            });
        },
        onSlideChangeStart:function(){ //广告滑动时上报
            var imgObj = $("." + wrapper + " .swiper-slide").find("img");
            var activeIndex = adSwiper.activeIndex;
            var resId = $(imgObj[activeIndex]).attr("id");
            var resName = $(imgObj[activeIndex]).attr("title");
            //广告浏览上报
            $.hongdian.uploadData({
                resId:resId,
                resName:resName,
                resType:adPosition,//广告类型为广告位如：010101
                click:0,
                view:1,
                flag:2,//资源类型为菜单（0：普通资源，1：菜单，2：广告）
                totalDuration:result.interval,
                from:""
            });
        }
    });

    if(adSlide == "showAdSlide"){
        setShowAdSwiperHeight();/*设置swiper的高度*//*设置小广告swiper*/
    }

    $("." + wrapper + " .swiper-slide img").each(function(){
        $(this).click(function() {
            //广告点击
            var resId = $(this).attr("id");
            var resName = $(this).attr("title");
            var href = $(this).attr("href");
            $.hongdian.uploadData({
                resId:resId,
                resName:resName,
                resType:adPosition,
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
};


/**
 * setSwiperHeight() 设置swiper的高度
 *  参数说明：  adSlide  adSlide是slide的div的id
 */
function setSwiperHeight(adSlide){
    /*设置swiper的高度*/
    var swiperWidth = $(".swiper-slide").width();
    var swiperHeight = 0;
    if(swiperWidth < 640){
        swiperHeight = swiperWidth * (280/640);
    }else{
        swiperHeight = 280;
    }
    $("#" + adSlide + " .swiper-slide ").height(swiperHeight);
    $("#" + adSlide + " .swiper-slide img").height(swiperHeight);
};


/**
 * 设置展示广告swiper的高度
 */
function setShowAdSwiperHeight(){
    /*设置swiper的高度*/
    var swiperWidth = $("#video").width();
    var swiperHeight = (swiperWidth * (162/334))*2+11;
    $("#showAdSlide").height(swiperHeight);
    $(".smallslide").height(swiperHeight);
    $(".swiper-slide").height(swiperHeight);
    $("#showAdSlide .swiper-slide img").height(swiperHeight);
};