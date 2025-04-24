<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id'])) {
        $id = $_POST['id'];

        try {
            $q = "DELETE FROM task.task WHERE id = :id";
            $stmt = $db->prepare($q);
            $stmt->execute(['id' => $id]);
            echo json_encode(['status' => 'ok']);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Falta ID']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>