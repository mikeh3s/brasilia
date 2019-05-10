/**
 * Created by qhao on 2017/6/19.
 */
var audioPlayer = {};
var user = {};
var playType = 'order';
var curPlayIndex = 0;
var ListNumber = 0;
var resType = '0404';
var timeout;
var duration = '00:00';
$(function() {

    //是否支持svg
    if (!testSvg()) {
        $('#play_pause').addClass('no-svg');
    } else {
        $('#play_pause').addClass('svg');
    }
    //Safari浏览器播放器居中
    if (isApple() && window.innerWidth == 320 && testBrowser() != 'QQ' && testBrowser() != 'UC') {
        $('.audio_main').css('margin-top', '-95px');
    }
    var audioContainer = $('#audio').get(0);
    audioPlayer.audio = audioContainer;

    var url = window.location.href;
    var ids = url.split("?")[1].split("&");

    if(ids.length < 3){
        alert("Requested parameter error, unable to display page properly.");
    }else{
        var mid = ids[0].split("=")[1];
        var itemId = ids[1].split("=")[1];
        var docid = ids[2].split("=")[1];
        var curIndex = ids[3].split("=")[1];
        //loadMusicHtml(itemId,docid);
        initiaList(mid,itemId,docid,curIndex); //初始化播放列表
    }

    //返回按钮
    $(".back_btn").click(function(){
        history.back();
    });
});


//摇一摇随机切换歌曲
function shakeEventDidOccur () {
    playNext();
}

function testBrowser() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf('QQ') > -1) {
        return 'QQ';
    } //判断是否QQ浏览器
    if (userAgent.indexOf('UC') > -1) {
        return 'UC';
    } //判断是否UC浏览器
}

function testSvg() {
    var ns = {
        'svg': 'http://www.w3.org/2000/svg'
    };
    return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
}


function comfirmModel(){
    var txt=  "List of songs have been repeated once, will you return to song list or play again?";
    $.confirm({
        title: 'back or play again',
        content: txt,
        buttons: {
            confirm: {
                text: 'back to list',
                btnClass: 'btn-blue',
                action: function(){
                    window.location.href = "music.html";
                }

            },
            cancel:{
                text: 'play again',
                btnClass: 'btn-green',
                action: function(){
                    $("#play_pause").removeClass("play").addClass("pause");
                    $(".audio_player").find('img').addClass("imgstatus");
                    beginPlay(true);
                }

            }
        }
    });
}

