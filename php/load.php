<?php
    require "init.php";

    $sql_query_message = "SELECT * from message;";
    $result_message = mysqli_query($con, $sql_query_message);
    $response = array();
    if(mysqli_num_rows($result_message)>0){
        while($row = mysqli_fetch_array($result_message)){
            array_push($response, array("username"=>$row["username"], "message"=>$row["message"],"date"=>$row["date"]));
        }
        echo json_encode(array("Message"=>$response));
    }else{
        echo "Getting Message Fail. Please try again";
    }
?>