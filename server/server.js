const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const path = require('path');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json()); // Required for parsing JSON from frontend

const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const sendBookingEmailToOrganizer = async (organizerEmail, eventName, eventstartdate, eventenddate, vendorEmail, boothName, boothCategory, remark) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use .env for safety
      pass: process.env.EMAIL_PASS,
    },
  });

  // Format event date display in "DD Month YYYY"
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  let eventDateDisplay = eventstartdate === eventenddate
    ? formatDate(eventstartdate)
    : `${formatDate(eventstartdate)} - ${formatDate(eventenddate)}`;

  const mailOptions = {
    from: `"EventKamek System" <${process.env.EMAIL_USER}>`,
    to: organizerEmail,
    subject: `📩 New Booth Booking for ${eventName}`,
    html: `
      <h3>A new booth booking has been made!</h3>
      <p><strong>Event:</strong> ${eventName}</p>
      <p><strong>Event Date:</strong> ${eventDateDisplay}</p>
      <p><strong>Vendor Email:</strong> ${vendorEmail}</p>
      <p><strong>Booth Name:</strong> ${boothName}</p>
      <p><strong>Category:</strong> ${boothCategory}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendNewAssignmentEmailToVendor = async (
  vendoremail,
  eventname,
  eventstartdate,
  eventenddate,
  eventlocation,
  boothno,
  boothname,
  boothcategory,
  remark
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Format event date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  let eventDateDisplay = eventstartdate === eventenddate
    ? formatDate(eventstartdate)
    : `${formatDate(eventstartdate)} - ${formatDate(eventenddate)}`;

  const mailOptions = {
    from: `"EventKamek System" <${process.env.EMAIL_USER}>`,
    to: vendoremail,
    subject: `📩 Booth Assignment for ${eventname}`,
    html: `
      <h3>You have been assigned a booth!</h3>
      <p><strong>Event:</strong> ${eventname}</p>
      <p><strong>Date:</strong> ${eventDateDisplay}</p>
      <p><strong>Location:</strong> ${eventlocation}</p>
      <p><strong>Booth No:</strong> ${boothno}</p>
      <p><strong>Booth Name:</strong> ${boothname}</p>
      <p><strong>Category:</strong> ${boothcategory}</p>
      <p><strong>Remark:</strong> ${remark || '-'}</p>
    `
  };

  return transporter.sendMail(mailOptions);
};


const sendUpdatedAssignmentEmailToVendor = async (
  vendoremail,
  eventname,
  eventstartdate,
  eventenddate,
  eventlocation,
  boothno,
  boothname,
  boothcategory,
  remark
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use .env for safety
      pass: process.env.EMAIL_PASS,
    },
  });
  // Format event date display in "DD Month YYYY"
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
  let eventDateDisplay = eventstartdate === eventenddate
    ? formatDate(eventstartdate)
    : `${formatDate(eventstartdate)} - ${formatDate(eventenddate)}`;
  const mailOptions = {
    from: `"EventKamek System" <${process.env.EMAIL_USER}>`,
    to: vendoremail,
    subject: `📩 Booth Assignment Updated for ${eventname}`,
    html: `
      <h3>Your booth assignment has been updated!</h3>
      <p><strong>Event:</strong> ${eventname}</p>
      <p><strong>Event Date:</strong> ${eventDateDisplay}</p>
      <p><strong>Venue:</strong> ${eventlocation}</p>
      <p><strong>Booth No:</strong> ${boothno}</p>
      <p><strong>Booth Name:</strong> ${boothname}</p>
      <p><strong>Booth Category:</strong> ${boothcategory}</p>
      <p><strong>Remark:</strong> ${remark || '-'}</p>
    `,
  };
  return transporter.sendMail(mailOptions);
}

const sendCancellationEmailToVendor = async (
  vendoremail,
  eventname,
  eventstartdate,
  eventenddate,
  eventlocation,
  boothno,
  boothname,
  boothcategory,
  remark
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use .env for safety
      pass: process.env.EMAIL_PASS,
    },
  });

  // Format event date display in "DD Month YYYY"
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  let eventDateDisplay = eventstartdate === eventenddate
    ? formatDate(eventstartdate)
    : `${formatDate(eventstartdate)} - ${formatDate(eventenddate)}`;

  const mailOptions = {
    from: `"EventKamek System" <${process.env.EMAIL_USER}>`,
    to: vendoremail,
    subject: `📩 Booth Assignment Cancellation for ${eventname}`,
    html: `
      <h3>Your booth assignment has been cancelled!</h3>
      <p><strong>Event:</strong> ${eventname}</p>
      <p><strong>Event Date:</strong> ${eventDateDisplay}</p>
      <p><strong>Venue:</strong> ${eventlocation}</p>
      <p><strong>Booth No:</strong> ${boothno}</p>
      <p><strong>Booth Name:</strong> ${boothname}</p>
      <p><strong>Booth Category:</strong> ${boothcategory}</p>
      <p><strong>Remark:</strong> ${remark || '-'}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

const sendRefundEmailToVendor = async (
  vendoremail,
  eventname,
  eventstartdate,
  eventenddate,
  eventlocation,
  boothno,
  boothname,
  boothcategory,
  refundabledepoamt
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use .env for safety
      pass: process.env.EMAIL_PASS,
    },
  });

  // Format event date display in "DD Month YYYY"
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  let eventDateDisplay = eventstartdate === eventenddate
    ? formatDate(eventstartdate)
    : `${formatDate(eventstartdate)} - ${formatDate(eventenddate)}`;

  const mailOptions = {
    from: `"EventKamek System" <${process.env.EMAIL_USER}>`,
    to: vendoremail,
    subject: `📩 Refund Processed for ${eventname}`,
    html: `
      <h3>Your refundable deposit has been processed!</h3>
      <p><strong>Event:</strong> ${eventname}</p>
      <p><strong>Event Date:</strong> ${eventDateDisplay}</p>
      <p><strong>Venue:</strong> ${eventlocation}</p>
      <p><strong>Booth No:</strong> ${boothno}</p>
      <p><strong>Booth Name:</strong> ${boothname}</p>
      <p><strong>Booth Category:</strong> ${boothcategory}</p>
      <p><strong>Refundable Deposit Amount:</strong> RM ${refundabledepoamt}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

const sendForfeitEmailToVendor = async (
  vendoremail,
  eventname,
  eventstartdate,
  eventenddate,
  eventlocation,
  boothno,
  boothname,
  boothcategory,
  depoAmount,
  forfeituredetails
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use .env for safety
      pass: process.env.EMAIL_PASS,
    },
  });

  // Format event date display in "DD Month YYYY"
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  let eventDateDisplay = eventstartdate === eventenddate
    ? formatDate(eventstartdate)
    : `${formatDate(eventstartdate)} - ${formatDate(eventenddate)}`;

  const mailOptions = {
    from: `"EventKamek System" <${process.env.EMAIL_USER}>`,
    to: vendoremail,
    subject: `📩 Forfeiture Notice for ${eventname}`,
    html: `
      <h3>Your refundable deposit has been forfeited!</h3>
      <p><strong>Event:</strong> ${eventname}</p>
      <p><strong>Event Date:</strong> ${eventDateDisplay}</p>
      <p><strong>Venue:</strong> ${eventlocation}</p>
      <p><strong>Booth No:</strong> ${boothno}</p>
      <p><strong>Booth Name:</strong> ${boothname}</p>
      <p><strong>Booth Category:</strong> ${boothcategory}</p>
      <p class="text-red-700"><strong>Deposit Amount (Forfeited):</strong> RM ${depoAmount}</p>
      <p><strong>Forfeiture Details:</strong> ${forfeituredetails}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

const sendEventUpdateEmailToVendor = async (
  email,
  eventName,
  startDate,
  endDate,
  location,
  closingBookingDate,
  boothSlots,
  boothFee,
  refundableDepoAmt,
  nonRefundableDepoAmt,
  fullPayment
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use .env for safety
      pass: process.env.EMAIL_PASS,
    },
  });
  // Format event date display in "DD Month YYYY"
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
  let eventDateDisplay = startDate === endDate
    ? formatDate(startDate)
    : `${formatDate(startDate)} - ${formatDate(endDate)}`;
  const mailOptions = {
    from: `"EventKamek System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `📩 Event Update: ${eventName}`,
    html: `
      <h3>Event Details Updated!</h3>
      <p><strong>Event:</strong> ${eventName}</p>
      <p><strong>Date:</strong> ${eventDateDisplay}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Booking Closing Date:</strong> ${formatDate(closingBookingDate)}</p>
      <p><strong>Booth Slots:</strong> ${boothSlots}</p>
      <p><strong>Booth Fee:</strong> RM ${boothFee}</p>
      <p><strong>Refundable Deposit Amount:</strong> RM ${refundableDepoAmt}</p>
      <p><strong>Non-refundable Deposit Amount:</strong> RM ${nonRefundableDepoAmt}</p>
      <p><strong>Full Payment:</strong> RM ${fullPayment}</p>`
  };
  return transporter.sendMail(mailOptions);
};


// Right after server starts for testing
(async () => {
  console.log('[Manual Trigger] Running status updater');
  const result = await pool.query(`SELECT * FROM events`);
  for (let event of result.rows) {
    const today = new Date();
    const start = new Date(event.eventstartdate);
    const end = new Date(event.eventenddate);

    let newStatus = '';
    if (today < start) newStatus = 'Upcoming';
    else if (today >= start && today <= end) newStatus = 'Ongoing';
    else newStatus = 'Past';

    if (event.status !== newStatus) {
      await pool.query(`UPDATE events SET status = $1 WHERE eventid = $2`, [newStatus, event.eventid]);
      console.log(`Updated ${event.eventid} to ${newStatus}`);
    }
  }
})();

// ========== REGISTER ROUTE ==========
app.post('/api/register', async (req, res) => {
  const { role, name, email, contactNo, password } = req.body;

  if (!role || !name || !email || !contactNo || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const table = role === 'vendor' ? 'vendor' : role === 'organizer' ? 'eventorganizer' : null;
  if (!table) return res.status(400).json({ error: 'Invalid role' });

  const emailColumn = role === 'vendor' ? 'vendoremail' : 'organizeremail';
  const nameColumn = role === 'vendor' ? 'vendorname' : 'organizationname';

  try {
    const existing = await pool.query(
      `SELECT * FROM ${table} WHERE ${emailColumn} = $1`,
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO ${table} (${nameColumn}, ${emailColumn}, contactnum, password, profilepic)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, contactNo, hashedPassword, "dummyProfilePic.png"]
    );

    res.json({ success: true, message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ========== LOGIN ROUTE ==========
app.post('/api/login', async (req, res) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const roleConfig = {
    vendor: { table: 'vendor', column: 'vendoremail', passwordColumn: 'password' },
    organizer: { table: 'eventorganizer', column: 'organizeremail', passwordColumn: 'password' },
  }[role];

  if (!roleConfig) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM ${roleConfig.table} WHERE ${roleConfig.column} = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials: No user found' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials: Password mismatch' });
    }

    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, role, email });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== FETCH ALL EVENTS ==========
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT events.*, eventorganizer.organizationname
      FROM events
      JOIN eventorganizer ON events.organizeremail = eventorganizer.organizeremail
    `);
    res.json(result.rows);

    for (let event of result.rows) {
      const today = new Date();
      const start = new Date(event.eventstartdate);
      const end = new Date(event.eventenddate);

      let newStatus = '';
      if (today < start) newStatus = 'Upcoming';
      else if (today >= start && today <= end) newStatus = 'Ongoing';
      else newStatus = 'Past';

      if (event.status !== newStatus) {
        await pool.query(`UPDATE events SET status = $1 WHERE eventid = $2`, [newStatus, event.eventid]);
        console.log(`Updated ${event.eventid} to ${newStatus}`);
      }
    }
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========== FETCH EVENT BY SLUG ==========
app.get('/api/events/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        events.*, 
        eventorganizer.organizationname, 
        eventorganizer.contactnum, 
        eventorganizer.profilepic,
        COUNT(booking.*) FILTER (WHERE booking.isCancelled = false) AS bookedbooths,
        COUNT(booking.*) FILTER (WHERE booking.isassigned = true) AS assignedbooths
      FROM events
      JOIN eventorganizer ON events.organizeremail = eventorganizer.organizeremail
      LEFT JOIN booking ON booking.eventid = events.eventid
      WHERE events.eventslug = $1
      GROUP BY events.eventid, eventorganizer.organizationname, eventorganizer.contactnum, eventorganizer.profilepic
    `, [slug]);

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = result.rows[0];

    // Now fetch per-category booking counts (excluding cancelled)
    const categoryCountsRes = await pool.query(`
      SELECT boothcategory, COUNT(*) AS count
      FROM booking
      WHERE eventid = $1 AND isCancelled = false
      GROUP BY boothcategory
    `, [event.eventid]);

    const categoryBookingCounts = {};
    categoryCountsRes.rows.forEach(row => {
      categoryBookingCounts[row.boothcategory] = parseInt(row.count);
    });

    // Append to event data
    res.json({
      ...event,
      categoryBookingCounts, // e.g., { Food: 5, Books: 3 }
    });

  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});


// ========== CREATE A BOOKING ========== (updated with email notification)
app.post('/api/bookings', async (req, res) => {
  const {
    vendoremail,
    eventId,
    eventStartDate,
    eventEndDate,
    boothName,
    boothCategory,
    remark,
  } = req.body;

  if (!vendoremail || !eventId || !boothName || !boothCategory) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert the booking
    await client.query(
      `INSERT INTO booking (vendoremail, eventid, boothname, boothcategory, remark)
       VALUES ($1, $2, $3, $4, $5)`,
      [vendoremail, eventId, boothName, boothCategory, remark || '']
    );

    // 2. Fetch event name and organizer email
    const eventInfoRes = await client.query(`
      SELECT eventname, eventorganizer.organizeremail, eventstartdate, eventenddate
      FROM events
      JOIN eventorganizer ON events.organizeremail = eventorganizer.organizeremail
      WHERE eventid = $1
    `, [eventId]);

    if (!eventInfoRes.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found' });
    }

    const { eventname, organizeremail } = eventInfoRes.rows[0];

    // 3. Send email to organizer
    await sendBookingEmailToOrganizer(organizeremail, eventname, eventStartDate, eventEndDate, vendoremail, boothName, boothCategory, remark);

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Booking saved and email sent' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Booking Error:', err);
    res.status(500).json({ error: 'Failed to save booking', details: err.message });
  } finally {
    client.release();
  }
});

// ========== CREATE EVENT ==========

const slugify = require('slugify');
const { send } = require('process');

app.post('/api/events/create', async (req, res) => {
  const {
    eventName,
    startDate,
    endDate,
    location,
    eventDetails,
    eventLink,
    image,
    status,
    includeVendorBooth,
    bookingClosingDate,
    boothSlots,
    categoryLimits,
    boothFee,
    refundableDepoAmt,
    nonRefundableDepoAmt,
    fullPayment,
    lat,
    lng,
    organizeremail,
  } = req.body;

  const slug = slugify(eventName, { lower: true });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert into events table
    const insertEventResult = await client.query(`
      INSERT INTO events (
        eventname, eventslug, eventstartdate, eventenddate, eventlocation,
        latitude, longitude, eventdetails, eventimage, eventextlink, status, boothbookingenabled,
        bookingclosingdate, boothslots,
        foodboothlimit, clothingboothlimit, toysboothlimit, craftboothlimit,
        booksboothlimit, accessoriesboothlimit, otherboothlimit,
        boothfee, refundabledepo, nonrefundabledepo, fullpayment, organizeremail
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19,
        $20, $21, $22, $23, $24, $25, $26
      )
      RETURNING eventid
    `, [
      eventName, slug, startDate, endDate, location,
      lat, lng, eventDetails, image, eventLink, status, includeVendorBooth,
      bookingClosingDate, boothSlots || null,
      categoryLimits?.Food, categoryLimits?.Clothing, categoryLimits?.Toys, categoryLimits?.Craft,
      categoryLimits?.Books, categoryLimits?.Accessories, categoryLimits?.Other,
      boothFee, refundableDepoAmt, nonRefundableDepoAmt, fullPayment, organizeremail,
    ]);

    const newEventId = insertEventResult.rows[0].eventid;

    // 2. Insert booths only if includeVendorBooth is true and boothSlots > 0
    if (includeVendorBooth) {
      const insertBoothsPromises = [];

      for (let i = 1; i <= boothSlots; i++) {
        insertBoothsPromises.push(
          client.query(
            `INSERT INTO booth (eventid, boothno, isassigned) VALUES ($1, $2, $3)`,
            [newEventId, i, false]
          )
        );
      }

      await Promise.all(insertBoothsPromises);
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Event and booths created successfully', slug });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Event creation error:', err);
    res.status(500).json({ error: 'Failed to create event', details: err.message });
  } finally {
    client.release();
  }
});


// =========== UPDATE EVENT =============
app.put('/api/events/update/:slug', async (req, res) => {
  const { slug } = req.params;

  // 🧹 Normalize undefined or '' to null
  const normalize = (v) => v === '' || v === undefined ? null : v;

  const data = {
    ...req.body,
    boothFee: normalize(req.body.boothFee),
    refundableDepoAmt: normalize(req.body.refundableDepoAmt),
    nonRefundableDepoAmt: normalize(req.body.nonRefundableDepoAmt),
    boothSlots: normalize(req.body.boothSlots),
    closingBookingDate: normalize(req.body.closingBookingDate),
    categoryLimits: {
      Food: normalize(req.body.categoryLimits?.Food),
      Clothing: normalize(req.body.categoryLimits?.Clothing),
      Toys: normalize(req.body.categoryLimits?.Toys),
      Craft: normalize(req.body.categoryLimits?.Craft),
      Books: normalize(req.body.categoryLimits?.Books),
      Accessories: normalize(req.body.categoryLimits?.Accessories),
      Other: normalize(req.body.categoryLimits?.Other),
    },
  };

  try {
    console.log('🔍 Updated event data:', data);

    const result = await pool.query(
      `UPDATE events SET
        eventname = $1,
        eventstartdate = $2,
        eventenddate = $3,
        eventlocation = $4,
        latitude = $5,
        longitude = $6,
        eventdetails = $7,
        eventextlink = $8,
        boothbookingenabled = $9,
        bookingclosingdate = $10,
        boothslots = $11,
        foodboothlimit = $12,
        clothingboothlimit = $13,
        toysboothlimit = $14,
        craftboothlimit = $15,
        booksboothlimit = $16,
        accessoriesboothlimit = $17,
        otherboothlimit = $18,
        boothfee = $19,
        refundabledepo = $20,
        nonrefundabledepo = $21,
        fullpayment = $22
      WHERE eventslug = $23`,
      [
        data.eventName,
        data.startDate,
        data.endDate,
        data.location,
        data.lat,
        data.lng,
        data.eventDetails,
        data.eventLink,
        data.includeVendorBooth,
        data.closingBookingDate,
        data.boothSlots,
        data.categoryLimits?.Food,
        data.categoryLimits?.Clothing,
        data.categoryLimits?.Toys,
        data.categoryLimits?.Craft,
        data.categoryLimits?.Books,
        data.categoryLimits?.Accessories,
        data.categoryLimits?.Other,
        data.boothFee,
        data.refundableDepoAmt,
        data.nonRefundableDepoAmt,
        data.fullPayment,
        slug,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found or not updated.' });
    }

    res.json({ success: true, message: 'Event updated successfully.' });
  } catch (err) {
    console.error('❌ Update error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update event', details: err.message });
  }
});




// ========== FETCH PROFILE ==========

app.get('/api/organizer/myprofile', async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await pool.query(`
      SELECT organizeremail, organizationname, contactnum, profilepic,
             facebooklink, instagramlink, tiktoklink, websitelink, aboutus
      FROM eventorganizer
      WHERE organizeremail = $1
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.json(result.rows[0]); // 🔥 this must be a single object
  } catch (err) {
    console.error('Fetch organizer profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
});

