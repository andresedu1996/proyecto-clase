<?php
header("Content-Type: application/json");

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "shopzone");

if ($conexion->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conexion->connect_error]));
}

// Obtener los datos del producto enviados en el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    die(json_encode(["error" => "No se recibieron datos válidos"]));
}

$tienda_id = $data['tienda_id'];
$nombre = $data['nombre'];
$descripcion = $data['descripcion'];
$precio = $data['precio'];
$unidades = $data['unidades'];
$imagen = $data['imagen'];

// Insertar el producto en la base de datos
$sql = "INSERT INTO productos (tienda_id, nombre, descripcion, precio, unidades, imagen)
        VALUES ('$tienda_id', '$nombre', '$descripcion', '$precio', '$unidades', '$imagen')";

if ($conexion->query($sql) === TRUE) {
    echo json_encode(["mensaje" => "Producto agregado con éxito"]);
} else {
    echo json_encode(["error" => "Error al agregar producto: " . $conexion->error]);
}

$conexion->close();
?>
