<?php
header("Content-Type: application/json");

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "shopzone");

if ($conexion->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conexion->connect_error]));
}

// Consultar las tiendas en la base de datos
$sql = "SELECT id, nombre FROM tiendas";
$result = $conexion->query($sql);

if ($result->num_rows > 0) {
    $tiendas = [];
    while ($row = $result->fetch_assoc()) {
        $tiendas[] = $row;
    }
    echo json_encode(["tiendas" => $tiendas]);
} else {
    echo json_encode(["tiendas" => []]);
}

$conexion->close();
?>
