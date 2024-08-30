// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/submit', [
  check('firstName').not().isEmpty().withMessage('First name is required'),
  check('lastName').not().isEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
  check('message').not().isEmpty().withMessage('Message is required'),
], (req, res) => {
  // Validate data
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Data is valid; process the request
  const { firstName, lastName, email, phone, message } = req.body;

  // Here, you can add code to save the data to a database or send an email

  res.status(200).json({ result: 'success', message: 'Message sent successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
