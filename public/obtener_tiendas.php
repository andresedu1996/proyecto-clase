<?php
include 'db.php';

header('Content-Type: application/json');

$sql = "SELECT id, nombre FROM tiendas";  // Asegúrate de que esta tabla exista
$resultado = $conn->query($sql);

$tiendas = [];

while ($fila = $resultado->fetch_assoc()) {
    $tiendas[] = [
        "id" => $fila["id"],
        "nombre" => $fila["nombre"]
    ];
}

echo json_encode(["tiendas" => $tiendas]);

$conn->close();
?>
