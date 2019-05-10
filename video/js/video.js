/**
 * Created by qhao on 2015/7/14.
 */

var VideoInfo = [];
var itermIndex = 3;//分类显示条数

function generateMainContent(){
    var VideoSource = '<div class="video-type-item" id="' + mid + '">' +
        '</div>';

    $(".appsSwiper").append(VideoSource);


    //获取内容
    var VideoHtml = "";
    //获取内容
    var request1 = $.ajax({
        url: "../data/" + mid ,
        type: "get",
        dataType: 'json',  //类型
        timeout: 3000
    });

    //得到影音数据
    var VideoHtml = "";
    request1.success(function(videoes) {
        VideoInfo = videoes;
        //console.log(videoes);
        if(videoes.item){
            $.each(videoes.item, function(index,item){
                VideoHtml += '<div id="' + item.id +'">' +
                    '<div class="item_head_container">' +
                    '<div class="item_head_title" item="' + item.id +'">' + item.title +'</div>' +
                    '</div><div class="item_container video-type-item">';

                //console.log(videoes[item.id]);
                var itemKeyIndex = 0;
                $.each(videoes[item.id], function(idx,video){

                    var img = '../image/default/video_default.jpg';

                    VideoHtml += '<div id="'+ video.id  +'"' +
                        ' onclick=' + 'videoEvent("' + video.id + '")'  +
                        ' class="col-xs-6 col-sm-3 content-cell video-type-content" item="' + item.id + '">' +
                        '<div class="video-img">' +
                        '<img src="' + video.img +'" ' +
                        'onerror=' + 'nofind("' + video.id +'","' + idx +'")'  +
                        'class="" />' +
                        '</div>' +
                        '<div class="movie_title">'+ video.title +'</div>' +
                        '</div>';

                    if(itemKeyIndex == itermIndex){//每个分类显示三条
                        var MoreSource = "Mas";

                        VideoHtml += '<div class="more_info_container"><span item="' + mid + '"' +
                            'onclick=' + 'getMoreVideo("' + item.id + '")'  +
                            ' class="more_info">' + MoreSource + '</span></div>';
                        return false;//每个分类显示三条
                    }
                    itemKeyIndex += 1;
                });

                VideoHtml +='</div></div>';

            });
        }
        else{
            console.log(videoes);
            var itemKeyIndex = 0;
            $.each(videoes, function(index,video){
                VideoHtml += '<div id="'+ video.id  +'"' +
                    ' onclick=' + 'videoEvent("' + video.id + '")'  +
                    ' class="col-xs-6 col-sm-3 content-cell video-type-content" item="' + mid + '" name="' + video.currentIndex + '">' +
                    '<div class="video-img">' +
                    '<img style="height:257px;width:174px;" class="img-responsive" src="' + video.img +'"/>' +
                    '</div>' +
                    '<div class="movie_title">'+ video.title +'</div>' +
                    '</div>';

                if(itemKeyIndex == itermIndex && itemKeyIndex != videoes.length-1){//每个分类显示4条
                    var MoreSource = "Mas";

                    VideoHtml += '<div class="more_info_container"><span item="' + mid + '"' +
                        'onclick=' + 'getMoreVideo("' + mid + '")'  +
                        ' class="more_info">' + MoreSource + '</span></div>';
                    return false;//每个分类显示三条
                }
                itemKeyIndex += 1;
            });
        }


        $("#" + mid).append(VideoHtml);

        //$(".video-img img").bind("error", function () {
        //    $(this).attr('src', '../image/default/video_default.jpg');//加载图片失败,则显示默认图片;
        //});

    });

    request1.error(function(){
        console.dir("Unable to obtain resources");
        return;
    });
}