app.get('/api/vendor/myprofile', async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await pool.query(`
      SELECT vendoremail, vendorname, contactnum, profilepic,
             facebooklink, instagramlink, tiktoklink, websitelink, aboutus
      FROM vendor
      WHERE vendoremail = $1
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'vendor not found' });
    }

    res.json(result.rows[0]); // 🔥 this must be a single object
  } catch (err) {
    console.error('Fetch vendor profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
});

// ========== UPDATE PROFILE ==========

app.put('/api/profile/update', async (req, res) => {
  const {
    role, email, name, contactnum,
    facebooklink, instagramlink, tiktoklink,
    websitelink, aboutus
  } = req.body;

  if (!role || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const table = role === 'vendor' ? 'vendor' : role === 'organizer' ? 'eventorganizer' : null;
  if (!table) return res.status(400).json({ error: 'Invalid role' });

  const updates = {
    vendor: {
      nameCol: 'vendorname',
      emailCol: 'vendoremail',
      contactCol: 'contactnum',
    },
    organizer: {
      nameCol: 'organizationname',
      emailCol: 'organizeremail',
      contactCol: 'contactnum',
    },
  }[role];

  try {
    const result = await pool.query(
      `UPDATE ${table} SET
        ${updates.nameCol} = $1,
        ${updates.contactCol} = $2,
        facebooklink = $3,
        instagramlink = $4,
        tiktoklink = $5,
        websitelink = $6,
        aboutus = $7
      WHERE ${updates.emailCol} = $8`,
      [name, contactnum, facebooklink, instagramlink, tiktoklink, websitelink, aboutus, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Profile not found or not updated' });
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('❌ Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

// ========== FETCH EVENTS BOOTH ==========

app.get('/api/eventsbooth', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Missing organizer email' });
  }

  try {
    const result = await pool.query(`
      SELECT 
        events.eventid,
        events.eventname,
        events.eventstartdate,
        events.eventenddate,
        events.eventlocation,
        events.eventslug,
        events.status,
        events.boothslots,
        COUNT(booking.*) FILTER (WHERE booking.isassigned = true AND booking.iscancelled = false) AS bookedbooths
      FROM events
      LEFT JOIN booking ON events.eventid = booking.eventid
      INNER JOIN eventorganizer ON events.organizeremail = eventorganizer.organizeremail
      WHERE eventorganizer.organizeremail = $1
      GROUP BY events.eventid
    `, [email]);

    res.json(result.rows);

    for (let event of result.rows) {
      const today = new Date();
      const start = new Date(event.eventstartdate);
      const end = new Date(event.eventenddate);

      let newStatus = '';
      if (today < start) newStatus = 'Upcoming';
      else if (today >= start && today <= end) newStatus = 'Ongoing';
      else newStatus = 'Past';

      if (event.status !== newStatus) {
        await pool.query(`UPDATE events SET status = $1 WHERE eventid = $2`, [newStatus, event.eventid]);
        console.log(`Updated ${event.eventid} to ${newStatus}`);
      }
    }
  } catch (err) {
    console.error('❌ SQL Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========== FETCH EVENT BOOTH DETAILS ==========

app.get('/api/eventbooths/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    // 1. Fetch event details
    const eventResult = await pool.query(`
      SELECT 
        eventid,
        eventslug,
        eventname,
        TO_CHAR(eventstartdate, 'DD Month YYYY') AS eventstartdate,
        TO_CHAR(eventenddate, 'DD Month YYYY') AS eventenddate,
        eventlocation,
        status,
        boothbookingenabled
      FROM events
      WHERE eventid = $1
    `, [eventId]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // 2. Fetch booth assignments
    const assignmentResult = await pool.query(`
      SELECT 
        b.boothid,
        b.boothno,
        a.assignmentid,
        a.boothname,
        a.boothcategory,
        v.vendorname,
        v.vendoremail,
        v.contactnum,
        a.remark,
        a.iscancelled,
        TO_CHAR(a.cancellationdatetime, 'DD Month YYYY, HH12:MI AM') AS cancellationdatetime,
        a.cancellationremark,
        e.refundabledepo AS refundabledepo,
        a.refundabledepostatus,
        a.forfeituredetails
      FROM booth b
      LEFT JOIN assignment a ON b.boothid = a.boothid AND a.eventid = $1
      LEFT JOIN vendor v ON a.vendoremail = v.vendoremail
      JOIN events e ON b.eventid = e.eventid
      WHERE b.eventid = $1
      ORDER BY b.boothno ASC
    `, [eventId]);

    // 3. Fetch unassigned bookings (not assigned to any booth yet and not cancelled)
    const bookingResult = await pool.query(`
      SELECT 
        b.bookingid,
        v.vendorname,
        TO_CHAR(b.bookingdatetime, 'DD/MM/YYYY, HH12:MI AM') AS bookingdatetime,
        b.boothname,
        b.boothcategory,
        b.remark,
        b.vendoremail,
        v.contactnum
      FROM booking b
      JOIN vendor v ON b.vendoremail = v.vendoremail
      WHERE b.eventid = $1 AND b.iscancelled = false AND b.isassigned = false
    `, [eventId]);

    // 4. Fetch cancelled (removed) assignments
    const cancelledResult = await pool.query(`
      SELECT 
        a.assignmentid,
        a.boothname,
        a.boothcategory,
        v.vendorname,
        v.vendoremail,
        v.contactnum,
        TO_CHAR(a.cancellationdatetime, 'DD Month YYYY, HH12:MI AM') AS cancellationdatetime,
        a.cancellationremark
      FROM assignment a
      LEFT JOIN vendor v ON a.vendoremail = v.vendoremail
      WHERE a.eventid = $1 AND a.iscancelled = true
      ORDER BY a.cancellationdatetime DESC
    `, [eventId]);

    res.json({
      eventData: eventResult.rows[0],
      assignments: assignmentResult.rows,
      bookings: bookingResult.rows,
      cancelledAssignments: cancelledResult.rows
    });

    for (let event of eventResult.rows) {
      const today = new Date();
      const start = new Date(event.eventstartdate);
      const end = new Date(event.eventenddate);

      let newStatus = '';
      if (today < start) newStatus = 'Upcoming';
      else if (today >= start && today <= end) newStatus = 'Ongoing';
      else newStatus = 'Past';

      if (event.status !== newStatus) {
        await pool.query(`UPDATE events SET status = $1 WHERE eventid = $2`, [newStatus, event.eventid]);
        console.log(`Updated ${event.eventid} to ${newStatus}`);
      }
    }
  } catch (err) {
    console.error('❌ Fetch event booth details error:', err);
    res.status(500).json({ error: 'Failed to fetch booth details', details: err.message });
  }
});

// ========== FETCH UNASSIGNED BOOTHS FOR EVENT ==========
app.get('/api/unassigned-booths/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query(`
      SELECT boothno FROM booth
      WHERE eventid = $1 AND isassigned = false
      ORDER BY boothno
    `, [eventId]);

    const booths = result.rows.map(row => row.boothno);
    res.json({ booths });
  } catch (err) {
    console.error('❌ Fetch unassigned booths error:', err);
    res.status(500).json({ error: 'Failed to fetch booths', details: err.message });
  }
});

// ========== ASSIGN VENDOR TO BOOTH ==========
app.post('/api/addassignments', async (req, res) => {
  const {
    bookingid,
    eventid,
    boothno,
    vendoremail,
    boothname,
    boothcategory,
    remark
  } = req.body;

  if (!eventid || !boothno || !vendoremail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get the boothid for the selected boothno
    const boothResult = await client.query(
      `SELECT boothid FROM booth WHERE eventid = $1 AND boothno = $2`,
      [eventid, boothno]
    );

    if (boothResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booth not found' });
    }

    const boothid = boothResult.rows[0].boothid;

    // 2. Mark booth as assigned
    await client.query(
      `UPDATE booth SET isassigned = true WHERE boothid = $1`,
      [boothid]
    );

    // 3. Mark booking as assigned
    await client.query(
      `UPDATE booking SET isassigned = true WHERE bookingid = $1`,
      [bookingid]
    );


    // 4. Insert into assignment table
    await client.query(
      `INSERT INTO assignment (
        eventid, boothid, vendoremail, boothname, boothcategory, remark, bookingid
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [eventid, boothid, vendoremail, boothname, boothcategory, remark || null, bookingid]
    );

    await client.query('COMMIT');

    // Fetch assignment details in a new query
    const newClient = await pool.connect();
    try {
      const detailsRes = await client.query(`
      SELECT
        a.remark,
        b.boothno,
        a.boothname,
        a.boothcategory,
        a.vendoremail,
        e.eventname,
        TO_CHAR(e.eventstartdate, 'DD Month YYYY') AS eventstartdate,
        TO_CHAR(e.eventenddate, 'DD Month YYYY') AS eventenddate,
        e.eventlocation,
        TO_CHAR(bk.bookingdatetime, 'DD Month YYYY, HH12:MI AM') AS bookingdatetime
      FROM assignment a
      JOIN booth b ON a.boothid = b.boothid
      JOIN events e ON a.eventid = e.eventid
      JOIN booking bk ON a.bookingid = bk.bookingid
      WHERE a.eventid = $1 AND a.vendoremail = $2 AND b.boothno = $3
    `, [eventid, vendoremail, boothno]);
      if (detailsRes.rows.length > 0) {
        const details = detailsRes.rows[0];
        await sendNewAssignmentEmailToVendor(
          details.vendoremail,
          details.eventname,
          details.eventstartdate,
          details.eventenddate,
          details.eventlocation,
          details.boothno,
          details.boothname,
          details.boothcategory,
          details.remark
        );
      }
    } finally {
      newClient.release();
    }

    res.status(201).json({ success: true, message: 'Vendor assigned successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Assignment error:', err);
    res.status(500).json({ error: 'Failed to assign vendor', details: err.message });
  } finally {
    client.release();
  }
});

