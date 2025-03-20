<?php
require "db.php";  // Incluye el archivo de conexión

header("Content-Type: application/json");

// Obtener los datos del formulario
$datos = json_decode(file_get_contents("php://input"), true);

// Registrar los datos recibidos para depurar
error_log("Datos recibidos: " . print_r($datos, true));

// Comprobar si los datos son válidos
if (!isset($datos["nombre"]) || !isset($datos["direccion"])) {
    echo json_encode(["exito" => false, "mensaje" => "Datos incompletos"]);
    exit();
}

// Extraer los datos
$nombre = $datos["nombre"];
$direccion = $datos["direccion"];
$descripcion = isset($datos["descripcion"]) ? $datos["descripcion"] : "";

// Registrar los datos antes de la inserción para verificar que se están extrayendo correctamente
error_log("Datos extraídos: Nombre = $nombre, Dirección = $direccion, Descripción = $descripcion");

// Preparar la consulta SQL
$sql = "INSERT INTO tiendas (nombre, direccion, descripcion) VALUES (?, ?, ?)";

// Registrar la consulta SQL para verificar su formato
error_log("Consulta SQL: " . $sql);

try {
    // Usar prepared statements con PDO
    $stmt = $conn->prepare($sql);
    $stmt->execute([$nombre, $direccion, $descripcion]);

    // Registrar que la tienda fue insertada correctamente
    error_log("Tienda insertada con éxito");

    echo json_encode(["exito" => true, "mensaje" => "Tienda registrada con éxito"]);
} catch (PDOException $e) {
    // Registrar el error en caso de que falle la inserción
    error_log("Error al registrar la tienda: " . $e->getMessage());

    echo json_encode(["exito" => false, "mensaje" => "Error al registrar la tienda: " . $e->getMessage()]);
}
?>
