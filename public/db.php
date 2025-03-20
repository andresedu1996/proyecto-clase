<?php
$host = "localhost";
$dbname = "shopzone";
$user = "root";  // Cambia según tu configuración
$password = "";  // Cambia según tu configuración

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Verificar la conexión
if ($conn) {
    echo "Conexión exitosa a la base de datos!";
}
?>
