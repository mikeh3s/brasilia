function send()
{
    let modal = document.getElementById('modal-window');
    let answer = document.getElementById('answer').value;
    let comentarios = document.getElementById('comentarios').value;
    let mac = getCookie("userMac");
    let sn = getCookie("userSN");
    let user_poll_stat = getCookie("userStat");
    let data = {
        answer: answer,
        comentarios: comentarios,
        userMac: mac,
        userSN: sn,
        userPollStat: user_poll_stat
    };
    console.log(data);
    $.ajax({
        type:'POST',
        url: 'poll/api/uploadpoll.php',
        data: data,
        success:function(resp)
        {
            if(answer == "")
            {
                $("#validate").html(resp);
            }
            else 
            {
                modal.style.display = 'none';
            }
        }, 
        error: function()
        {
            alert('Ocurrio un error!');
        }
    });
    return false;
}