<?php
//take the photo and make sure it executes with the python program

//header('Access-Control-Allow-Origin: *');
//header("Content-type: image/jpeg");
date_default_timezone_set("America/New_York");
if (isset($_POST['submit'])) {
	$file = $_FILES['swPhoto'];
	$fileName = $_FILES['swPhoto']['name'];
	$fileTmpName = $_FILES['swPhoto']['tmp_name'];
	$fileSize = $_FILES['swPhoto']['size'];
	$fileError = $_FILES['swPhoto']['error'];
	$fileType = $_FILES['swPhoto']['type'];

	//print_r($fileTmpName);

	$fileExt = explode('.',$fileName);
	$fileActualExt = strtolower(end($fileExt));

	$allowed = array('jpg', 'jpeg');

	if (in_array($fileActualExt, $allowed)) {
		if ($fileError === 0) {
			$fileNameNew = uniqid('', true).".".$fileActualExt;
			//$fileDestination = './upload/'.$fileNameNew;
			$fileDestination = 'upload/'.$fileNameNew;
			//print_r($fileDestination);
			//file_put_contents($fileDestination, $fileTmpName); this doesn't work
			move_uploaded_file($fileTmpName, $fileDestination);
			echo "Successful upload.";

			//now that we have a successful upload to the folder
			//we can use this photo with our label_image.py

			//test print first
			echo '<br><img src= ' .$fileDestination.'><br>';

			//run the python
			$output = shell_exec('cd ml; python3 label_image.py ../upload/' . $fileNameNew);
			$resultArr = explode("\n", $output);
			echo json_encode($resultArr);
			//shell_exec('rm -r ' . $fileDestination);
		}
		else "There was an error uploading your file.";
	}
	else {
		echo "You cannot upload files of this type.";
	}
	//print_r($file);

	// $upload_dir = "upload/";
	// $img = $_POST['swPhoto'];
	// $img = str_replace('data:image/jpeg;base64,', '', $img);
	// $img = str_replace(' ', '+', $img);
	// $data = base64_decode($img);
	// $name = mktime() . ".jpeg";
	// $file = $upload_dir . $name;
	// echo $file;
	// file_put_contents($file, $data);
	// $success = file_put_contents($file, $data);
	// print $success ? $file : 'Unable to save the file.';
	// //echo '<img src= ' .$file.'/>';
	//
	// $output = shell_exec('cd ml; python3 label_image.py ../upload/' . $name);
	// $resultArr = explode("\n", $output);
	// echo json_encode($resultArr);
	//shell_exec('rm -r upload/' . $name);
	//echo json_encode("test");
}

//header('Content-type: image/jpeg');

// $target_path = "upload";
// $fname = $_FILES["swPhoto"]["name"];
// $target = $target_path. '/' . $fname;
//
// move_uploaded_file($_FILES["swPhoto"]["tmp_name"], $target);
//
// echo "<p> Here's your image! $fname </p> </br>";
// echo "<img src=$target>";

// $target_dir = "upload/";
// $target_file = $target_dir . basename($_FILES["swPhoto"]["name"]);
// $imageData = file_get_contents($_FILES['swPhoto']['tmp_name']);
//
// $uploadOk = 1;
// $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// // Check if image file is a actual image or fake image
// if(isset($_POST["submit"])) {
//    $check = getimagesize($_FILES["swPhoto"]["tmp_name"]);
//    if($check !== false) {
//        echo "File is an image - " . $check["mime"] . ".<br>";
// 			 //echo '<img src=' . $_GET['swPhoto'] . '>';
// 			 //echo '<img src=upload/" ' . $_FILES["swPhoto"]["tmp_name"]. '>';
//
// 			 // display in view
// 			 echo sprintf('<img src="data:image/png;base64,%s" />', base64_encode($imageData));
//        $uploadOk = 1;
//    } else {
//        echo "File is not an image.";
//        $uploadOk = 0;
//    }
// }





?>