// ========== UPDATE ASSIGNMENT ==========
app.put('/api/updateassignment', async (req, res) => {
  const { assignmentid, boothno, remark } = req.body;

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // 1. Get boothid of the newly selected booth (include eventid filter!)
    const newBoothRes = await client.query(
      `SELECT boothid FROM booth WHERE boothno = $1 AND eventid = (
        SELECT eventid FROM assignment WHERE assignmentid = $2
      )`,
      [boothno, assignmentid]
    );

    if (newBoothRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'New booth not found' });
    }

    const newBoothId = newBoothRes.rows[0].boothid;

    // 2. Get the old boothid from the current assignment
    const oldAssignmentRes = await client.query(
      `SELECT boothid FROM assignment WHERE assignmentid = $1`,
      [assignmentid]
    );

    if (oldAssignmentRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const oldBoothId = oldAssignmentRes.rows[0].boothid;

    // 3. Set old booth to isassigned = false
    await client.query(
      `UPDATE booth SET isassigned = false WHERE boothid = $1`,
      [oldBoothId]
    );

    // 4. Set new booth to isassigned = true
    await client.query(
      `UPDATE booth SET isassigned = true WHERE boothid = $1`,
      [newBoothId]
    );

    // 5. Update the assignment with the new boothid and remark
    await client.query(
      `UPDATE assignment
       SET boothid = $1, remark = $2
       WHERE assignmentid = $3`,
      [newBoothId, remark || null, assignmentid]
    );

    await client.query('COMMIT');

    // 6. Fetch full assignment + event info
    const newClient = await pool.connect();
    try {
      const detailsRes = await client.query(`
        SELECT 
          a.remark,
          b.boothno,
          a.boothname,
          a.boothcategory,
          a.vendoremail,
          e.eventname,
          TO_CHAR(e.eventstartdate, 'DD Month YYYY') AS eventstartdate,
          TO_CHAR(e.eventenddate, 'DD Month YYYY') AS eventenddate,
          e.eventlocation,
          TO_CHAR(bk.bookingdatetime, 'DD Month YYYY, HH12:MI AM') AS bookingdatetime
        FROM assignment a
        JOIN booth b ON a.boothid = b.boothid
        JOIN events e ON a.eventid = e.eventid
        JOIN booking bk ON a.bookingid = bk.bookingid
        WHERE a.assignmentid = $1
      `, [assignmentid]);

      if (detailsRes.rows.length > 0) {
        const details = detailsRes.rows[0];
        await sendUpdatedAssignmentEmailToVendor(
          details.vendoremail,
          details.eventname,
          details.eventstartdate,
          details.eventenddate,
          details.eventlocation,
          details.boothno,
          details.boothname,
          details.boothcategory,
          remark
        );
      }
    }
    finally {
      newClient.release();
    }

    res.json({ success: true, message: 'Assignment updated successfully and sent to email' });
  } catch (err) {
    console.error('❌ Update assignment error:', err);
    res.status(500).json({ error: 'Failed to update assignment', details: err.message });
  }
});

