<?php
require "init.php";

$name = "SSS";
$username = $_POST["username"];
$message = $_POST["message"];

if(empty($username)){
    $username = "anonymous";
}
if(empty($message)){
    echo $username.'please input your message';
}else{
    $sql_query_insert = "insert into message(username, message) values('$username','$message');";
    if(mysqli_query($con, $sql_query_insert)){
        //echo "Insert Success";
    }else{
        echo "Data insertion error".mysqli_error($con);
    }
}
?>