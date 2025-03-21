<?php
session_start();

// Suponiendo que guardas el rol del usuario en la sesión
$response = array();

if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
    $response['loggedin'] = true;
    $response['rol'] = $_SESSION['role']; // Admin o usuario
} else {
    $response['loggedin'] = false;
}

echo json_encode($response);
?>
