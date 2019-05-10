<?php

  $cons_usuario="freewifi";
	$cons_contra="Sql~!@admin3$%";
	$cons_base_datos="freewifi";
	$cons_equipo="ec2-52-54-163-181.compute-1.amazonaws.com";
	$status = NULL;
try {
  // $obj_conexion = mysqli_connect($cons_equipo,$cons_usuario,$cons_contra,$cons_base_datos);

  $connection = file_get_contents("subir.txt");

  if(!$connection){
    header("Location: full.html");
  } else{

      $lineas = file('subir.txt');
      echo $lineas;
      // Ejecuta el codigo segun el numero de lineas o registros existente
      foreach ($lineas as $linea_num => $linea)
      {
        $datos = explode("|",$linea);

        $serie_Dispo=trim($datos[0]);
        $Fecha_ingre=trim($datos[1]);
        $Nombre=trim($datos[2]);
        $Correo=trim($datos[3]);
        $telefono=trim($datos[4]);
        $Rango_edad=trim($datos[5]);
        $genero=trim($datos[6]);
        $Mac=trim($datos[7]);
        $Type=trim($datos[8]);
        $Model=trim($datos[9]);

        $data = array(
          'fname'  => $Nombre,
          'email'  => $Correo,
          'phone'  => $telefono,
          'edad'   => $Rango_edad,
          'genero' => $genero,
          'serie_Dispo' => $serie_Dispo,
          'Fecha_ingre'	 => $Fecha_ingre,
          'mac' => $Mac,
          'pmac' => $Type,
          'model'	=> $Model
        );

        $data = http_build_query($data);
        $data = urlencode($data);

        @$fichero = file_get_contents("http://52.202.142.36/buswifi/proccess.php?dataString={$data}");
        // $sql = "INSERT INTO login (serie_Dispo,Fecha_ingre,Nombre,Correo,Telefono,Rango_edad,Genero,Mac,Modelo) ";
        // $sql.= "VALUES ('".$serie_Dispo."', '".$Fecha_ingre."', '".$Nombre."', '".$Correo."', '".$telefono."', '".$Rango_edad."', '".$genero."', '".$Mac."', '".$Modelo."')";
        // //echo $sql;
        // $result = mysqli_query($obj_conexion, $sql);
      }
      
          unlink('subir.txt');
  }
  throw new Exception('success');

} catch (\Exception $e) {
 echo $e->getMessage();
}


?>
