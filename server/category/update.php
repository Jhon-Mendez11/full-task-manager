<?php
// Mostrar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../commons/db.php';
header('Content-Type: application/json');

// Verificar método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'error' => 'Método no permitido']);
    exit;
}

// Obtener datos del POST
$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;

// Validar datos
if ($id <= 0 || empty($name) || $user_id <= 0) {
    echo json_encode(['status' => 'error', 'error' => 'Datos inválidos']);
    exit;
}

// Intentar actualizar en la base de datos
try {
    $stmt = $db->prepare("UPDATE task.category SET name = :name, user_id = :user_id WHERE id = :id");
    $stmt->execute([
        ':name' => $name,
        ':user_id' => $user_id,
        ':id' => $id
    ]);
    echo json_encode(['status' => 'ok']);
    exit;
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'error' => $e->getMessage()]);
}
?>