app.get('/api/assignment/:assignmentid', async (req, res) => {
    const { assignmentid } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
              a.assignmentid,
              a.remark,
              v.vendorname,
              v.vendoremail,
              a.boothname,
              a.boothcategory,
              b.boothno
            FROM assignment a
            LEFT JOIN vendor v ON v.vendoremail = a.vendoremail
            LEFT JOIN booth b ON b.boothid = a.boothid
            WHERE a.assignmentid = $1
        `, [parseInt(assignmentid)]);

        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Assignment not found' });

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching assignment:', err.message);
        res.status(500).json({ error: 'Internal Server Error', detail: err.message });
    }
});

// ========== REMOVE ASSIGNMENT ==========
app.put('/api/removeassignment/:assignmentid', async (req, res) => {
  const rawId = req.params.assignmentid;
  const assignmentId = parseInt(rawId);
  const { cancellationremark } = req.body;

  if (isNaN(assignmentId)) {
    return res.status(400).json({ error: 'Invalid assignment ID (NaN)' });
  }

  console.log('🟡 Received assignmentId:', assignmentId);
  console.log('🟡 Received cancellationremark:', cancellationremark);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT bookingid, boothid FROM assignment WHERE assignmentid = $1`,
      [assignmentId]
    );

    if (result.rows.length === 0) {
      console.log('❌ No assignment found for ID:', assignmentId);
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const { bookingid, boothid } = result.rows[0];
    console.log('🟢 Fetched bookingid:', bookingid, 'boothid:', boothid);

    const updateAssignment = await client.query(
      `UPDATE assignment
       SET iscancelled = true,
           cancellationdatetime = NOW(),
           cancellationremark = $1,
           boothid = NULL  -- ✅ fix for constraint
       WHERE assignmentid = $2`,
      [cancellationremark || '-', assignmentId]
    );
    console.log('✅ Updated assignment row:', updateAssignment.rowCount);

    const updateBooth = await client.query(
      `UPDATE booth SET isassigned = false WHERE boothid = $1`,
      [boothid]
    );
    console.log('✅ Updated booth row:', updateBooth.rowCount);

    const updateBooking = await client.query(
      `UPDATE booking SET iscancelled = true, isassigned = false WHERE bookingid = $1`,
      [bookingid]
    );
    console.log('✅ Updated booking row:', updateBooking.rowCount);

    await client.query('COMMIT');

    // Fetch full details for email
    const newClient = await pool.connect();
    try {
      const detailsRes = await client.query(`
        SELECT 
          a.boothname,
          a.boothcategory,
          a.remark,
          a.vendoremail,
          e.eventname,
          TO_CHAR(e.eventstartdate, 'DD Month YYYY') AS eventstartdate,
          TO_CHAR(e.eventenddate, 'DD Month YYYY') AS eventenddate,
          e.eventlocation
        FROM assignment a
        JOIN events e ON a.eventid = e.eventid
        WHERE a.assignmentid = $1
      `, [assignmentId]);
      if (detailsRes.rows.length > 0) {
        const details = detailsRes.rows[0];
        await sendCancellationEmailToVendor(
          details.vendoremail,
          details.eventname,
          details.eventstartdate,
          details.eventenddate,
          details.eventlocation,
          details.boothname,
          details.boothcategory,
          cancellationremark
        );
      } else {
        console.log('❌ No details found for assignment ID:', assignmentId);
      }
    } finally {
      newClient.release();
    }
    console.log('✅ Assignment cancelled and booth unassigned successfully');

    res.json({ message: '✅ Assignment cancelled and booth unassigned successfully.' });
  } catch (err) {
    console.error('🔥 Refund error:', err);
    await client.query('ROLLBACK');
    res.status(500).json({ error: '❌ Internal server error', details: err.message });
  } finally {
    client.release();
  }
});

