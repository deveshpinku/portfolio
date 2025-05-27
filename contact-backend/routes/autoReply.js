// routes/autoReply.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/send-auto-reply', async (req, res) => {
  const { name, email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,  // Make sure this is set in your .env
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Thank you for contacting us!',
    text: `Hi ${name},\n\nThanks for visiting my page! I will get back to you soon.\n\nBest regards,\nYour Name`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Auto-reply sent.' });
  } catch (error) {
    console.error('❌ Error sending auto-reply:', error);
    res.status(500).json({ success: false, message: 'Failed to send auto-reply.' });
  }
});

module.exports = router;