function initiaList(mid,itemId,docid,curIndex) {

    $('.progresser .slider').width(window.innerWidth - 40 - $('.progresser .timer').width()*2);

    var request = $.ajax({
        url: "../data/" + mid,
        type: "GET",
        dataType: 'json',  //类型
        timeout: 3000
    });

    var musicList = [];
    request.success(function(data) {//得到音乐数据

        if(data.item){
            $.each(data.item, function(index,item){
                if(data[item.id] && data[item.id].length > 0){
                    $.each(data[item.id], function(idx,video){
                        ListNumber ++;
                        musicList.push(video);
                    });
                }
            });
        }
        else{
            $.each(data, function(idx,video){
                ListNumber ++;
                musicList.push(video);
            });
        }



        console.dir(musicList);
        //ListNumber = data[itemId].length;
        //audioPlayer.playlist = data[itemId];
        audioPlayer.playlist = musicList;
        audioPlayer.currentIndex = parseInt(curIndex) ;
        curPlayIndex = audioPlayer.currentIndex;

        var MusicTitle = '<div class="music_title">' + audioPlayer.playlist[curPlayIndex].title + '</div>';
        $(".header-center").html(MusicTitle);
        user.countAction = 0;

        beginPlay(true);

        //时间
        audioPlayer.audio.addEventListener("timeupdate",
            function() {
                if(duration !== audioPlayer.audio.duration){
                    duration = audioPlayer.audio.duration;
                    if(isNaN(duration)){
                        $('.duration').html('00:00');
                    }
                    else {
                        var currentduration = parseInt(duration%60) < 10 ? '0' + parseInt(duration%60) : parseInt(duration%60);
                        $('.duration').html(parseInt(duration/60)+':'+currentduration);
                    }
                }
                updateProgress();
            }, false);

        //结束
        audioPlayer.audio.addEventListener("ended",
            function() {
                playNext();
            }, false);

        //播放
        audioPlayer.audio.addEventListener("play",
            function() {
                audioPlay();
            }, false);



        //If this is fired, then client can't play MP3s
        audioPlayer.audio.addEventListener('error', function(e){
            playError(false, e);
        }, false);


        //暂停按钮
        $('#play_pause').get(0).addEventListener("click",
            function() {
                event.stopPropagation();
                audioPause();
            }, false);
        //下一首
        $('#next_song').get(0).addEventListener("click",
            function() {
                playNext();
            }, false);


        $('#nfav_btn').get(0).addEventListener("click",
            function() {
                playProvirous();
            }, false);

        //歌词页
        $('.lrctxtshow').get(0).addEventListener("click",
            function() {
                $('.audio_container').css('display', 'none');
                $('#lrc').fadeIn(2000);
            }, false);
        //歌曲页
        $('.audiotxtshow').get(0).addEventListener("click",
            function() {
                $('#lrc').css('display', 'none');
                $('.audio_container').fadeIn(300);
            }, false);



        // Progress slider
        $('.progresser .slider').slider({step: 0.1, slide: function(event, ui){
            $(this).addClass('enable');
            setProgress(audioPlayer.audio.duration * ui.value / 100);
            clearInterval(timeout);
        }, stop: function(event, ui){
            if(isNaN(audioPlayer.audio.duration)){
                $('.duration').html('00:00');
                $(".progresser .timer").html('00:00');
            }
            else{
                audioPlayer.audio.currentTime = audioPlayer.audio.duration * ui.value / 100;
                $(this).removeClass('enable');
                timeout = setInterval(updateProgress, 500);
            }

        }});


        //播放类型切换
        var clicknum = 0;
        $('.play_type').click(function(){
            //console.log(clicknum);
            //随机
            if(clicknum === 0){
                //$(".play_type").find('img').attr('src','../image/music/shuffle.png');
                $(".play_type").find('div').attr('class','shuffle');
                $(this).find('p').text('Random play');
                $(this).find('p').css('display','block');
                setTimeout(function(){
                    $('.play_type p').css('display','none');
                },1000);
                playType = 'shuffle';
                clicknum++;
            }
            //单曲循环
            else if(clicknum === 1){
                //$(".play_type").find('img').attr('src','../image/music/single_loop.png');
                $(".play_type").find('div').attr('class','single_loop');
                $(this).find('p').text('Single cycle');
                $(this).find('p').css('display','block');
                setTimeout(function(){
                    $('.play_type p').css('display','none');
                },1000);
                playType = 'single_loop';
                clicknum++;
            }
            //顺序播放一次
            else if(clicknum === 2){
                //$(".play_type").find('img').attr('src','../image/music/order_play_once.png');
                $(".play_type").find('div').attr('class','order_play_once');
                $(this).find('p').text('repeat one');
                $(this).find('p').css('display','block');
                setTimeout(function(){
                    $('.play_type p').css('display','none');
                },1000);
                playType = 'order_once';
                clicknum++;
            }
            //顺序播放Cycle all songs
            else if(clicknum === 3){
                //$(".play_type").find('img').attr('src','../image/music/order_play.png');
                $(".play_type").find('div').attr('class','order_play');
                $(this).find('p').text('repeat all songs');
                $(this).find('p').css('display','block');
                setTimeout(function(){
                    $('.play_type p').css('display','none');
                },1000);
                playType = 'order';
                clicknum = 0;
            }
        });

        //摇一摇切换歌曲
        var myShakeEvent = new Shake({
            threshold: 15
        });

        myShakeEvent.start();

        window.addEventListener('shake', shakeEventDidOccur, false);

        $(window).bind('resize', function(e) {
            $('.progresser .slider').width(window.innerWidth - 40 - $('.progresser .timer').width()*2);
            updateProgress();
        });

        $(window).resize();
    });

    request.error(function(){
        console.dir("Unable to obtain resources");
    });
}

//pause
var audioPause = function(){
    if (audioPlayer.audio.paused || audioPlayer.audio.ended) {
        $("#play_pause").removeClass("play").addClass("pause");
        $(".audio_player").find('img').addClass("imgstatus");
        audioPlayer.audio.play();

    } else {
        $("#play_pause").removeClass("pause").addClass("play");
        $(".audio_player").find('img').removeClass("imgstatus");
        audioPlayer.audio.pause();
    }
}


