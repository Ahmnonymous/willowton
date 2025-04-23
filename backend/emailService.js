// backend/emailService.js
const nodemailer = require('nodemailer');

// Set up SES SMTP transport
const transporter = nodemailer.createTransport({
  host: 'email.af-south-1.amazonaws.com', // SES SMTP endpoint for South Africa
  port: 587,
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USERNAME, // SES SMTP username
    pass: process.env.SES_SMTP_PASSWORD, // SES SMTP password
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'communication@willowtonbursary.co.za', // Your verified SES email
    to: to,
    subject: subject,
    text: text,
    // attachments: attachments, // Optional: Array of attachment objects
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error sending email' };
  }
};

module.exports = { sendEmail };
