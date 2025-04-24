<?php
require '../commons/db.php';
$id = $_GET['id'];
$stmt = $db->prepare("DELETE FROM task.category WHERE id = :id");
$stmt->execute(["id" => $id]);
header("Location: index.php");
?>