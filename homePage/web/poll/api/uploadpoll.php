<?php
    // Pruebas
    // $mac = "20:54:fa:19:bf:75";
    // $termSN = "9303MZH20180525004";

    $comentarios = $_POST['comentarios'];
    $question = "¿Que tan seguido viaja?";
    $answer = $_POST['answer'];
    $name_poll = "frecuencia";
    $mac = $_POST['userMac'];
    $termSN = $_POST['userSN'];
    $user_poll_stat = $_POST['userPollStat'];

    if ($answer == "")
    {
        echo "Por favor, elija una opción.";
    } 
    else
    {
        try
        {
            $data = array(
                'question'  => $question,
                'answer'  => $answer,
                'mac' => $mac,
                'name_poll' => $name_poll,
                'termSN' => $termSN,
                'comentarios' => $comentarios
            );

            $data = http_build_query($data);
            $data = urlencode($data);
            
            if(@$fichero = file_get_contents("http://52.202.142.36/buswifi/encuesta.php?dataString={$data}"))
            {
                setcookie("userStat", "1");
            }
            else
            {
                setcookie("userStat", "1");
                $data = array(
                    'question'  => $question,
                    'sep'	 => '|',
                    'answer'  => $answer,
                    'sep1'	 => '|',
                    'mac' => $mac,
                    'sep2'	 => '|',
                    'name_poll' => $name_poll,
                    'sep3'	 => '|',
                    'termSN' => $termSN,
                    'sep4'	 => '|',
                    'comentarios' => $comentarios
                );
                
                if ($file = fopen("data_poll_off.txt", "a"))
                {
                    echo "File success"; 
                    //vamos añadiendo el contenido
                    $salto=''. PHP_EOL ;
                    foreach( $data as $linea ) 
                    {
                        fwrite( $file, $linea );
                    }                                  
                    fclose($file);
                    throw new Exception('success');
                }
            }
        } //End try
        catch(Exception $e)
        {
             echo $e->getMessage();
        } //End catch
    }
?>