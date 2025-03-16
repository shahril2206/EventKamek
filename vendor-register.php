<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendor Registration</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <a href="index.php">Back</a>
    <h2>Vendor Registration</h2>
    <form action="vendor-register.php" method="post">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name" required><br>
        
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" required><br>
        
        <label for="company">Company/Business Name:</label><br>
        <input type="text" id="company" name="company" required><br>
        
        <label for="phone">Contact Number:</label><br>
        <input type="text" id="phone" name="phone" required><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br>

        <p>Already have an account? <a href="vendor-login.php">Log in here</a></p>
        
        <input type="submit" value="Register">
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $company = $_POST['company'];
        $phone = $_POST['phone'];

        // Database connection
        $conn = new mysqli('localhost', 'username', 'password', 'database');

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "INSERT INTO vendors (name, email, password, company, phone) VALUES ('$name', '$email', '$password', '$company', '$phone')";

        if ($conn->query($sql) === TRUE) {
            echo "Registration successful!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $conn->close();
    }
    ?>
</body>
</html>