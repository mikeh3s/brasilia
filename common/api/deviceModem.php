<?php
/**
 * Created by PhpStorm.
 * User: qhao
 * Date: 2016/3/15
 * Time: 10:23
 */

function getModem() {
    //$modem = shell_exec("route -n | grep modem"); //3G卡
    $modem = shell_exec("route -n | grep eth0"); //有线
    return isset($modem);
}

$modem = getModem();
echo $modem;
exit();

?>