/**
 * Created by qhao on 2015/7/31.
 * 具体旅游信息页面
 */

$(function(){
    travelDetails();/*加载页面数据*/
});


/**
 * travelDetails() 显示旅游信息详情
 */
function travelDetails(){
    var url = window.location.href;
    var ids = url.split("?")[1].split("&");

    if(ids.length < 3){
        alert("无法正常显示新闻页面，请求参数错误。");
    }else{
        var itemId = ids[0].split("=")[1];
        var id = ids[1].split("=")[1];
        loadTravelInfo(itemId,id);
    }

    //返回按钮
    $(".back_btn").click(function(){
        history.back();
    })
};


/**
 * loadTravelInfo(itemId,id) 加载视频
 * 参数说明: itemId 是上级菜单编号 ，id 景点编号
 */
function loadTravelInfo(itemId,id){
    var request = $.ajax({
        url: "../data/" + itemId,
        type: "GET",
        dataType: 'json',  //类型
        timeout: 3000
    });

    request.success(function(data) {//得到新闻数据
        var title,body,img,subtitle;
        $.each(data,function(idx,item){
            if(item.id === id){
                title = item.title;//文章标题
                body = item.plot;//文章正文内容
                img = item.imgsrc;//文章正文图片，是一段数组json
                subtitle = item.subtitle;
            }
        });
        if(typeof img!="string"){
        	img = JSON.stringify(img)
        }
        //img转json
        img = $.parseJSON(img); 
        //替换body中的图片占位符<!--IMG#0-->
        if (img.length> 0 ) {
            $.each(img, function(index,img){
                var imgLabel = '<div style="margin:10px auto 5px auto;width:96%" ><img style="height:259.19px;width:100%" src=" ' + img.src + '"/></div>' +
                    '<div class="news_title">' + title + '</div>' +
                    '<div class="travel_detail">' + subtitle + '</div>';
                body = body.replace(img.ref, imgLabel);
            });
        }

        var TravelTitle = '<div class="travel_title">' + title + '</div>';

        $(".header-center").append(TravelTitle);
        $(".bottompart").html(body);

        travelUploadData(id,title,itemId);//视频上报
    });

    request.error(function(){
        console.dir("无法获取资源");
    });

};


/**
 * travelUploadData(id,title,resType) 旅游资源上报
 * 参数说明: id 是资源编号;
 *           title 资源名称;
 *           resType 资源类型(例如：热门片花 0401)
 */
function travelUploadData(id,title,resType){
    //视频上报
    $.hongdian.uploadData({
        resId:id,
        resName:title,
        resType:resType,
        view:1,
        click:1,
        flag:0
    }, function() {

    });
};