<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="css/login.css">
</head>

<body>
    <div class="login-container">
        <h2>Inicio de Sesión</h2>
        <form action="server/user/auth.php" method="POST">
            <label>
                <span>Correo electrónico:</span>
                <input type="email" name="email" required>
            </label>
            <label>
                <span>Contraseña:</span>
                <input type="password" name="password" required>
            </label>
            <button type="submit">Entrar</button>
        </form>
        <?php if (isset($_GET['error'])): ?>
            <p class="error">Credenciales incorrectas</p>
        <?php endif; ?>
    </div>
</body>

</html>