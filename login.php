<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ERROR | E_PARSE);
include("config.php");
include("common.php");
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $myusername = $_POST["username"];
    $mypassword = $_POST["password"];
    log_message("login attempted with user :" . $myusername . " and password : " . $mypassword);
    $sql = "SELECT BrokerId,FirstName FROM broker WHERE userid = ? and password = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("ss", $myusername, $mypassword);
    $brokerid = 0;
    $username = "";
    $stmt->execute();
    $stmt->bind_result($brokerid, $username);
    $stmt->store_result();
    //if ($stmt->num_rows == 1) {
        if ($stmt->fetch()) {
            session_start();
            $_SESSION['login_user'] = $myusername;
            log_message("session login user : username from db".$username);
            log_message("brokerid :" . $brokerid);
            $_SESSION['brokerid'] = $brokerid;
            log_message('session broker');
            log_message("login successfull. saving brokerid into session : " . $_SESSION['brokerid']);
            $statusCode = 200;
            $statusMessage = "OK";
            $result = array('result' => "success",
            'brokerid' => $brokerid,
            'username' => $username);
            log_message("broker id:" . $_SESSION['brokerid']);
            $response = json_encode($result);
        //}
    } else {
        $statusCode = 200;
        $statusMessage = "OK";
        $result = array('result' => "fail");
        $response = json_encode($result);
    }
    header("HTTP/1.1" . " " . $statusCode . " " . $statusMessage);
    header("Content-Type:" . 'application/json');
    $stmt->free_result();
    $stmt->close();
    $db->close();
    echo $response;
}
?>