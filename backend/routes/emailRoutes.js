// backend/routes/emailRoutes.js
const express = require('express');
const { sendEmail } = require('../emailService');
const router = express.Router();

// Endpoint to send email
router.post('/send-email', async (req, res) => {
  const { to, subject, text, attachments } = req.body;

  const result = await sendEmail(to, subject, text, attachments);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(500).json({ message: result.message });
  }
});

module.exports = router;
