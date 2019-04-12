$(function(){
    let user_session_stat = getCookie("sessionStat");
    
    if (user_session_stat == "1")
    {
        location.href = "homePage.html";
    }
});