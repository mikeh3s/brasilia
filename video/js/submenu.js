/**
 * Created by qhao on 2017/6/19.
 */
var dir = "../../advertisement/data/";
var adImgheight = 284;//top广告图片高度
$(function(){

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
            window.location.href = "../../homePage/web/homePage.html"+"?id="+Math.random();
        });
    });

});

/**
 * generate_videoSecMenu() 生成二级菜单和影音列表
 * 参数说明:
 */
function generate_videoSecMenu(curid){
    var VideoHtml = "";
    //获取二级菜单
    var request = $.ajax({
        url: "../data/menu" ,
        type: "get",
        dataType: 'json',  //类型
        timeout: 3000
    });

    request.success(function(data) {
        if(data.length == 0){
            $(".appsSwiper").hide();
            return;
        }

        $.each(data, function (idx, menu) {
            //生成二级菜单
            var SceMenu = '<li item="' + menu.id + '" class="col-xs-3 ' + (curid == menu.id ? 'nav-active' : '') + ' "> ' +
                '<a href="'+ menu.href +'">'+
                '<span>'+  menu.title + '</span>' +
                '<div class="'+ (curid == menu.id ? 'sec-menu-line' : '') + '">' +
                '</div>' +
                '</a>'+
                '</li>';

            $(".tabs-navbar ul").append(SceMenu);

        });

        secMenuUploadData();//二级菜单上报

        if(mid == '0401'){
            pageViewUploadData();//页面曝光上报
        }

    });

    request.error(function(){
        console.dir("Unable to obtain resources");
    });

};


/**
 * secMenuUploadData() 二级菜单上报
 * 参数说明:
 */
function secMenuUploadData(){
    $(".tabs-navbar ul li").each(function(i){
        var resId = $(this).attr("item");

        if(mid == resId){
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
        }
    });
};