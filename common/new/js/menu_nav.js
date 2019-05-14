$(document).ready(function() {
  $('#header').html(
        "<div class='row'>" +
            "<div id='menu-bar' class='col-12 menu_bar '>" +
                "<div class='header-logo'>"+
                    "<img  src='../../common/images/logo.png' alt=''>" +
                "</div>"+
                "<a href='#' class='bt-menu'><span><i class='fas fa-bars'></i></span></a>" +
            "</div>" +
            "<div class='col-12'>"+
                "<nav>" +
                    "<ul>" +
                        "<li><a href=''>INICIO</a></li>" +
                        "<li><a href=''>PELÍCULAS</a></li>" +
                        "<li><a href=''>SERIES</a></li>" +
                        "<li><a href=''>MÚSICA</a></li>" +
                        "<li><a href=''>NOTICIAS</a></li>" +
                        "<li><a href=''>VIAJES</a></li>" +
                        "<li><a href=''>INTERNET</a></li>" +
                    "</ul>" +
                "</nav>" +
            "</div>" +
        "</div>");

    var contador = 1;
     
        $('#menu-bar').click(function(){
            // $('nav').toggle(); 
            if(contador == 1)
            {
                $('nav').animate({
                    left: '0'
                });
                contador = 0;
            } 
            else 
            {
                contador = 1;
                $('nav').animate({
                    left: '-100%'
                });
            }
     
        }); 
});
