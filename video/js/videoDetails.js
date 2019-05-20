
/**
 * Created by qhao on 2015/4/22.
 */


var idVideo;
var publ;


$(function(){
    videoDetails();/*加载页面数据*/
});


/**
 * videoDetails() 显示新闻详情
 */
function videoDetails(){
    var url = window.location.href;
    var ids = url.split("?")[1].split("&");

    //alert(ids);
    if(ids.length < 3){
        alert("无法正常显示新闻页面，请求参数错误。");

}else{
        //alert(ids);
	var mid = ids[0].split("=")[1];
        var itemId = ids[1].split("=")[1];
        var docid = ids[2].split("=")[1];
        loadVideo(mid,itemId,docid);
    }

    //返回按钮
    $(".back_btn").click(function(){
        history.back();
    })
};


/**
 * loadVideo(itemId,docid) 加载视频
 * 参数说明: itemId 是新闻上级菜单编号 ，docid 新闻编号
 */
function loadVideo(mid,itemId,docid,pub){
    var request = $.ajax({
        url: "../data/" + mid,
        type: "GET",
        dataType: 'json',  //类型
        timeout: 3000
    });

    request.success(function(data) {//得到新闻数据
        if(data[itemId]){
            $.each(data[itemId], function(index,video){
                if(video.id == docid ){
                    //视频信息属性
                    var title = video.title;///视频标题
                    var id = video.id;//视频id
                    var source = video.src;//该视频来源
                    var plot = video.plot;//正文内容
                    var publ = video.pub;//variable publicidad

                    $(".plot").html(plot);
                    var VideoTitle = '<div class="video">' + title + '</div>';

                    var VideoShow = '<video id="'+id +'>" class="video_title" src="' + source
                        + '"  controls controlsList="nodownload" width="100%"><track src="subs.srt" kind="subtitles" srclang="es" label="Español"></video>';

                    $(".header-center").append(VideoTitle);
                    $(".video_show").append(VideoShow);


                    $('video').bind('contextmenu',function() { return false; });

                    videoUploadData(docid,title,itemId);//视频上报
                    return false;
                }
            });
        }
        else{
            $.each(data, function(index,video){
                if(video.id == docid ){
                    //视频信息属性

	            //console.log('video:', video);
                    var title = video.title;///视频标题
                    var id = video.id;//视频id
                    var source = video.src;//该视频来源
                    var plot = video.plot;//正文内容
                    idVideo = id;
                    publ = video.pub;

					//console.log('publ', publ);


                    $(".plot").html(plot);
                    var VideoTitle = '<div class="video">' + title + '</div>';

                    var VideoShow = '<video id="'+id +'" class="video_title" src="' + source
                        + '"  controls controlsList="nodownload" width="100%" autoplay><track src="subs.srt" kind="subtitles" srclang="es" label="Español"></video>';

                    $(".header-center").append(VideoTitle);
                    $(".video_show").append(VideoShow);


                    $('video').bind('contextmenu',function() { return false; });

                    videoUploadData(docid,title,itemId);//视频上报
                    return false;
                }
            });
        }

    });

    request.complete(function(){
	//console.log("publ_1:", publ);
	loadPreroll();
    });

    request.error(function(){
        console.dir("Unable to obtain resources");
    });

};


function videoUploadData(id,title,resType){
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

function loadPreroll(){


	//console.log("publ_2:", publ);


var adManager = function () {


	//console.log("publ_3:", publ);

		var vid = document.getElementById(idVideo);
		var adSrc = publ;
		var src;

console.log(vid);
console.log(adSrc);


						var adEnded = function () {
							vid.removeEventListener("ended", adEnded, false);
							vid.src = src;
							vid.load();
							vid.play();
					$('<style>video::-webkit-media-controls-play-button{display:block}</style>').appendTo('head');
					$('<style>video::-webkit-media-controls-current-time-display{margin-left:0px}</style>').appendTo('head');
					$('<style>video::-webkit-media-controls-mute-button{display:block}</style>').appendTo('head');
					$('<style>video::-webkit-media-controls-volume-slider{display:block}</style>').appendTo('head');
					$('<style>video::-webkit-media-controls-mute-button{display:block}</style>').appendTo('head');

					$(window).keypress(function(e) {
					  var video = document.getElementById("id");
					  if (e.which == 32) {
						if (video.paused == true)
						  video.play();
						else
						  video.pause();
					  }
					});
					$("#"+idVideo).click(function(){this.paused?this.play():this.pause();});

						};
						return {
							init: function () {
								src = vid.src;
								vid.src = adSrc;
								vid.load();
								vid.addEventListener("ended", adEnded, false);
					$('<style>video::-webkit-media-controls-play-button{display:none}</style>').appendTo('head');
					$('<style>video::-webkit-media-controls-mute-button{display:none}</style>').appendTo('head');
					$('<style>video::-webkit-media-controls-current-time-display{margin-left:20px}</style>').appendTo('head');
					$('<style>video::-webkit-media-controls-volume-slider{display:none}</style>').appendTo('head');
					$('<style>video::-webkit-media-controls-mute-button{display:none}</style>').appendTo('head');
						}};
					   }().init();



}
