/**
 * Created by qhao on 2015/4/17.
 * 生成一级菜单
 */

/**
 * getMenu() 除首页外的其他页面的一级菜单
 */
function getMenu(id){
    //判断用户是否认证过
    var userInfo = getQueryString("userInfo");
    if(userInfo){
        userInfo = phoneDecryption(userInfo);
        userInfo = phoneEncrypt(userInfo);
    }

    $.getJSON("../../common/data/menu",function(data){
        var MenuDiv = "";
        if(userInfo){
            $.each(data, function(index,values){
                if((index != 0) && (values.type != "auth")){
                    if(values.id == id){
                        console.log(id);
                        MenuDiv += "<li style='cursor: pointer;'  item=' " + values.title + "' class='col-xs-3 cur_menu menu_" + values.id + "' type='" +
                            values.type + "' id='"+values.id +"' href='" +values.href + "' >" +
                            values.title + "</li>";
                    }
                    else{
                        MenuDiv += "<li style='cursor: pointer;'  item=' " + values.title + "' class='col-xs-3 menu_" + values.id + "' type='" +
                            values.type + "' id='"+values.id +"' href='" +values.href + "' >" +
                            values.title + "</li>";
                    }
                }
            });
            $(".menu-ul").append(MenuDiv);
        }
        else{
            $.each(data, function(index,values){
                if((index != 0) && (values.type != "confirm")){
                    if(values.id == id){
                        MenuDiv += "<li style='cursor: pointer;'  item=' " + values.title + "' class='cur_menu col-xs-3 menu_" + values.id + "' type='" +
                            values.type + "' id='"+values.id +"' href='" +values.href + "' >" +
                            values.title + "</li>";
                    }
                    else {
                        MenuDiv += "<li style='cursor: pointer;'  item=' " + values.title + "' class='col-xs-3 menu_" + values.id + "' type='" +
                            values.type + "' id='"+values.id +"' href='" +values.href + "' >" +
                            values.title + "</li>";
                    }

                }
            });
            $(".menu-ul").append(MenuDiv);
        }
        FirMenuClick(userInfo);//每个页面的一级菜单的单击事件
    });
};


/**
 *  FirMenuClick(userInfo) 每个页面的一级菜单的单击事件
 *  userInfo  判断用户是否认证过
 */
function FirMenuClick(userInfo){
    //var mid = $(".container").attr("mid");
    //var menuLiId = "02";
    //if(mid){
    //    menuLiId = mid.substring(0,2);
    //}
    ////当前选中菜单按钮背景颜色
    //$(".main_menu ul li").removeClass("cur_menu");
    //if(menuLiId == "07"){
    //    //id是07时有两个菜单按钮
    //    $("li[id='"+menuLiId+"']").addClass("cur_menu");
    //}else{
    //    $("#"+menuLiId).addClass("cur_menu");
    //}

    $(".menu-ul li").each(function(i){
        $(this).click(function() {
            var href = $(this).attr("href");

            //初始化时不是当前选中的一级菜单上报
            if(i >0){
                var resId = $(this).attr("id");
                var resName = $(this).text();
                var resType = resId;

                if(resId == "07"){
                    //上网一般资源上报
                    $.hongdian.uploadData({
                        resId:resId,
                        resName:resName,
                        resType:resType,
                        click:1,
                        flag:1
                    }, function(data) {
                    });
                }

                $.hongdian.uploadData({
                    resId:resId,
                    resName:resName,
                    resType:resType,
                    click:1,
                    flag:1
                }, function(data) {
                    if(userInfo){
                        window.location.href = href+"?userInfo="+userInfo+"&id="+Math.random();
                    }else{
                        window.location.href = href+"?id="+Math.random();
                    }
                });

            }else{
                if(userInfo){
                    window.location.href = href+"?userInfo="+userInfo+"&id="+Math.random();
                }else{
                    window.location.href = href+"?id="+Math.random();
                }
            }
        });

        //初始化时当前选中的一级菜单上报
        if($(this).hasClass("cur_menu")){
            var resId = $(this).attr("id");
            var resName = $(this).text();
            var resType = resId;
            $.hongdian.uploadData({
                resId:resId,
                resName:resName,
                resType:resType,
                click:1,
                flag:1
            }, function() {
            });
        }
    });
};
