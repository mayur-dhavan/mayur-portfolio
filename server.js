const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a route to handle form submissions
app.post('/', (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // Configure the email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mayurdhavan2244@gmail.com', // Your email address
      pass: 'xyic gomi qdbw mvrf'   // Your email password
    }
  });

  // Email options
  const mailOptions = {
    from: email,
    to: 'mayurdhavan2244@gmail.com', 
    subject: 'Contact Form Submission',
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ result: 'error', message: 'Failed to send message.' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ result: 'success', message: 'Message sent successfully.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
