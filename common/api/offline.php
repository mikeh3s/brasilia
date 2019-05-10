<?php
	session_start();
	require_once("get_mac.php");

	$ip = $_SERVER['REMOTE_ADDR'];
	$mac = getMac($ip);
	$type = 1;
	$reqMsg = "0001MAC=".$mac."\t"; //下线

	$result = offline_socket($reqMsg);
	//shell_exec("短信认证 shell 命令");
	//缓存鉴权状态（查询路由器列表和短信认证的时候发送）
	//Estado de autenticación de caché (enviado al consultar la lista de enrutadores y la autenticación de SMS)
	if($result["code"] == "ok"){
		echo json_encode($result);
	}else{
		echo json_encode( array( 'code' => '-1'));
	}

	/**
	 *	下线socket
	 *
	 */
	function offline_socket($reqMsg){
		sendMsgWithResult($reqMsg, "/tmp/jifei.sock");
		//return json_encode( array( 'code' => 'ok'));
		return  array( 'code' => 'ok');
	}


	/*
	 * 下线
	 * 发送SOCKET消息
	 * 有返回消息
	 */
	function sendMsgWithResult($reqMsg, $server_side_sock) {
		try {
			// create unix udp socket
			$socket = socket_create(AF_UNIX, SOCK_DGRAM, 0);
			if (!$socket) {
				//error_log( "Unable to create AF_UNIX socket."."<br>", 0 );
				//throw new Exception("Unable to create AF_UNIX socket.");
				return -1;
			}

			/*本地侦听端口*/
			// Puerto de escucha local
			$client_side_sock = "/tmp/hot.sock";
			if (!socket_bind($socket, $client_side_sock)) {
				//error_log( "Unable to bind to $client_side_sock"."<br>", 0 );
				//throw new Exception("Unable to bind to $client_side_sock");
				return -2;
			}

			// use socket to send data
			if (!socket_set_nonblock($socket)) {
				//error_log( "Unable to set nonblocking mode for $socket"."<br>", 0 );
				//throw new Exception("Unable to set nonblocking mode for $socket");
				socket_close($socket);
				unlink($client_side_sock);
				return -3;
			}

			$len = strlen($reqMsg);

			// at this point 'server' process must be running and bound to receive from serv.sock
			$bytes_sent = socket_sendto($socket, $reqMsg, $len, 0, $server_side_sock);
			if ($bytes_sent == -1) {
				//error_log( "An error occured while sending to the $socket"."<br>", 0 );
				//throw new Exception("An error occured while sending to the $socket");
				socket_close($socket);
				unlink($client_side_sock);
				return -4;
			} else if ($bytes_sent != $len) {
				//error_log( $bytes_sent." bytes have been sent instead of the". $len . " bytes expected"."<br>", 0 );
				//throw new Exception($bytes_sent." bytes have been sent instead of the". $len . " bytes expected");
				socket_close($socket);
				unlink($client_side_sock);
				return -5;
			}

			//sleep(3);
			$read   = array($socket);
			$write  = NULL;
			$except = NULL;
			$re = "";
			if (socket_select($read, $write, $except, 5) > 0) {
				$bytes_sent = @socket_recvfrom($socket, $re, 256, 0, $server_side_sock);
			}
			echo $re;
			// close socket and delete own .sock file
			socket_close($socket);
			unlink($client_side_sock);
			//socket 消息日志
			//file_put_contents('/tmp/socket_msg', $reqMsg, FILE_APPEND + LOCK_EX);

			return $re;

		} catch (Exception $e) {
			$errorMsg = 'Error on line ' . $e->getLine() . ' in ' . $e->getFile() . ': ' . $e->getMessage();
			error_log($errorMsg, 0);
		}
	}

?>
