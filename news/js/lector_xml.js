
window.onload = cargarRSS();
// Funcion para acceder al xml
    function cargarRSS() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                cargarXML(this);
            }
        };
        xhr.open("GET", "colombia.xml", true);
        xhr.send();
    }
    function cargarXML(xml) {
        var docXML = xml.responseXML;
        var tabla = "<h2>EL TIEMPO COLOMBIA</h2>";
        var noti = docXML.getElementsByTagName("item");

        for (var i = 0; i < noti.length; i++) {
            //LINKS redirije a la pagina de la noticia
            link   = noti[i].getElementsByTagName("link")[0].textContent;
            tabla += "<ul>";
            //Imagen
            tabla += "<li>";
            tabla += "<img src='";
            tabla += noti[i].getElementsByTagName("enclosure")[0].getAttribute("url");
            tabla += "'></img>";
            tabla += "</li>"
            tabla += "<li>"
            tabla += "<h3><a href="+link+">";
            //Titulo
            tabla += noti[i].getElementsByTagName("title")[0].textContent;
            tabla += "</a></h3><p>";
            //Descripción
            tabla += noti[i].getElementsByTagName("description")[0].textContent;
            tabla += "</p>";
            tabla += "<span>";
            // Fecha
            tabla += noti[i].getElementsByTagName("pubDate")[0].textContent.slice(0, 17);
            tabla += "</span>";
            tabla += "</li></ul>";
            tabla += "<div></div>"

        }
        //Escribe en el HTML
        document.getElementById("news_rss").innerHTML = tabla;       
        $("img").on("error", function () {
            $(this).unbind("error").attr("src", "../image/noimage.jpg");
          });
    }
