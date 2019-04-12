/**
 * Created by qhao on 2015/7/29.
 * 旅游页面js
 */

var mid = "0801";//旅游页面编号
var itermIndex = 2;//分类显示条数
var TravelInfo = [];
var dir = "../../advertisement/data/";
var adImgheight = 220;//top广告图片高度
$(function(){
    var userInfo = getQueryString("userInfo");
    if(userInfo){
        userInfo = phoneDecryption(userInfo);
        userInfo = phoneEncrypt(userInfo);
    }

    generate_tour_list();//获取景点列表

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
                window.location.href = "../../homePage/web/homePage.html?userInfo="+userInfo+"&ids="+Math.random();
            }else{
                window.location.href = "../../homePage/web/homePage.html"+"?id="+Math.random();
            }
        });
    });
});




/**
 * generate_videoSecMenu() 生成景点列表
 * 参数说明:
 */
function generate_tour_list(){

    //获取二级菜单
    var request = $.ajax({
        url: "../data/menu" ,
        type: "get",
        dataType: 'json',  //类型
        timeout: 3000
    });

    request.success(function(data) {
        if(data.length == 0){
            return;
        }

        $.each(data, function (idx, menu) {
            //生成二级菜单
            var SceMenu = '<div item="' + menu.id + '" class="travel_item_title">' + menu.title + '</div>' +
                '<div id="' + menu.id + '" class="travel_item_content">' +
                '<ul></ul>' +
                '</div>';

            $('.travel_content').append(SceMenu);

            //获取内容
            var TourHtml = "";
            //获取内容
            var request1 = $.ajax({
                url: "../data/" + menu.id ,
                type: "get",
                dataType: 'json',  //类型
                timeout: 3000
            });

            //得到数据
            var itemKeyIndex = 0;
            request1.success(function(tours) {
                menu.info = tours;
                TravelInfo.push(menu);
                $.each(tours, function(index,tour){
                    TourHtml += '<li id="' + tour.id + '" title="' + tour.title + '" item="'+ menu.id  + '" '+
                        'onclick=' + 'TravelEvent("' + tour.id + '")'  +
                        ' href="' + tour.href + '" >' +
                        '<img style="width:350px;height:158.06px;"src="' + tour.img + '"/>' +
                        '<div class="travel_name">' + tour.title + '</div>' +
                        '</li>';

                    if(itemKeyIndex == itermIndex){//每个分类显示三条

                        TourHtml += '<div class="more_info_container">' +
                            '<span item="' + menu.id + '" class="more_info">Mas </span>' +
                            '</div>';
                        return false;//每个分类显示三条
                    }
                    itemKeyIndex += 1;
                });
                $("#" + menu.id + ' > ul').append(TourHtml);
                getMoreTour(menu.id);//获取更多视频
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
        $(".showVideo").css("display","none");
    });
};



/**
 * TravelEvent() 显示详细页面
 * 参数说明： travelid  景点id
 */
function TravelEvent(travelid) {
    var id = $("#" + travelid).attr("id");
    var item = $("#" + travelid).attr("item");
    var resType = id;
    window.location.href="travelDetail.html?item="+item+"&id="+id+"&resType="+resType+"&ids="+Math.random();
};


/**
 * getMoreVideo(menuId) 获取更多单击事件
 * 参数说明: menuId  二级菜单的id
 */
function getMoreTour(menuId){
    $("#"+menuId +" .more_info").click(function() {
        var item = $(this).attr("item");
        var obj = $(this);
        getData(item,obj);//从data获取新闻数据
    });
};


/**
 * getData(item,obj,itermIndex) 从data获取更多视频数据
 * 参数说明: item 单击的“更多新闻”的item属性
 *           obj “更多新闻”Html对象
 *           itermIndex 分类显示条数
 */
function getData(item,obj){
    var itemKeyIndex = 0;
    var TourHtml = "";
    var MoreTours = [];
    for(var i=0;i<TravelInfo.length;i++){
        if(item == TravelInfo[i].id){
            MoreTours = TravelInfo[i].info;
            break;
        }
    }
    $.each(MoreTours, function(index,tour){
        if(itemKeyIndex > itermIndex){//显示多于三条的

            TourHtml += '<li id="' + tour.id + '" title="' + tour.title + '" item="'+ item  + '" '+
                'onclick=' + 'TravelEvent("' + tour.id + '")'  +
                ' href="' + tour.href + '" >' +
                '<img style="width:350px;height:158.06px;" src="' + tour.img + '"/>' +
                '<div class="travel_name">' + tour.title + '</div>' +
                '</li>';
        }
        itemKeyIndex += 1;
    });

    $("#" + item + " > ul").append(TourHtml);
    obj.parent().hide();
};



/**
 * secMenuUploadData() 二级菜单上报
 * 参数说明:
 */
function secMenuUploadData(){
    $(".travel_content .travel_item_title").each(function(i){
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