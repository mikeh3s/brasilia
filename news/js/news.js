/**
 * Created by qhao on 2015/4/20.
 */
var mid = "0301";//头条页面编号
var itermIndex = 3;//分类显示条数
var NewsInfo = [];
var dir = "../../advertisement/data/";
var adImgheight = 220;//top广告图片高度
var tabindex = 0;
$(function(){

    var userInfo = getQueryString("userInfo");
    if(userInfo){
        userInfo = phoneDecryption(userInfo);
        userInfo = phoneEncrypt(userInfo);
    }
    generate_news_SecMenu();//获取新闻信息

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


    $(window).bind('resize', function(e) {

        $(".tabs-navbar .nav-active").removeClass('nav-active');
        $(".tabs-navbar li").eq(tabindex).addClass('nav-active');

        $(".tabs-navbar .sec-menu-line").removeClass('sec-menu-line');
        $(".tabs-navbar li").eq(tabindex).find("div").addClass('sec-menu-line');
        var secMenuWidth = $(".tabs-navbar li").eq(tabindex).find("span").width();
        $(".tabs-navbar li").eq(tabindex).find("div").width(secMenuWidth+30);
    });

    $(window).resize();
});




/**
 * generate_news_SecMenu() 生成初始新闻二级菜单
 * 参数说明:
 */
function generate_news_SecMenu(){
    var SceMenuHtml = "";
    //获取二级菜单
    var request = $.ajax({
        url: "../data/menu" ,
        type: "GET",
        dataType: 'json',  //类型
        timeout: 3000
    });

    request.success(function(data) {
        if(data.length == 0){
            $("#appsSwiper").hide();
            return;
        }

        $.each(data, function(idx,menu){
            //生成二级菜单

//            var SceMenu = '<li item="' + menu.id + '" class="col-xs-3 ' + menu.active + ' "> ' +
//                '<img class="img-responsive sec-menu-img" src="' + menu.img +'"/>' +
//                '<span>'+  menu.title + '</span>' +
//                '</li>';
            var SceMenu = '<li item="' + menu.id + '" class="col-xs-3 ' + menu.active + ' "> ' +
                '<span>'+  menu.title + '</span>' +
                '<div class="'+ menu.activeline + '">' +
                '</div>' +
                '</li>';

            var AppSource = '<div class="swiper-slide">' +
                '<div class="news_item_content" id="' + menu.id + '"> ' +
                '<ul class="list-group" >' +
                '</ul></div>'+
                '</div>';

            $(".tabs-navbar ul").append(SceMenu);

            $(".appsSwiper .swiper-wrapper").append(AppSource);


            //获取内容
            var AppSourceHtml = "";
            var request1 = $.ajax({
                url: "../data/" + menu.id ,
                type: "get",
                dataType: 'json',  //类型
                timeout: 3000
            });

            //得到影音数据
            var itemKeyIndex = 0;
            var NewsHtml = "";
            request1.success(function(News) {
                menu.info = News;
                NewsInfo.push(menu);
                $.each(News, function(index,news){
                    NewsHtml += '<li id="' + news.docid + '" item="' + menu.id + '" ' +
                        'onclick=' + 'newsEvent("' + news.docid + '")'  +
                        ' class="list-group-item">' +
                        '<div class="li-img-item">' +
                        '<img class="img-responsive" src="' + news.imgsrc  + '" />' +
                        '</div>' +
                        '<div class="li-content-item">' +
                        '<div class="main-title">' + news.title + '</div>' +
                        '<div class="sub-title">' + news.digest + '</div>' +
                        '</div>' +
                        '</li>';

                    if(itemKeyIndex == itermIndex){//每个分类显示三条

                        NewsHtml += '<div class="more_info_container">' +
                            '<span item="' + menu.id + '" class="more_info">' +
                            'Mas </span></div>';
                        return false;//每个分类显示三条
                    }
                    itemKeyIndex += 1;
                });

                $("#" + menu.id + " > ul").append(NewsHtml);
                getMoreNews( menu.id);//获取更多事件

                /*菜单栏tabs  */
                var tabsSwiper = new Swiper('#appsSwiper',{
                    speed:500,
                    onSlideChangeStart: function(){
                        $(".tabs-navbar .nav-active").removeClass('nav-active');
                        $(".tabs-navbar li").eq(tabsSwiper.activeIndex).addClass('nav-active');

                        $(".tabs-navbar .sec-menu-line").removeClass('sec-menu-line');
                        $(".tabs-navbar li").eq(tabsSwiper.activeIndex).find("div").addClass('sec-menu-line');
                        var secMenuWidth = $(".tabs-navbar li").eq(tabsSwiper.activeIndex).find("span").width();
                        $(".tabs-navbar li").eq(tabsSwiper.activeIndex).find("div").width(secMenuWidth+30);

                        setTabsSwiperHeight();
                    }
                });

                setTabsSwiperHeight();

                /*tabs 点击*/
                $(".tabs-navbar li").on('touchstart mousedown',function(e){
                    e.preventDefault()
                    $(".tabs-navbar .nav-active").removeClass('nav-active')
                    $(this).addClass('nav-active')

                    $(".tabs-navbar .sec-menu-line").removeClass('sec-menu-line')
                    $(this).find("div").addClass('sec-menu-line')

                    var secMenuWidth = $(this).find("span").width();
                    $(this).find("div").width(secMenuWidth+30);
                    tabindex = $(this).index();
                    tabsSwiper.swipeTo($(this).index());
                });

                $(".tabs-navbar li").click(function(e){
                    e.preventDefault()
                });
            });

            request1.error(function(){
                console.dir("无法获取资源");
                return;
            });

        });
        pageViewUploadData();//页面曝光上报

        secMenuUploadData();//二级菜单上报
    });

    request.error(function(){
        console.dir("无法获取资源");
        return;
    });

};


