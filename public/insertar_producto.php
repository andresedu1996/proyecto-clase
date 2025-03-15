<?php
include 'db.php';

$nombre = "Laptop Gamer";
$descripcion = "Laptop con procesador i7 y tarjeta gráfica RTX 4060";
$precio = 1200.99;
$unidades = 10;
$imagen = "laptop.jpg";

$sql = "INSERT INTO productos (nombre, descripcion, precio, unidades, imagen) 
        VALUES ('$nombre', '$descripcion', '$precio', '$unidades', '$imagen')";

if ($conn->query($sql) === TRUE) {
    echo "Producto agregado correctamente.";
} else {
    echo "Error al insertar: " . $conn->error;
}

$conn->close();
?>
