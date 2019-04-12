
var parametros =$(this).serialize();
    $(function() { // Ojo! uso jQuery, recuerda añadirla al html
        cron(); // Lanzo cron la primera vez
        function cron() {
          $.ajax({
              type: "POST",
              url: "subir.php",
              data: parametros,
              success: function(text) {
                  if (text == "success") {
                      contactFormSuccess();
                  }
              }
          }).done(function(msg) {
                console.log(msg);
            });
        }
        setInterval(function() {
            cron();
        }, 10000); // Lanzará la petición cada 10 segundos
    });
