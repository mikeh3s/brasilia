/**
 * Created by Administrator on 2015/3/31.
 */
var Popup = function (html) {
    // html 弹出层的主体
    // 只定义边框和关闭按钮，其余在参数中定义
    var $popup = $("<div class='my-popup'>"+
        "<div class='my-popup-content'>" +
        (html ? html : "") +
        "</div>" +
        "</div>");

    return {
        show: function () {
            $("body").append($popup);
        },
        hide: function () {
            // 移除本次遮罩和弹出层
            $popup.remove();
        }
    };

};


/**
*生成弹出层
*pupContent是弹出层内容
* delay是关闭弹出层的延时时间
*/
var GenerateNewPopup = function(pupContent , delay){
    var pupHtml = '<span>'+pupContent +'</span>';

    var popup = new Popup(pupHtml);
    popup.show();

    setTimeout(function () {
        popup.hide();
    }, delay* 1000);
};
