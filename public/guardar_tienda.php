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

/// Extraer los datos del formulario
$nombre = $datos["nombre"];
$direccion = $datos["direccion"];
$descripcion = isset($datos["descripcion"]) ? $datos["descripcion"] : "";

// Obtener el ID del admin desde la sesión
$admin_id = $_SESSION['admin_id'];  // Esto debe ser el ID del admin autenticado

// Preparar la consulta SQL, ahora incluyendo el campo admin_id
$sql = "INSERT INTO tiendas (nombre, direccion, descripcion, admin_id) VALUES (?, ?, ?, ?)";

// Usar prepared statements con PDO
try {
    $stmt = $conn->prepare($sql);
    $stmt->execute([$nombre, $direccion, $descripcion, $admin_id]);

    echo json_encode(["exito" => true, "mensaje" => "Tienda registrada con éxito"]);
} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error al registrar la tienda: " . $e->getMessage()]);
}

session_start();
if (!isset($_SESSION['admin_id'])) {
    // Si no está autenticado, redirigir o devolver un error
    echo json_encode(["exito" => false, "mensaje" => "Debes estar autenticado para registrar una tienda."]);
    exit();
}

// Obtener el ID del administrador desde la sesión
$admin_id = $_SESSION['admin_id'];
?>