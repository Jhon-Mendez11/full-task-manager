<?php
$host = 'localhost';
$port = '5432';
$user = 'postgres';
$pass = '2000';
$db_name = 'task_tool';

try {
    $db = new PDO(
        "pgsql:host=$host;port=$port;dbname=$db_name",
        username: $user,
        password: $pass
    );
    $db->setAttribute(attribute: PDO::ATTR_ERRMODE, value: PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Error en la conexión' . $e->getMessage();
    exit();
}
?>