//play
var audioPlay = function(){
    $("#play_pause").removeClass("play").addClass("pause");
    $(".audio_player").find('img').addClass("imgstatus");
}


var playError = function(status,error){
    console.log(error);
}

// Update progress
var setProgress = function(value){
    var currentSec = parseInt(value%60) < 10 ? '0' + parseInt(value%60) : parseInt(value%60),
        ratio = value / audioPlayer.audio.duration * 100;
    $('.timer').html(parseInt(value/60)+':'+currentSec);
    $('.progresser .pace').css('width', ratio + '%');
    $('.progresser .slider a').css('left', ratio + '%');
}

var updateProgress = function(){
    setProgress(audioPlayer.audio.currentTime);
}

//开始播放
function beginPlay(isInit) {
    user.countAction = 0;
    var currPlayer = audioPlayer.playlist[audioPlayer.currentIndex];
    audioPlayer.audio.src = currPlayer.src;
    setInfo(currPlayer);

    $.lrc.start(currPlayer.lrc_path, function() {
        return audioPlayer.audio.currentTime;
    }); //显示歌词

    audioPlayer.audio.play();

//            console.log(audioPlayer.audio.volume);
    musicUploadData(currPlayer.id,currPlayer.title,resType)
}

//设置歌曲信息
function setInfo(currPlayer) {
    if(currPlayer.img){
        var img_path = currPlayer.img;
        $('#imgId').attr('src', img_path);
    }
    else{
        $('#imgId').attr('src', '../image/default/music_default.png');
    }
    //loadImage(img_path);
    var MusicTitle = '<div class="music_title" title="' + currPlayer.title + '">' + currPlayer.title + '</div>';
    $(".header-center").html(MusicTitle);

    $('.audio_info .audio_name').html(currPlayer.title);
    $('.audio_info .author').html(currPlayer.artist);
    $('#lrc .music_name').html(currPlayer.title);
    $('#lrc .singer').html(currPlayer.artist);

}

//生成随机数
function random(min,max,num){

    return Math.floor(min+Math.random()*(max-min)) == num;

}


//播放下一首
function playNext() {
    //console.log(playType);
    //console.log(curPlayIndex);
    if(ListNumber == 0){
        return false;
    }
    var currentTime = parseInt(audioPlayer.audio.currentTime,10);
    var duration = parseInt(audioPlayer.audio.duration,10);
    if(isNaN(duration)){
        duration = 0;
    }
    var currPlayer = audioPlayer.playlist[audioPlayer.currentIndex];
    audioPlayer.audio.pause();

    if(playType == 'order'){//顺序播放
        if (audioPlayer.currentIndex == audioPlayer.playlist.length - 1) {
            //最后一首重新选歌
            audioPlayer.currentIndex = 0;
            user.likeAction = false;
            user.unLikeAction = false;
            //resetPlayer();
            beginPlay(true);
        } else {
            audioPlayer.currentIndex += 1;
            user.likeAction = false;
            user.unLikeAction = false;
            //resetPlayer();
            beginPlay(true);
        } //歌曲+1
    }
    else if(playType == 'single_loop'){//单曲循环
        //audioPlayer.currentIndex = curPlayIndex;
        user.likeAction = false;
        user.unLikeAction = false;
        //resetPlayer();
        beginPlay(true);
    }
    else if(playType == 'shuffle'){//随机播放
        audioPlayer.currentIndex = Math.floor(0+Math.random()*(ListNumber-1-0));
        console.log(audioPlayer.currentIndex);
        user.likeAction = false;
        user.unLikeAction = false;
        //resetPlayer();
        beginPlay(true);
//                alert(audioPlayer.currentIndex);
    }
    else if(playType === 'order_once'){
        //console.log('order_once');
        if (audioPlayer.currentIndex == audioPlayer.playlist.length - 1) {
            //最后一首重新选歌
            user.likeAction = false;
            user.unLikeAction = false;
            //resetPlayer();
            audioPlayer.audio.pause();
            $("#play_pause").removeClass("pause").addClass("play");
            $(".audio_player").find('img').removeClass("imgstatus");
            audioPlayer.currentIndex = 0;
            comfirmModel();

        } else {
            audioPlayer.currentIndex += 1;
            user.likeAction = false;
            user.unLikeAction = false;
            //resetPlayer();
            beginPlay(true);
        } //歌曲+1
    }
}

