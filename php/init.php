<?php
    $mysql_user="aceyee";
    $db_name="yzh_message";
    $mysql_pass="Yzh1028#";
    $server_name="localhost";

    $con = mysqli_connect($server_name, $mysql_user, $mysql_pass, $db_name);
    if(!$con){
        echo "connection error ".mysqli_connect_error();
    }else{
        // echo "<h3>Database connection Success<\h3>";
    }
?>