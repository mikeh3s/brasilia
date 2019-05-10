<?php

    $host = "ec2-52-54-163-181.compute-1.amazonaws.com";
    $user = "freewifi";
    $pass = "Sql~!@admin3$%";
    $namedb = "freewifi";
    $status = NULL;


    $conn = mysqli_connect($host,$user,$pass,$namedb);
    if(!$conn)
    {
      $status = 'error';
      echo $status;
    }
      else
      {
        echo 'Succesfull connection';
      }
      $value = "";
      $HTML = array(
          '<legend>¿Que tan seguido viaja a otros municipios del país?</legend>',
          );

      foreach($HTML as $element){
          $value = strip_tags($element);;
          echo $value . "<br />";
      }
    // $mac = $_SESSION["mac"];
    // $termSN = $_SESSION["termSn"];
    // $answer = $_POST['often'];
    $mac = "7c:50:49:38:15:aa";
    $name_poll = "frecuencia";
    $termSN = "9303MZH20180525010";
    $answer = $_POST['often'];
    $sql = "INSERT INTO poll (mac,name_poll,question,answer,sn) VALUES ('$mac','$name_poll','$value','$answer','$termSN')";
    $result = mysqli_query($conn,$sql);

    if(!$result)
    {
      echo 'Error';

    }
      else
      {
        echo 'Exito';
      }

?>
