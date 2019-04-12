/**
 * Created by qhao on 2015/7/14.
 */

var VideoInfo = [];
var currentIndex = 0;
var itermIndex = 3;//分类显示条数
function generateMainContent(){
    var VideoSource = '<div class="video-type-item song-list" id="' + mid + '">' +
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
        console.log(videoes);
        if(videoes.item){
            $.each(videoes.item, function(index,item){
                console.log(videoes[item.id]);
                if(videoes[item.id] && videoes[item.id].length > 0){
                    VideoHtml += '<p id="' + item.id +'" class="song-list-head ' + (index ===0 ? 'current':'') + '">' + item.title +
                        '<span class="song-number">' + '('+ videoes[item.id].length + ')' + '</span></p>' +
                        '<div class="song-list-body list" ><ul>';

                    $.each(videoes[item.id], function(idx,video){
                        VideoHtml += '<li id="song_' + video.id +
                            '" data-isplay="1" data-id="' + video.id + '" ' +
                            ' onclick=' + 'videoEvent("song_' + video.id + '")'  +
                            ' class="line" item="' + item.id +'" name="' + currentIndex + '">' +
                            '<p class="index rk">' + (idx + 1) + '</p>' +
                            '<p class="song-name">'+ video.title +'</p>' +
                            '<p class="singer-name">'+ (video.artist ? video.artist : 'unknown') +'</p>' +
                            '</li>';
                        currentIndex++;
                    });
                }

                VideoHtml +='</ul></div>';

            });
        }
        else{
            var itemKeyIndex = 0;
            $.each(videoes, function(index,video){
                VideoHtml += '<div id="'+ video.id  +'"' +
                    ' onclick=' + 'videoEvent("' + video.id + '")'  +
                    ' class="col-xs-6 col-sm-3 content-cell video-type-content" ' +
                    'item="' + mid + '" name="' + currentIndex + '">' +
                    '<div class="video-img">' +
                    '<img style="height:101.69px;width:174px;" class="img-responsive" src="' + video.img +'"/>' +
                    '</div>' +
                    '<div class="movie_title">'+ video.title +'</div>' +
                    '</div>';
                if(itemKeyIndex == itermIndex){//每个分类显示三条
                    var MoreSource = "More";

                    VideoHtml += '<div class="more_info_container"><span item="' + mid + '"' +
                        'onclick=' + 'getMoreVideo("' + mid + '")'  +
                        ' class="more_info">' + MoreSource + '</span></div>';
                    return false;//每个分类显示三条
                }
                currentIndex++;
                itemKeyIndex += 1;
            });
        }


        $("#" + mid).append(VideoHtml);

        $("#" + mid + " .song-list-body:eq(0)").show();
        $("#" + mid + " p.song-list-head").each(function(i){
            $(this).click(function(){
                var bodydisplay = $("#" + mid + " .song-list-body:eq(" + i +")").css("display");
                $(this).addClass("current").next("div.song-list-body").slideToggle(300).siblings("div.song-list-body").slideUp("slow");

                if(bodydisplay == "block"){
                    $(this).removeClass("current");
                }
                else{
                    $(this).siblings().removeClass("current");
                }
            });
        })

    });

    request1.error(function(){
        console.dir("Unable to obtain resources");
        return;
    });
}




/**
 * videoEvent() 显示详细页面
 * 参数说明： videoId  视频id
 */
function videoEvent(videoId) {
    var id = $("#" + videoId).attr("id");
    var item = $("#" + videoId).attr("item");
    var curIndex = $("#" + videoId).attr("name");
    window.location.href="musicDetails.html?mid="+ mid + "&item="+item+"&id="+id+"&resType="+curIndex+"&ids="+Math.random();
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
    currentIndex++;
    if(VideoInfo[item]){
        $.each(VideoInfo[item], function(index,video){
            if(itemKeyIndex > itermIndex){//显示多于五条的

                VideoHtml += '<div id="'+ video.id  +'"' +
                    ' onclick=' + 'videoEvent("' + video.id + '")'  +
                    ' class="col-xs-6 col-sm-3 content-cell video-type-content" ' +
                    'item="' + item + '">' +
                    '<div class="video-img" name="' + currentIndex + '">' +
                    '<img style="height:101.69px;width:174px;" class="" src="' + video.img +'"/>' +
                    '</div>' +
                    '<div class="movie_title">'+ video.title +'</div>' +
                    '</div>';
                currentIndex ++;
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
                    ' class="col-xs-6 col-sm-3 content-cell video-type-content" ' +
                    'item="' + item + '"  name="' + currentIndex + '">' +
                    '<div class="video-img">' +
                    '<img class="img-responsive" src="' + video.img +'"/>' +
                    '</div>' +
                    '<div class="movie_title">'+ video.title +'</div>' +
                    '</div>';
                currentIndex++;
            }
            itemKeyIndex += 1;
        });

        $("#" + item).append(VideoHtml);
    }

    var tabsSwiperheight = $("#" + item).height();
    $(".appsSwiper").height(tabsSwiperheight + 60);
    obj.parent().hide();
};