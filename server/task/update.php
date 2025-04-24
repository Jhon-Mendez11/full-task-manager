<?php
require '../commons/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (
        isset($_POST['id'], $_POST['title'], $_POST['description'], $_POST['due_date'], $_POST['category_id'], $_POST['user_id'])
        && trim($_POST['title']) !== ''
    ) {
        try {
            $q = "UPDATE task.task 
                  SET title = :title, 
                      description = :description, 
                      due_date = :due_date, 
                      category_id = :category_id, 
                      user_id = :user_id,
                      completed = :completed
                  WHERE id = :id";

            $stmt = $db->prepare($q);
            $stmt->execute([
                'id' => $_POST['id'],
                'title' => $_POST['title'],
                'description' => $_POST['description'],
                'due_date' => $_POST['due_date'],
                'category_id' => $_POST['category_id'],
                'user_id' => $_POST['user_id'],
                'completed' => isset($_POST['completed']) ? 1 : 0
            ]);

            echo json_encode(['status' => 'ok']);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Faltan datos']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>