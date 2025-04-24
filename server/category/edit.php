<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $id = $_GET['id'];
    $stmt = $db->prepare("SELECT * FROM task.category WHERE id = :id");
    $stmt->execute(["id" => $id]);
    $cat = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $stmt = $db->prepare("UPDATE task.category SET name = :name WHERE id = :id");
    $stmt->execute(["name" => $_POST["name"], "id" => $_POST["id"]]);
    header("Location: index.php");
}
?>

<?php if ($_SERVER['REQUEST_METHOD'] == 'GET'): ?>
    <form method="POST">
        <input type="hidden" name="id" value="<?= $cat['id'] ?>">
        <input type="text" name="name" value="<?= htmlspecialchars($cat['name']) ?>">
        <button type="submit">Guardar</button>
    </form>
<?php endif; ?>