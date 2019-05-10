<?php
//==加密及解密
/* $privateKey = "1234567812345678";
 $iv = "1234567812345678";*/
 function encrypt($data,$privateKey,$iv) {
  $encrypted = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $privateKey, $data, MCRYPT_MODE_CBC, $iv);
  $data = base64_encode($encrypted);
  return $data;
 }
 
  function decrypt($data,$privateKey,$iv) {
  $encryptedData = base64_decode($data);
  $data = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $privateKey, $encryptedData, MCRYPT_MODE_CBC, $iv);
  return $data;
 }

//使用方法
/*$c = encrypt('13545141274',$privateKey,$iv);
echo $c;
var_dump(decrypt($c,$privateKey,$iv));
*/

?>
