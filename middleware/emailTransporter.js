const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables (optional)

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email from environment variables
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuring email transporter:', error);
  } else {
    console.log('Email transporter is ready to send messages.');
  }
});

module.exports = transporter;
