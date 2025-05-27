const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const axios = require('axios');
require('dotenv').config(); // Load .env

const YAKITA_API_URL = process.env.YAKITA_API_URL;
const YAKITA_API_KEY = process.env.YAKITA_API_KEY;

router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    // ✅ Send WhatsApp message
    const whatsappResponse = await axios.post(
      YAKITA_API_URL,
      {
        phone: `91${req.body.whatsapp}`, // Assuming `whatsapp` field is passed
        message: `Hi ${req.body.name}, thank you for contacting us!`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${YAKITA_API_KEY}`,
        },
      }
    );

    res.status(200).json({ message: 'Message sent successfully', whatsapp: whatsappResponse.data });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
});

module.exports = router;
