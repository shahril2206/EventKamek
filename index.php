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
    <title>EventKamek | Home</title>
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
                    <li><a href="#">About Us</a></li>
                </ul>
            </div>
            <div class="header-button">
                <ul>
                    <li><a href="vendor-login.php">Are you a vendor? Click here</a></li>
                    <li><a href="event_organizer-login.php">Are you an Event Organizer? Click here</a></li>
                </ul>
            </div>
        </nav>
    </header>
    <section class="main-section">
        <div style="display: flex; align-items: center;">
            <h1 class="heading">Events</h1>
            <button class="switch_view-btn active">List View</button>
            <button class="switch_view-btn">Map View</button>
        </div>
        <div class="events-container">
            <div class="events-div">
                <!-- Search bar -->
                <div class="search-div">
                    <input type="text" name="search" id="search" placeholder="Search Events">
                </div>
                <div class="div-list">
                    <!-- Event 1 -->
                    <div class="event-item">
                        <div class="event-image">
                            <img src="images/event1.jpg" alt="Event 1">
                        </div>
                        <div class="event-details">
                            <h2>Food Festival</h2>
                            <p><i class="fas fa-calendar-alt"></i> 12th December 2025</p>
                            <p><i class="fas fa-map-marker-alt"></i> Jalan Satok, Kuching Malaysia, Malaysia</p>
                            <p><i class="fas fa-money-bill-wave"></i> RM 20</p>
                            <button class="event-btn">View Details</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="filter-div">
                <h2>Filter Events</h2>
                <div class="filter-content">
                    <div class="filter-item">
                        <label for="event-type">Event Type:</label>
                        <select name="event-type" id="event-type">
                            <option value="all">All</option>
                            <option value="foodfestival">Food Festival</option>
                            <option value="corporate">Corporate</option>
                            <option value="concert">Concert</option>
                        </select>
                    </div>
                    <div class="filter-item">
                        <label for="event-date">Event Date</label><br>
                        <label for="event-from-date">From:</label>
                        <input type="date" name="event-from-date" id="event-from-date"><br>
                        <label for="event-to-date">To:</label>
                        <input type="date" name="event-to-date" id="event-to-date">
                    </div>
                    <div class="filter-item">
                        <label for="event-location">Event Location:</label>
                        <input type="text" name="event-location" id="event-location">
                    </div>
                    <!-- Optional: Show nearby events -->
                    <div class="filter-item">
                        <label for="nearby-events">Show Nearby Events</label>
                        <input type="checkbox" name="nearby-events" id="nearby-events">
                    </div>
                    <!-- Optional: Show only free events -->
                    <div class="filter-item">
                        <label for="free-events">Show Only Free Events</label>
                        <input type="checkbox" name="free-events" id="free-events">
                    </div>
                    <div class="filter-item">
                        <button class="filter-btn">Filter</button>
                    </div>
                </div>
                <h2>Sort Events</h2>
                <div class="sort-content">
                    <div class="sort-item">
                        <label for="sort-by">Sort By</label>
                        <select name="sort-by" id="sort-by">
                            <option value="date">Date</option>
                            <option value="location">Location</option>
                            <option value="price">Price</option>
                        </select>
                    </div>
                    <div class="sort-item">
                        <label for="sort-order">Sort Order</label>
                        <select name="sort-order" id="sort-order">
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>
                    <div class="sort-item">
                        <button class="sort-btn">Sort</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <footer>
        <div class="footer-container">
            <div class="footer-top">
                <!-- Left: Quick Links -->
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/events">Browse Events</a></li>
                        <li><a href="/vendors">Find Vendors</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/faq">FAQs</a></li>
                    </ul>
                </div>

                <!-- Middle: Contact Info -->
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: support@eventkamek.com</p>
                    <p>Phone: +60 12-345 6789</p>
                    <p>Address: Lot 123, Jalan Satok, 93050 Kuching, Sarawak, Malaysia</p>
                </div>

                <!-- Right: Social Media -->
                <div class="footer-section">
                    <h3>Stay Connected</h3>
                    <p>Follow us on social media:</p>
                    <div class="social-icons">
                        <a href="https://facebook.com/eventkamek" target="_blank">Facebook</a> |
                        <a href="https://instagram.com/eventkamek" target="_blank">Instagram</a> |
                        <a href="https://twitter.com/eventkamek" target="_blank">Tiktok</a>
                    </div>
                </div>
                </div>
            </div>

        <div class="footer-bottom">
            <p>&copy; 2025 EventKamek. All Rights Reserved.</p>
        </div>
    </footer>
</body>
</html>