function nofind(id,index){
    $("#"+ id +" .video-img img").attr('src', '../image/default/video_default.jpg');//加载图片失败,则显示默认图片;
    if(index%2){
        if($("#"+ id ).prev()){
            console.log("prev");
            $("#"+ id +" .video-img img").attr('height', $("#"+ id).prev().find('.video-img img').height());
            return;
        }
    }
    else{
        if($("#"+ id).next()){
            console.log("next1");
            $("#"+ id +" .video-img img").attr('height', $("#"+ id).next().find('.video-img img').height());
            return;
        }
        if($("#"+ id ).prev()){
            console.log("prev1");
            $("#"+ id +" .video-img img").attr('height', $("#"+ id).prev().find('.video-img img').height());
            return;
        }
    }
}


/**
 * videoEvent() 显示详细页面
 * 参数说明： videoId  视频id
 */
function videoEvent(videoId) {
    var id = $("#" + videoId).attr("id");
    var item = $("#" + videoId).attr("item");
    var curIndex = $("#" + videoId).attr("name")
    var resType = id;
    if(mid == "0404"){
        window.location.href="musicDetails.html?mid="+ mid + "&item="+item+"&id="+id+"&resType="+curIndex+"&ids="+Math.random();
		//window.location.href="AudioController.php";
    }
    else{
        window.location.href="videoDetails.html?mid="+ mid + "&item="+item+"&id="+id+"&resType="+resType+"&ids="+Math.random();
    }
};


/**
 * getMoreVideo(menuId) 获取更多单击事件
 * 参数说明: menuId  二级菜单的id
 */
function getMoreVideo(itemId){
    var obj = $("#"+itemId +" .more_info");
    getData(itemId,obj);//从data获取新闻数据
};


/**
 * getData(item,obj,itermIndex) 从data获取更多视频数据
 * 参数说明: item 单击的“更多新闻”的item属性
 *           obj “更多新闻”Html对象
 *           itermIndex 分类显示条数
 */
function getData(item,obj){
    console.log(item);
    console.log(VideoInfo);
    //console.log(obj);
    var itemKeyIndex = 0;
    var VideoHtml = "";
    if(VideoInfo[item]){
        $.each(VideoInfo[item], function(index,video){
            if(itemKeyIndex > itermIndex){//显示多于五条的

                VideoHtml += '<div id="'+ video.id  +'"' +
                    ' onclick=' + 'videoEvent("' + video.id + '")'  +
                    ' class="col-xs-6 col-sm-3 content-cell video-type-content" item="' + item + '">' +
                    '<div class="video-img">' +
                    '<img style="height:115.75px;width:174px;" class="" src="' + video.img +'"/>' +
                    '</div>' +
                    '<div class="movie_title">'+ video.title +'</div>' +
                    '</div>';
            }
            itemKeyIndex += 1;
        });
        $("#" + item + ' .item_container').append(VideoHtml);
    }
    else{
        $.each(VideoInfo, function(index,video){
            if(itemKeyIndex > itermIndex){//显示多于三条的

                VideoHtml += '<div id="'+ video.id  +'"' +
                    ' onclick=' + 'videoEvent("' + video.id + '")'  +
                    ' class="col-xs-6 col-sm-3 content-cell video-type-content" item="' + item + '">' +
                    '<div class="video-img">' +
                    '<img class="img-responsive" src="' + video.img +'"/>' +
                    '</div>' +
                    '<div class="movie_title">'+ video.title +'</div>' +
                    '</div>';
            }
            itemKeyIndex += 1;
        });

        $("#" + item).append(VideoHtml);
    }

    var tabsSwiperheight = $("#" + item).height();
    $(".appsSwiper").height(tabsSwiperheight + 60);
    obj.parent().hide();
};

function openUrban() {
        window.location.href="urban.html";
};
function openClassics() {
        window.location.href="classics.html";
};
function openElectro() {
        window.location.href="electro.html";
};
function openPop() {
        window.location.href="pop.html";
};
function openFriends() {
        window.location.href="serie1.html";
};
function openSuper() {
        window.location.href="serie2.html";
};
function openPirry() {
        window.location.href="serie3.html";
};
function openLatele() {
        window.location.href="serie4.html";
};
