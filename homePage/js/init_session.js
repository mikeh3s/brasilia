$(function(){
        let nombre;
        var lista = document.cookie.split(";");
        for (i in lista) {
            var busca = lista[i].search(nombre);
            if (busca > -1) {micookie=lista[i]}
            }
        var igual = micookie.indexOf("=");
        var valor = micookie.substring(igual+1);
        console.log(valor);
        if (valor == "1")
        {
            location.href = "homePage.html";
        }
        return valor;
    // let user_session_stat = getCookie("sessionStat");
    // let x = document.cookie;
});