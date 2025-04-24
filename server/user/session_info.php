<?php
session_start();

// Especificar que la respuesta será JSON
header('Content-Type: application/json');

// Simulación para pruebas — puedes quitar esta línea si ya estás haciendo login real
$_SESSION['user_id'] = 3;

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "user_id" => $_SESSION['user_id'],
        "user_name" => $_SESSION['user_name']
    ]);
} else {
    echo json_encode([
        "error" => "Usuario no autenticado"
    ]);
}

?>