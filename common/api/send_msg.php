<?php
	/*
	 * 发送SOCKET消息 Enviar un mensaje de SOCKET
	 * 无返回消息 No hay mensaje de retorno
	 */
	function sendMsg($reqMsg, $server_side_sock) {
		try {
			// create unix udp socket
			$socket = socket_create(AF_UNIX, SOCK_DGRAM, 0);
			if (!$socket)
			{
				return -1;
			}


			// use socket to send data
			if (!socket_set_nonblock($socket))
			{
				socket_close($socket);
				return -3;
			}

			// 对端端口 Puerto de pares
			//$server_side_sock = "/tmp/jifei.sock";
			//$server_side_sock = "/tmp/statistical.sock";

			$len = strlen($reqMsg);

			$bytes_sent = socket_sendto($socket, $reqMsg, $len, 0, $server_side_sock);
			if ($bytes_sent == -1)
			{
				socket_close($socket);
				return -4;
			}
			else if ($bytes_sent != $len)
			{
				socket_close($socket);
				return -5;
			}
			// close socket and delete own .sock file
			socket_close($socket);

			//socket 消息日志
			file_put_contents('/tmp/socket_msg', $reqMsg."|".date("Ymdhis")."\n",FILE_APPEND + LOCK_EX);

		} catch(Exception $e) {
			$errorMsg = 'Error on line '.$e->getLine().' in '.$e->getFile().': '.$e->getMessage();
			error_log($errorMsg,0);
		}
	}

	/*
	 * 发送SOCKET消息
	 * 有返回消息
	 */
	function sendMsgWithRep($reqMsg, $server_side_sock) {
		try {
			// create unix udp socket
			$socket = socket_create(AF_UNIX, SOCK_DGRAM, 0);
			if (!$socket)
			{
				//error_log( "Unable to create AF_UNIX socket."."<br>", 0 );
				//throw new Exception("Unable to create AF_UNIX socket.");
				return -1;
			}

			/*本地侦听端口 Puerto de escucha local*/
			$client_side_sock = "/tmp/statistical_ack.sock";
			if (!socket_bind($socket, $client_side_sock))
			{
				//error_log( "Unable to bind to $client_side_sock"."<br>", 0 );
				//throw new Exception("Unable to bind to $client_side_sock");
				return -2;
			}

			// use socket to send data
			if (!socket_set_nonblock($socket))
			{
				//error_log( "Unable to set nonblocking mode for $socket"."<br>", 0 );
				//throw new Exception("Unable to set nonblocking mode for $socket");
				socket_close($socket);
				unlink($client_side_sock);
				return -3;
			}

			// 对端端口
			//$server_side_sock = "/tmp/statistical.sock";

			$len = strlen($reqMsg);

			// at this point 'server' process must be running and bound to receive from serv.sock
			$bytes_sent = socket_sendto($socket, $reqMsg, $len, 0, $server_side_sock);
			if ($bytes_sent == -1)
			{
				//error_log( "An error occured while sending to the $socket"."<br>", 0 );
				//throw new Exception("An error occured while sending to the $socket");
				socket_close($socket);
				unlink($client_side_sock);
				return -4;
			}
			else if ($bytes_sent != $len)
			{
				//error_log( $bytes_sent." bytes have been sent instead of the". $len . " bytes expected"."<br>", 0 );
				//throw new Exception($bytes_sent." bytes have been sent instead of the". $len . " bytes expected");
				socket_close($socket);
				unlink($client_side_sock);
				return -5;
			}

			//sleep(3);

			$re = "";
			$count = 0;
			while(1)
			{
				usleep(10);
				$bytes_sent = @socket_recvfrom($socket, $re, 256, 0, $server_side_sock);
				if($bytes_sent > 0)
				{
					break;
				}
				$count++;
				if($count > 500) //超时5秒
				{
					break;
				}
			}

			// close socket and delete own .sock file
			socket_close($socket);
			unlink($client_side_sock);
			//socket 消息日志
			file_put_contents('/tmp/socket_msg', $reqMsg."|".date("Ymdhis")."\n",FILE_APPEND + LOCK_EX);

			return $re;
			//return 0;

		} catch(Exception $e) {
			$errorMsg = 'Error on line '.$e->getLine().' in '.$e->getFile().': '.$e->getMessage();
			error_log($errorMsg,0);
		}
	}

	/**
	 *	认证socket
	 *
	 */
	function auth_socket($reqMsg){
		sendMsg($reqMsg, "/tmp/jifei.sock");
		//return json_encode( array( 'code' => 'ok'));
		return  array( 'code' => 'ok');
	}

	/**
	 *	资源上报socket
	 *
	 */
	function access_socket($reqMsg){
		sendMsg($reqMsg, "/tmp/statistical.sock");
		return json_encode( array( 'code' => 'ok'));
	}
	//测试
	//access_socket('20');
	//sendMsg("20","/tmp/statistical.sock");
?>