//播放上一首
function playProvirous() {
    //console.log(playType);
    if(ListNumber == 0){
        return false;
    }
    var currentTime = parseInt(audioPlayer.audio.currentTime,10);
    var duration = parseInt(audioPlayer.audio.duration,10);
    if(isNaN(duration)){
        duration = 0;
    }
    var currPlayer = audioPlayer.playlist[audioPlayer.currentIndex];
    audioPlayer.audio.pause();

    if(playType == 'order') {//顺序播放
        if (audioPlayer.currentIndex == 0) {
            //第一首重新选歌
            audioPlayer.currentIndex = audioPlayer.playlist.length - 1;
            user.likeAction = false;
            user.unLikeAction = false;
            //resetPlayer();
            beginPlay(true);
        } else {
            audioPlayer.currentIndex -= 1;
            user.likeAction = false;
            user.unLikeAction = false;
            //resetPlayer();
            beginPlay(true);
        } //歌曲+1
    }
    else if(playType == 'single_loop'){//单曲循环
        //audioPlayer.currentIndex = curPlayIndex;
        user.likeAction = false;
        user.unLikeAction = false;
        //resetPlayer();
        beginPlay(true);
    }
    else if(playType == 'shuffle'){//随机播放
        audioPlayer.currentIndex = Math.floor(0+Math.random()*(ListNumber-1-0));
        console.log(audioPlayer.currentIndex);
        user.likeAction = false;
        user.unLikeAction = false;
        //resetPlayer();
        beginPlay(true);
    }
    else if(playType === 'order_once'){
        if (audioPlayer.currentIndex == 0) {
            //第一首重新选歌
            audioPlayer.currentIndex = audioPlayer.playlist.length - 1;
            user.likeAction = false;
            user.unLikeAction = false;
            //resetPlayer();
            beginPlay(true);
        } else {
            audioPlayer.currentIndex -= 1;
            user.likeAction = false;
            user.unLikeAction = false;
            //resetPlayer();
            beginPlay(true);
        } //歌曲+1
    }

}


//判断是否在数组内
function inArray(curr, targetArray) {
    if (typeof(targetArray) === 'undefined') {
        return false;
    }
    for (var i = 0; i < targetArray.length; i++) {
        if (curr == targetArray[i]) {
            return true;
        }
    }
    return false;
}

//还原效果
function resetPlayer() {
    var canvas = $('#progress').get(0);
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//歌曲进度
function updateProgressc() {
    var canvas = $('#progress').get(0);
    var percent = Math.floor((100 / audioPlayer.audio.duration) * audioPlayer.audio.currentTime);
    var context = canvas.getContext('2d');
    if (window.innerWidth >= 768) {
        canvas.width = 640;
        canvas.height = 640;
    } else if (window.innerWidth == 320 || window.innerHeight <= 480) {
        canvas.width = 320;
        canvas.height = 320;
    } else {
        canvas.width = 480;
        canvas.height = 480;
    }
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = centerX - 10;
    var circ = Math.PI * 2;
    var cpercent = percent / 100;
    var sAangle = 1.5 * Math.PI;
    var eAangle = 1.5 * Math.PI + (circ) * cpercent;
    context.beginPath();
    context.arc(centerX, centerY, radius, sAangle, eAangle, false);
    context.lineWidth = 16;
    context.lineCap = "round";
    context.strokeStyle = '#f15958';
    context.stroke();
    context.closePath();
};

/**
 * musicUploadData(id,title,resType) 音乐上报
 * 参数说明: id 是资源编号;
 *           title 资源名称;
 *           resType 资源类型(例如：music 0404)
 */
function musicUploadData(id,title,resType){
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

function nofind(){
    $.alert({
        title: 'error',
        content: 'No supported source was found, try other please!',
    });
    $("#play_pause").removeClass("pause").addClass("play");
    $(".audio_player").find('img').removeClass("imgstatus");
    audioPlayer.audio.pause();
}