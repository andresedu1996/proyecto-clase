<?php
include 'db.php';

header('Content-Type: application/json');

$tienda = isset($_GET['nombre']) ? $conn->real_escape_string($_GET['nombre']) : '';

$sql = "SELECT * FROM productos WHERE tienda = '$tienda'";
$resultado = $conn->query($sql);

$productos = [];

while ($fila = $resultado->fetch_assoc()) {
    $productos[] = [
        "nombre" => $fila["nombre"],
        "descripcion" => $fila["descripcion"],
        "precio" => $fila["precio"],
        "unidades" => $fila["unidades"],
        "imagen" => $fila["imagen"]
    ];
}

echo json_encode($productos);

$conn->close();
?>
