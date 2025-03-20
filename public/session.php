<?php
session_start();
$response = ["loggedin" => false];

if (isset($_SESSION["id"])) {
    $response["loggedin"] = true;
    $response["nombre"] = $_SESSION["nombre"];
    $response["rol"] = $_SESSION["rol"];
}

header("Content-Type: application/json");
echo json_encode($response);
?>