<?php
require '../commons/db.php';

$id = $_GET['id'] ?? null;

if ($id) {
    // 1. Obtener el estado actual
    $stmt = $db->prepare("SELECT completed FROM task.task WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $task = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($task) {
        // 2. Alternar el estado
        $newStatus = $task['completed'] ? 0 : 1;

        // 3. Guardar el nuevo estado
        $update = $db->prepare("UPDATE task.task SET completed = :newStatus WHERE id = :id");
        $update->execute(['newStatus' => $newStatus, 'id' => $id]);

        echo json_encode(['status' => 'ok', 'newStatus' => $newStatus]);
    } else {
        echo json_encode(['status' => 'error', 'error' => 'Tarea no encontrada']);
    }
} else {
    echo json_encode(['status' => 'error', 'error' => 'ID no proporcionado']);
}
?>