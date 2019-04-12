// Funcion para descargar el xml de noticias
download();
    function download()
    {
        let down = {
            'down': "Descarga exitosa"
        };
        $.ajax({
            type:'POST',
            url: 'news.php',
            data: down,
            success:function(resp)
            {
                    $("#resps").html(resp);
            }
        });
    return false;
    }