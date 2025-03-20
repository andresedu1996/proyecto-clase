<?php
header("Content-Type: application/json");

// Conectar a la base de datos
$conexion = new mysqli("localhost", "root", "", "mi_base_datos");

if ($conexion->connect_error) {
    die(json_encode(["exito" => false, "mensaje" => "Error de conexión: " . $conexion->connect_error]));
}

// Recibir los datos del producto
$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos["tienda_id"]) || !isset($datos["nombre"]) || !isset($datos["precio"]) || !isset($datos["descripcion"]) || !isset($datos["unidades"])) {
    echo json_encode(["exito" => false, "mensaje" => "Datos incompletos"]);
    exit();
}

// Recoger los datos
$tienda_id = (int) $datos["tienda_id"];
$nombre = $conexion->real_escape_string($datos["nombre"]);
$descripcion = $conexion->real_escape_string($datos["descripcion"]);
$precio = (float) $datos["precio"];
$unidades = (int) $datos["unidades"];
$imagen = isset($datos["imagen"]) ? $conexion->real_escape_string($datos["imagen"]) : '';

// Si se subió una imagen
if ($_FILES["imagen"]["name"]) {
    $nombre_imagen = $_FILES["imagen"]["name"];
    $ruta_imagen = "uploads/" . $nombre_imagen;
    move_uploaded_file($_FILES["imagen"]["tmp_name"], $ruta_imagen);
    $imagen = $ruta_imagen;
}

$sql = "INSERT INTO productos (tienda_id, nombre, descripcion, precio, unidades, imagen) VALUES ('$tienda_id', '$nombre', '$descripcion', '$precio', '$unidades', '$imagen')";

if ($conexion->query($sql) === TRUE) {
    echo json_encode(["exito" => true, "mensaje" => "Producto agregado con éxito"]);
} else {
    echo json_encode(["exito" => false, "mensaje" => "Error: " . $conexion->error]);
}

$conexion->close();
?>
