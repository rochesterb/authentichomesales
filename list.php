<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ERROR | E_PARSE);
include("config.php");
//include ("session.php");
include ("common.php");

try {
    log_message("list: ");
    //$brokerid = $_SESSION['brokerid'];
    $brokerid=getBrokerIdFromSession();
    log_message("inside list ".$brokerid);
    $method = $_SERVER['REQUEST_METHOD'];
    $url = $_SERVER['REQUEST_URI'];
    $tokens = explode('/', $url);
    $id = $tokens[sizeof($tokens) - 1];
    $sql = "SELECT * from " . $id . " where brokerid=" . $brokerid;
    log_message("list: " . $sql);
    $result = $db->query($sql);
    $rows = array();
    while ($r = $result->fetch_assoc()) {
        $rows[] = $r;
    }
    $statusCode = 200;
    $statusMessage = "OK";
    $requestContentType = $_SERVER['HTTP_ACCEPT'];
    header("HTTP/1.1" . " " . $statusCode . " " . $statusMessage);
    header("Content-Type:" . 'application/json');
    $response = json_encode($rows);
    log_message("list response for table " . $id . " response " . $response);
    echo $response;
} catch (Exception $e) {
    print_r($e);
    $statusCode = 500;
    $statusMessage = "OK";
    $requestContentType = $_SERVER['HTTP_ACCEPT'];
    header("HTTP/1.1" . " " . $statusCode . " " . $statusMessage);
    header("Content-Type:" . 'application/json');
    $result1 = array('result' => "fail");
    $response = json_encode($result1);
    echo $response;
}
?>