<?php
require "db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_BCRYPT);
    $tipo = $_POST["tipo"]; // 'admin' o 'cliente'

    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, tipo) VALUES (?, ?, ?, ?)");
    
    if ($stmt->execute([$nombre, $email, $password, $tipo])) {
        echo "<script>alert('Registro exitoso'); window.location='login.html';</script>";
    } else {
        echo "<script>alert('Error en el registro');</script>";
    }
}
?>