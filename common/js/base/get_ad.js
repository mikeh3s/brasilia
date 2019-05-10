/**
 * Created by qhao on 2017/6/22.
 */

/**
 * getAd01() 根据广告策略获取广告 //Consigue anuncios basados ​​en la estrategia de publicidad.
 * 参数说明： //Descripción del parámetro:
 */

function getAd(id){
    //默认策略 //Política predeterminada
    var adPath = dir + mid +"01";

    //解析广告配置文件 //Analizando el perfil del anuncio
    var request = $.ajax({
        url: adPath ,
        type: "GET",
        dataType: 'json' //类型
    });

    request.success(function(data) {//加载成功则需要加载广告
        console.log(data);
        var SlideDiv = "";
        $.each(data.img, function(index,values){
            if(values.imgsrc){
                SlideDiv += '<div class="swiper-slide">' +
                    '<img style="z-index: 1000;" id="'+ values.id
                    + '"  title="'+ values.title  + '" src="'+ values.imgsrc
                    + '" href="'+ values.href + '" ></div>';
            }

        });
        $( "#" + id +" .swiper-wrapper").append(SlideDiv);
        /*滑动广告swiper*/
        var adSwiper = new Swiper('#' + id,{
            pagination: '.pagination-news',
            autoplay:data.interval*1000,
            autoplayDisableOnInteraction : false,//用户操作swiper之后，是否禁止autoplay。默认为true：停止。
            loop:true,
            grabCursor: true,
            paginationClickable: true,
            calculateHeight:true,//当值为true时，Swiper根据slides内容计算容器高度。响应式布局中或不知道slides高度时十分有用（就像响应式的图片）
            onInit: function(swiper){//广告初始化时第一张上报
                //Swiper初始化了
                var imgObj = $("#" + id + " .swiper-slide").find("img");
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
                var imgObj = $("#" + id + " .swiper-slide").find("img");
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

        setSwiperHeight(id);

        winResize();

        $(window).resize();

        $(".swiper-wrapper .swiper-slide img").each(function(){
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
        console.dir("Unable to obtain resources");
    });
};


function getWidthOfAdImg(src){
    var img = new Image();
    img.src =$('.img').attr(src) ;
    var h = img.height;
    return h;
}


/**
 * setSwiperHeight() 设置swiper的高度
 *  参数说明：  adSlide  adSlide是slide的div的id
 */
function setSwiperHeight(id){
    /*设置swiper的高度*/
    var swiperWidth = $(".swiper-slide").width();
    var swiperHeight = 0;
    if(swiperWidth < 640){
        swiperHeight = swiperWidth * (adImgheight/640);
    }else{
        swiperHeight = adImgheight;;
    }

    //$("#appAdSlide").height(swiperHeight);
    //$(".news-wrapper").height(swiperHeight);
    $("#" + id +" .swiper-slide ").height(swiperHeight);
    $("#" + id +" .swiper-slide img").width(swiperWidth);
    $("#" + id +" .swiper-slide img").height(swiperHeight);

};


function winResize(){
    $(window).bind('resize', function(e) {
        var swiperWidth = $(".swiper-slide").width();
        var swiperHeight = 0;
        if(swiperWidth < 640){
            swiperHeight = swiperWidth * (adImgheight/640);
        }else{
            swiperHeight = adImgheight;
        }

        //$("#appAdSlide").height(swiperHeight);
        $(".news-wrapper").height(swiperHeight);
        $("#AdSlide .swiper-slide ").height(swiperHeight);
        $("#AdSlide .swiper-slide img").width(swiperWidth);
        $("#AdSlide .swiper-slide img").height(swiperHeight);
    });
}
