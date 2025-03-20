<?php
require "../vendor/autoload.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "MI_SECRET_KEY";
$headers = getallheaders();

if (!isset($headers["Authorization"])) {
    http_response_code(401);
    echo json_encode(["error" => "Token no encontrado"]);
    exit();
}

try {
    $token = str_replace("Bearer ", "", $headers["Authorization"]);
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));

    echo json_encode(["message" => "Acceso permitido", "role" => $decoded->role]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Token inválido"]);
}
?>
