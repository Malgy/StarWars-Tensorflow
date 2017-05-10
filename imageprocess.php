<?php
 	header('Access-Control-Allow-Origin: *');
 	date_default_timezone_set("America/New_York");
	$upload_dir = "upload/";
	$img = $_POST['hidden_data'];
	$img = str_replace('data:image/jpeg;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$name = mktime() . ".jpeg";
	$file = $upload_dir . $name;
	$success = file_put_contents($file, $data);
	// print $success ? $file : 'Unable to save the file.';
	$output = shell_exec('cd ml; python label_image.py ../upload/' . $name);
	$resultArr = explode("\n", $output);
	echo json_encode($resultArr);
	shell_exec('rm -r upload/' .$name);
	// echo json_encode("test");

	
?>