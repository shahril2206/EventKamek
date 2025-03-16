<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendor Login</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <a href="index.php">Back</a>
    <h2>Vendor Login</h2>
    <form action="/vendor-dashboard" method="POST">
        <label for="email">Email:</label><br>
        <input type="text" id="email" name="email" required><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br>
        <p>Not registered? <a href="vendor-register.php">Register here</a></p>
        <button type="submit">Login</button>
    </form>
</body>
</html>
