<?php
	if (!isset($_SESSION["domain"]) || !isset($_SESSION["docRoot"])) {
		header("Location: /index.php");
	}
?>