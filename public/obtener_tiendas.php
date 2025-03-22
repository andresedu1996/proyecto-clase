<?php
// Conexión a la base de datos
$conexion = new mysqli("localhost", "usuario", "contraseña", "nombre_base_datos");

// Verificar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

// Consulta para obtener tiendas
$sql = "SELECT nombre, imagen FROM tiendas"; // Asegúrate de que tu tabla tiene esas columnas
$resultado = $conexion->query($sql);

$tiendas = array();

if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $tiendas[] = $fila;
    }
}

// Enviar respuesta en formato JSON
echo json_encode($tiendas);

$conexion->close();
?>
