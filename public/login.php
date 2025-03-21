<?php
session_start();

// Configuración de conexión a la base de datos
$host = "localhost";
$dbname = "shopzone";
$user = "root";  // Cambia según tu configuración
$password = "";  // Cambia según tu configuración

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Verificar si se recibieron las credenciales por POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Verificar las credenciales en la base de datos
    $sql = "SELECT * FROM usuarios WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['email' => $email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && password_verify($password, $usuario['password'])) {
        // Almacenar el rol del usuario en la sesión
        $_SESSION['user_role'] = $usuario['tipo']; // 'admin' o 'cliente'
        $_SESSION['user_id'] = $usuario['id']; // También puedes guardar el ID de usuario si lo necesitas

        // Responder con éxito
        echo json_encode(['status' => 'success', 'role' => $usuario['tipo']]);
    } else {
        // En caso de error de autenticación
        echo json_encode(['error' => 'Correo o contraseña incorrectos']);
    }
}
?>
