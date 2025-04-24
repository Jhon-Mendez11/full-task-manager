<?php
require '../commons/db.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Validamos que se haya recibido user_id
    if (!isset($_GET['user_id']) || !is_numeric($_GET['user_id'])) {
        echo json_encode(["status" => "error", "error" => "ID de usuario inválido"]);
        exit;
    }

    $user_id = (int) $_GET['user_id']; // Convertir a entero

    try {
        $stmt = $db->prepare("SELECT * FROM task.category WHERE user_id = :user_id");
        $stmt->execute(["user_id" => $user_id]);
        $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status" => "ok", "data" => $categorias]);
    } catch (PDOException $e) {
        echo json_encode([
            "status" => "error",
            "error" => "Error al obtener categorías: " . $e->getMessage()
        ]);
    }
}
?>