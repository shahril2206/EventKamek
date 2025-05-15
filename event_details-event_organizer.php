<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link preconnect="https://fonts.gstatic.com" crossorigin>
    <link preconnect="https://fonts.googleapis.com" crossorigin>
    <link rel="stylesheet" href="css/style.css?v=<?php echo time(); ?>">
    <script src="js/main.js"></script>
    <script src="https://kit.fontawesome.com/7b3b3e7b0a.js" crossorigin="anonymous"></script>
    <title>EventKamek | <?php echo "eventName" ?></title>
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                <a href="index.php"><img src="images/logo.png" alt="EventKamek Logo"></a>
            </div>
            <div class="menu">
                <ul>
                    <li><a href="#" class="active-page">Events</a></li>
                    <li><a href="#">Find Vendors</a></li>
                    <li><a href="#">Booking Requests</a></li>
                    <li><a href="#">Vendor Assignments</a></li>
                </ul>
            </div>
            <div class="header-button">
                <ul>
                    <li><a href="profile.php">Profile</a></li>
                    <li><a class="logout" href="logout.php">logout</a></li>
                </ul>
            </div>
        </nav>
    </header>
    <div class="back-button">
        <a href="javascript:history.back()" class="btn">← Back</a>
    </div>
    <section class="main-section">
        <div style="display: flex; align-items: center;">
            <h1 class="heading">Event Details</h1>
        </div>
        <div class="event-details-container">
            <div class="event-image">
                <img src="<?php echo "eventImage" ?>" alt="<?php echo "eventName" ?>">
            </div>
            <div class="event-info">
                <h2><?php echo "eventName" ?></h2>
                <p><i class="fas fa-calendar-alt"></i> <?php echo "eventDate" ?></p>
                <p><i class="fas fa-map-marker-alt"></i> <?php echo "eventLocation" ?></p>
                <p><i class="fas fa-money-bill-wave"></i> RM <?php echo "eventPrice" ?></p>
</body>
</html>