/**
 * setTabsSwiperHeight() 设置tabs swiper的高度
 * 参数说明:
 */
function setTabsSwiperHeight(){
    var tabsSwiperheight = $(".appsSwiper .news_item_content").height();
    $(".appsSwiper .swiper-wrapper").height(tabsSwiperheight + 60);
    $(".appsSwiper .swiper-slide ").height(tabsSwiperheight);
};



/**
 * newsEvent(newsId) 显示详细页面
 * 参数说明：newsId 新闻id
 */
function newsEvent(newsId) {
    //新闻列表绑定事件
    var id = $("#" + newsId).attr("id");
    var itemId = $("#" + newsId).attr("item");
    var resType = itemId;
    window.location.href = "newsDetails.html?itemId="+itemId+"&docid="+id+"&resType="+resType+"&ids="+Math.random();
};


/**
 * getMoreNews(menuId) 获取更多单击事件
 * 参数说明:menuId 二级菜单id
 */
function getMoreNews(menuId){
    $("#"+menuId +" .more_info").click(function(){
        var item = $(this).attr("item");
        var obj = $(this);
        getData(item,obj);//从data获取新闻数据
    })
};



/**
 * getData(item,obj) 从data获取更多新闻数据
 * 参数说明: item 单击的“更多新闻”的item属性
 *           obj “更多新闻”Html对象
 */
function getData(item,obj){

    var itemKeyIndex = 0;
    var NewsHtml = "";
    var MoreNews = [];
    for(var i=0;i<NewsInfo.length;i++){
        if(item == NewsInfo[i].id){
            MoreNews = NewsInfo[i].info;
            break;
        }
    }
    $.each(MoreNews, function(index,news){
        if(itemKeyIndex > itermIndex){//显示多于三条的

            NewsHtml += '<li id="' + news.docid + '" item="' + item + '" ' +
                'onclick=' + 'newsEvent("' + news.docid + '")'  +
                ' class="list-group-item">' +
                '<div class="li-img-item">' +
                '<img class="img-responsive" src="' + news.imgsrc  + '" />' +
                '</div>' +
                '<div class="li-content-item">' +
                '<div class="main-title">' + news.title + '</div>' +
                '<div class="sub-title">' + news.digest + '</div>' +
                '</div>' +
                '</li>';
        }
        itemKeyIndex += 1;
    });

    $("#" + item + " > ul").append(NewsHtml);
    var tabsSwiperheight = $("#" + item).height();
    $(".appsSwiper .swiper-wrapper").height(tabsSwiperheight + 60);
    $(".appsSwiper .swiper-slide ").height(tabsSwiperheight);
    obj.parent().hide();

};



/**
 * secMenuUploadData() 二级菜单上报
 * 参数说明:
 */
function secMenuUploadData(){
    $(".tabs-navbar ul li").each(function(i){
        var resId = $(this).attr("item");
        var resName = $(this).text();
        var resType = resId.substring(0,2);
        $.hongdian.uploadData({
            resId:resId,
            resName:resName,
            resType:resType,//资源类型
            click:1,
            flag:1//资源类型为菜单（0：普通资源，1：菜单，2：广告）
        }, function() {
        });
    });
};
