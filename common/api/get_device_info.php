<?php

 //信号强度 //Fuerza de la señal
 $signal = shell_exec("cat /tmp/modem.info | grep csq | awk -F':' '{print  $2}'");
 //设备3G卡IP
 $ip = shell_exec("cat /tmp/device.info | grep Dialup | awk '{print $3}'");
 //路由表
 $modem = shell_exec("route -n | grep modem | awk '{print $8}'");
 $deviceInfo = array("signal" => $signal,"ip" => $ip,"modem" => $modem);

 echo json_encode($deviceInfo);
 exit();
?>
