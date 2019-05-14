$('#send_btn').click(function send_form(stmt_send){
    /** Get data values */
    let name = $('#name');
    let email = $('#email');
    let phone = $('#phone');
    let age = $('#age');
    let gender = $('#gender');
    /**Show alert if success send data or not */
    let warning = $('#warning');
    /*Get first number phone */
    let num = phone.val().charAt(0);
    /*Path for file upload data in the server*/
    let path = "../../common/api/process.php";
    // Redirect from SignUp to full.html
    let redirect = function (){
        location.href ="full.html";
    }
    /** Function validate EMAIL */
    let isEmail = function(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email.val());
    }
        // Obtener la hora actual desde el navegador
        let momentoActual = new Date()
        let hora = momentoActual.getHours()
        let minuto = momentoActual.getMinutes()
        let segundo = momentoActual.getSeconds()
    
        let str_segundo = new String (segundo)
        if (str_segundo.length == 1)
        {    
            segundo = "0" + segundo
        }

        let str_minuto = new String (minuto)
        if (str_minuto.length == 1)
        {
            minuto = "0" + minuto
        }   
    
        let str_hora = new String (hora)
        if (str_hora.length == 1)
        {
            hora = "0" + hora
        }
        let horaImprimible = hora + ":" + minuto + ":" + segundo
        let timer = new Date().toJSON().slice(0, 10).replace('T', ' ');
        let timerd = timer + " "+horaImprimible;
        // Final script de la hora
    let validateData = {
        name: name,
        email: email,
        phone: phone,
        age: age,
        gender: gender
    }
    let data = {
        name: name.val(),
        email: email.val(),
        phone: phone.val(),
        age: age.val(),
        gender: gender.val(),
        time: timerd
    }
    
    console.log(data);
    /*Validate form*/
    for (let prop in validateData)
    {
        console.log(validateData[prop]);
        if (validateData[prop] == "")
        {
            validateData[prop].css('border', '2px solid red');
            stmt_send = false;
        }
        else
        {
            validateData[prop].css('border', '2px solid green');
            stmt_send = true;
        }
    }
    if (stmt_send == false)
    {
        warning.html("Porfavor llene todos los campos!");
    }
    /* Validate EMAIL */
    else if (isEmail(email) == false)
    {
        warning.html("Inserte un email valido!");
        email.css('border', '2px solid red');
        stmt_send = false;
    }
    /* Validate phone */
    else if (phone.val() <= 8 || num !== "3")
    {
        warning.html("Inserte un número valido!");
        phone.css('border', '2px solid red');
        stmt_send = false;
    }
    else
    {
        $.ajax({
            type: "POST",
            url: path,
            data: data,
            success: function(){
                console.log(data);
                alert("Nice");
                warning.html("Registro exitoso!");
                warning.css('color', 'green');
                setTimeout(redirect,3000);
            },
            error: function(){
                alert("Error");
            }
        });
    }
});