// ========== UPDATE REFUNDABLE DEPOSIT STATUS ==========
app.put('/api/refunddeposit/:assignmentid', async (req, res) => {
  const { assignmentid } = req.params;
  const { refundabledepo } = req.body.refundabledepo;

  if (isNaN(parseInt(assignmentid))) {
    return res.status(400).json({ error: 'Invalid assignment ID' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Update refund status
    const result = await client.query(
      `UPDATE assignment SET refundabledepostatus = 'Refunded' WHERE assignmentid = $1`,
      [assignmentid]
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Assignment not found or not updated' });
    }

    await client.query('COMMIT');


    // 2. Fetch vendor & event info for email
    const newClient = await pool.connect();
    try {
      const detailsRes = await client.query(`
        SELECT 
          a.vendoremail,
          b.boothno,
          a.boothname,
          a.boothcategory,
          e.eventname,
          TO_CHAR(e.eventstartdate, 'DD Month YYYY') AS eventstartdate,
          TO_CHAR(e.eventenddate, 'DD Month YYYY') AS eventenddate,
          e.eventlocation,
          e.refundabledepo
        FROM assignment a
        JOIN events e ON a.eventid = e.eventid
        JOIN booth b ON a.boothid = b.boothid
        WHERE a.assignmentid = $1
      `, [assignmentid]);
      if (detailsRes.rows.length > 0) {
        const {
          vendoremail,
          boothno,
          boothname,
          boothcategory,
          eventname,
          eventstartdate,
          eventenddate,
          eventlocation,
          refundabledepo: depoAmount,
        } = detailsRes.rows[0];

        await sendRefundEmailToVendor(
          vendoremail,
          eventname,
          eventstartdate,
          eventenddate,
          eventlocation,
          boothno,
          boothname,
          boothcategory,
          depoAmount
        );
      }
    } finally {
      newClient.release();
    }
    console.log('✅ Refund status updated successfully');


    res.json({ success: true, message: 'Refund status updated and email sent' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Refund update error:', err);
    res.status(500).json({ error: 'Failed to update refund status', details: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/forfeitdeposit/:assignmentid', async (req, res) => {
  const { assignmentid } = req.params;
  const { refundabledepo, forfeituredetails } = req.body;

  if (!assignmentid || isNaN(parseInt(assignmentid))) {
    return res.status(400).json({ error: 'Invalid assignment ID' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE assignment 
       SET refundabledepostatus = 'Forfeited',
         forfeituredetails = $1
       WHERE assignmentid = $2`,
      [forfeituredetails, assignmentid]
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Assignment not found or not updated' });
    }

    await client.query('COMMIT');
    // === Fetch details for email ===
    const newClient = await pool.connect();
    try {
      const detailsRes = await client.query(`
        SELECT 
          a.vendoremail,
          b.boothno,
          a.boothname,
          a.boothcategory,
          e.eventname,
          TO_CHAR(e.eventstartdate, 'DD Month YYYY') AS eventstartdate,
          TO_CHAR(e.eventenddate, 'DD Month YYYY') AS eventenddate,
          e.eventlocation,
          e.refundabledepo,
          a.forfeituredetails
        FROM assignment a
        JOIN events e ON a.eventid = e.eventid
        JOIN booth b ON a.boothid = b.boothid
        WHERE a.assignmentid = $1
      `, [assignmentid]);
      if (detailsRes.rows.length > 0) {
        const {
          vendoremail,
          boothno,
          boothname,
          boothcategory,
          eventname,
          eventstartdate,
          eventenddate,
          eventlocation,
          refundabledepo: depoAmount,
          forfeituredetails
        } = detailsRes.rows[0];

        await sendForfeitEmailToVendor(
          vendoremail,
          eventname,
          eventstartdate,
          eventenddate,
          eventlocation,
          boothno,
          boothname,
          boothcategory,
          depoAmount,
          forfeituredetails
        );
      }
    } finally {
      newClient.release();
    }
    console.log('✅ Refund marked as forfeited successfully');


    res.json({ success: true, message: 'Refund marked as forfeited and email sent' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Forfeit update error:', err);
    res.status(500).json({ error: 'Failed to mark forfeiture', details: err.message });
  } finally {
    client.release();
  }
});

// ========== FETCH MYBOOTHS FOR VENDOR ==========
app.get('/api/mybooths/:email', async (req, res) => {
  const vendoremail = req.params.email;
  try {
    const result = await pool.query(`
      SELECT 
        a.assignmentid,
        a.boothname,
        a.boothcategory,
        b.boothno,
        a.remark,
        a.vendoremail,
        e.eventname,
        e.eventstartdate,
        e.eventenddate,
        e.eventlocation,
        e.status AS eventstatus,
        e.eventslug,
        eo.organizationname,
        eo.organizeremail
      FROM assignment a
      JOIN events e ON a.eventid = e.eventid
      JOIN booth b ON a.boothid = b.boothid 
      LEFT JOIN eventorganizer eo ON e.organizeremail = eo.organizeremail
      WHERE a.vendoremail = $1 AND a.iscancelled = false
      ORDER BY e.eventstartdate DESC;
    `, [vendoremail]);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching booths:', err.message); // show exact cause
    res.status(500).json({ error: 'Failed to fetch booth data', details: err.message });
  }
});


// ========== FETCH VENDORS ASSIGNED TO BOOTHS FOR A GIVEN EVENT FOR EVENT DETAILS ==========
app.get('/api/eventvendors/:eventid', async (req, res) => {
  const { eventid } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        b.boothno,
        a.boothname,
        a.boothcategory,
        a.vendoremail,
        a.remark,
        a.assignmentid,
        v.vendorname,
        v.contactnum
      FROM assignment a
      JOIN booth b ON a.boothid = b.boothid
      JOIN vendor v ON a.vendoremail = v.vendoremail
      WHERE a.eventid = $1 AND a.iscancelled = false
      ORDER BY b.boothno::int
    `, [eventid]);

    res.json({ vendors: result.rows });
  } catch (err) {
    console.error('Error fetching vendor booths:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= AUTO ASSIGN ENABLE ======================

app.post('/api/autoassign/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get unassigned bookings (not yet in assignment table)
    const unassignedBookings = await client.query(`
      SELECT b.bookingid, b.vendoremail, b.boothname, b.boothcategory, b.remark
      FROM booking b
      WHERE b.eventid = $1
        AND b.iscancelled = false
        AND NOT EXISTS (
          SELECT 1 FROM assignment a WHERE a.bookingid = b.bookingid
        )
      ORDER BY b.bookingid ASC
    `, [eventId]);


    // Get available booths (not already assigned)
    const availableBooths = await client.query(`
      SELECT boothid, boothno
      FROM booth
      WHERE eventid = $1 AND isassigned = false
      ORDER BY boothno ASC
    `, [eventId]);

    const bookings = unassignedBookings.rows;
    const booths = availableBooths.rows;

    const assignCount = Math.min(bookings.length, booths.length);

    for (let i = 0; i < assignCount; i++) {
      const booking = bookings[i];
      const booth = booths[i];

      // 1. insert assignment
      await client.query(`
        INSERT INTO assignment (eventid, boothid, vendoremail, boothname, boothcategory, remark)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        eventId,
        booth.boothid,
        booking.vendoremail,
        booking.boothname,
        booking.boothcategory,
        booking.remark
      ]);

      // 2. update booth
      await client.query(`
        UPDATE booth SET isassigned = true WHERE boothid = $1
      `, [booth.boothid]);

      // 3. update booking
      await client.query(`
        UPDATE booking SET isassigned = true WHERE bookingid = $1
      `, [booking.bookingid]);

      // 4. Send email
      await sendAssignmentEmailToVendor(
        booking.vendoremail,
        eventname,
        eventstartdate,
        eventenddate,
        eventlocation,
        booth.boothno,
        booking.boothname,
        booking.boothcategory,
        booking.remark,
        booking.bookingdatetime
      );
    }

    await client.query('COMMIT');
    res.json({ message: `${assignCount} vendors auto-assigned and notified via email.` });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('🔥Auto-assign error:', err);
    res.status(500).json({ error: 'Auto-assignment failed', details: err.message });
  } finally {
    client.release();
  }
});

// ========== FETCH PUBLIC PROFILE BY ROLE ==========
app.get('/api/profile/public', async (req, res) => {
  const { email, role } = req.query;

  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required' });
  }

  try {
    if (role === 'Organizer') {
      const result = await pool.query(`
        SELECT organizeremail AS email, organizationname AS name, contactnum, profilepic,
               facebooklink, instagramlink, tiktoklink, websitelink, aboutus
        FROM eventorganizer WHERE organizeremail = $1
      `, [email]);

      if (result.rows.length === 0)
        return res.status(404).json({ error: 'Organizer not found' });

      return res.json({ ...result.rows[0], role });
    }

    if (role === 'Vendor') {
      const result = await pool.query(`
        SELECT vendoremail AS email, vendorname AS name, contactnum, profilepic,
               facebooklink, instagramlink, tiktoklink, websitelink, aboutus
        FROM vendor WHERE vendoremail = $1
      `, [email]);

      if (result.rows.length === 0)
        return res.status(404).json({ error: 'Vendor not found' });

      return res.json({ ...result.rows[0], role });
    }

    return res.status(400).json({ error: 'Invalid role' });
  } catch (err) {
    console.error('Fetch public profile error:', err);
    return res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
});



// ========== START SERVER ==========
app.listen(3000, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
