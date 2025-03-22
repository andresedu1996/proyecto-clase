<?php
include 'db.php';

header('Content-Type: application/json');

if (!isset($_GET['tienda'])) {
    die(json_encode(["error" => "Falta el parámetro 'tienda'"]));
}

$tienda_nombre = $conn->real_escape_string($_GET['tienda']);

// Buscar el ID de la tienda por nombre
$sqlTienda = "SELECT ID FROM tiendas WHERE nombre = '$tienda_nombre'";
$resultadoTienda = $conn->query($sqlTienda);

if ($resultadoTienda->num_rows === 0) {
    die(json_encode(["error" => "Tienda '$tienda_nombre' no encontrada"]));
}

$filaTienda = $resultadoTienda->fetch_assoc();
$tienda_id = (int) $filaTienda['ID'];

// Buscar productos por tienda_id
$sqlProductos = "SELECT * FROM productos WHERE tienda_id = $tienda_id";
$resultado = $conn->query($sqlProductos);

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

if (empty($productos)) {
    die(json_encode(["error" => "No se encontraron productos para '$tienda_nombre'"]));
}

echo json_encode($productos);
$conn->close();
?>
