<?php
  //Hace el intento de conexion y oculta los errores
    $down = $_POST["down"];
  if (isset($down)) 
  {
    // echo "$down  Si cargo esa mondá!";
  }
  else
  {
    // echo "No cargo esa mondá!";

  }
  error_reporting(0);
  $connection = file_get_contents('https://www.eltiempo.com/rss/colombia.xml');
  //Si hay conexion descarga el archivo
  if ($connection)
  {
    $url = 'https://www.eltiempo.com/rss/colombia.xml';
    $source = file_get_contents($url);
    $down = file_put_contents('./colombia.xml', $source);
  } 
?>