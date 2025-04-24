<?php
header('Content-Type: application/json'); // Devolvemos JSON siempre
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (
        trim($_POST['title']) !== '' &&
        trim($_POST['user_id']) !== '' &&
        trim($_POST['category_id']) !== ''
    ) {
        try {
            $q = "INSERT INTO task.task(title, description, due_date, completed, user_id, category_id) ";
            $q .= "VALUES (:title, :description, :due_date, :completed, :user_id, :category_id)";
            $stmt = $db->prepare($q);
            $stmt->execute([
                "title" => $_POST["title"],
                "description" => $_POST["description"],
                "due_date" => $_POST["due_date"],
                "completed" => $_POST["completed"],
                "user_id" => $_POST["user_id"],
                "category_id" => $_POST["category_id"]
            ]);

            echo json_encode(["status" => "ok"]);
            exit();
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "error" => $e->getMessage()]);
            exit();
        }
    } else {
        echo json_encode(["status" => "error", "error" => "Campos obligatorios incompletos"]);
        exit();
    }
} else {
    echo json_encode(["status" => "error", "error" => "Método no permitido"]);
    exit();
}
?>