<?php
require '../commons/db.php';

// Obligatorio para que el navegador entienda que devolvemos JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['user_id'])) {
        try {
            $user_id = $_GET['user_id'];

            $q = "SELECT * FROM task.task WHERE user_id = :usr_id";
            $stmt = $db->prepare($q);
            $stmt->execute([
                "usr_id" => $user_id
            ]);
            $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($tasks); // ✅ Respuesta válida

        } catch (PDOException $e) {
            // ⛔ Aquí estaba el problema: antes devolvías texto plano
            echo json_encode(["error" => "Error en la conexión: " . $e->getMessage()]);
            exit();
        }
    } else {
        echo json_encode(["error" => "Falta el parámetro user_id"]);
    }
} else {
    echo json_encode(["error" => "Método no permitido"]);
}
?>