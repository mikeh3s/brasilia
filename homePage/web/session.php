<?php
  session_start();

	// Máxima duración de sesión activa en aproximadamente 60s
	define( 'MAX_SESSION_TIEMPO', 90 * 1 );

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

?>
