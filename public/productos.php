<?php
include 'db.php';

header('Content-Type: application/json');

// Depuración: Ver si recibe la variable GET
if (!isset($_GET['nombre'])) {
    die(json_encode(["error" => "Falta el parámetro 'nombre'"]));
}

$tienda = $conn->real_escape_string($_GET['nombre']);
$sql = "SELECT * FROM productos WHERE tienda = '$tienda'";
$resultado = $conn->query($sql);

$productos = [];

while ($fila = $resultado->fetch_assoc()) {
    $productos[] = [
        "ID" => $fila["id"],
        "nombre" => $fila["nombre"],
        "descripcion" => $fila["descripcion"],
        "precio" => $fila["precio"],
        "unidades" => $fila["unidades"],
        "imagen" => $fila["imagen"]
    ];
}

// Si no hay productos, devolver error
if (empty($productos)) {
    die(json_encode(["error" => "No se encontraron productos para '$tienda'"]));
}

echo json_encode($productos);
$conn->close();
?>