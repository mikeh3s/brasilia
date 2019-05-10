$(function() {

    window.addEventListener('click', function(e){
        if(e.target == flex)
        {
        modal.style.display = 'none';
        }
    });

    let path = 'poll/api/session_up.php';
    
    let user_name = getCookie("userName");
    let user_poll_stat = getCookie("userStat");

    let data = {
            userName: user_name,
            userStat: user_poll_stat
        };

    $.ajax({
       url: path,
       type: 'POST',
       data: data,
       contentType: "application/x-www-form-urlencoded;charset=utf-8",
       success: function (response) {
            $("#modal_show").html(response);
       },
       error: function() {
            alert('Algo esta fallando!');
       }
    });
});