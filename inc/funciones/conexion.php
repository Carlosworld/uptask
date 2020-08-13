<?php
$conn = new mysqli('localhost','root','root','uptask');

// echo "<pre>";
//   var_dump($conn->ping);
// echo "<pre>";

if($conn->connect_error){
  echo $conn->connect_error;
}
$conn->set_charset('utf8')

 ?>
