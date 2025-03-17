<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Organizer Login</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <a href="index.php">Back</a>
    <h2>Event Organizer Login</h2>
    <form action="event_organizer-login.php" method="post">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br>

        <p>Not registered? <a href="event_organizer-register.php">Register here</a></p>
        
        <button><a href="events-event_organizer.php">Login</a></button>
    </form>
</body>
</html>