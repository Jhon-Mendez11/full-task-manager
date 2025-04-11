<?php
require '../commons/db.php';

var_dump(value: $_SERVER['REQUEST_METHOD']);
var_dump(value: $_POST);
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (
        trim($_POST['title']) != '' &&
        trim($_POST['user_id']) != '' &&
        trim($_POST['category_id']) != ''
    ) {
        $q = "INSERT INTO task.task(title, description, due_date, completed, user_id, category_id)";
        $q = $q . "VALUES (:title, :description, :due_date, :completed, :user_id, :category_id)";
        $stmt = $db->prepare($q);
        $stmt->execute([
            "title" => $_POST["title"],
            "description" => $_POST["description"],
            "due_date" => $_POST["due_date"],
            "completed" => $_POST["completed"],
            "user_id" => $_POST["user_id"],
            "category_id" => $_POST["category_id"]
        ]);
        header("Location: /full-task-manager/");
    } else {
        echo 'Nooooooooooo pasa';
    }
}
?>