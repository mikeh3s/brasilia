<?php
	//获取mac地址
	function getMac($ip) {

        $arp = "arp";

        $mac = shell_exec("$arp -n ".$ip);

        preg_match('/..:..:..:..:..:../',$mac , $matches);

        @$mac = $matches[0];
		// modify by mfhu,add note	
		//echo $ip.$mac;

        if (!isset($mac)) {

            return;

        }else {

            return $mac;

        }

	}
?>