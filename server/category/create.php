<?php
header('Content-Type: application/json');
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!empty(trim($_POST['name'])) && !empty(trim($_POST['user_id']))) {
        try {
            $q = "INSERT INTO task.category(name, user_id) VALUES (:name, :user_id)";
            $stmt = $db->prepare($q);
            $stmt->execute([
                "name" => $_POST["name"],
                "user_id" => $_POST["user_id"]
            ]);
            echo json_encode(["status" => "ok"]);
        } catch (PDOException $e) {
            echo json_encode([
                "status" => "error",
                "error" => "Error al insertar categoría: " . $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "error" => "Faltan datos."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "error" => "Método no permitido."
    ]);
}
?>