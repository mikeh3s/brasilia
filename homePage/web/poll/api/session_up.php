<?php
    	// Máxima duración de sesión activa en aproximadamente 60s
	define( 'MAX_SESSION_TIEMPO', 60 * 1 );

	// Controla cuando se ha creado y cuando tiempo ha recorrido
	if ( isset( $_SESSION[ 'ULTIMA_ACTIVIDAD' ] ) &&
	     ( time() - $_SESSION[ 'ULTIMA_ACTIVIDAD' ] > MAX_SESSION_TIEMPO ) ) {

	    // Si ha pasado el tiempo sobre el limite destruye la session
	    destruir_session();
	}

	$_SESSION[ 'ULTIMA_ACTIVIDAD' ] = time();

	// Función para destruir y resetear los parámetros de sesión
	function destruir_session() {

		$user_session_stat = "0";
		setcookie("sessionStat" ,$user_session_stat);
			header("Location: ../index.html");
	}
	
    $pass_name = $_POST['userName'];
    if ($_COOKIE['userStat'] == "0")
    {
        //Variable para saber si esta logueado el usuario    
            echo "
                <div class='modal-body'>
                    <h2>¡Bienvenido!</h2>
                    <h2>Deseamos saber su opinión</h2>
                    <h3>¿Que tan seguido viaja?</h3>
                    <div class='container-input'>
                        <form method='post' onsubmit='return send();'>
                            <select class='cont-option' name='answer' id='answer'>
                                <option value='' selected='true' disabled='disabled'>Frecuecia de viaje</option>
                                <option value='1'>Muy poco</option>
                                <option value='2'>De vez en cuando</option>
                                <option value='3'>Regularmente</option>
                            </select>
                            <input class='coments' type='text' name='comentarios' id='comentarios' placeholder='Comentarios...'>
                            <input class='send' type='submit' value='Enviar'>
                        </form>     
                        <p id='validate'></p>
                    </div>    
                </div>
            ";    
        }
        else
        {
            // $path = "encuestas/admodal.php";
            echo "<img src='../../advertisement/image/encuestaVerticalAd/encuestaAd1.jpg' alt=''>";
        }
        

?>