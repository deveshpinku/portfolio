const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // install with npm i node-fetch@2 if Node <18

const ACCESS_TOKEN = 'YOUR_META_WHATSAPP_ACCESS_TOKEN';  // Replace with your token
const PHONE_NUMBER_ID = '657846974074748';                // Your Phone Number ID

router.post('/send-whatsapp', async (req, res) => {
  const { whatsapp, name } = req.body;

  if (!whatsapp || !name) {
    return res.status(400).json({ error: 'Missing WhatsApp number or name' });
  }

  // Add country code if missing
  const toNumber = whatsapp.startsWith('91') ? whatsapp : '91' + whatsapp;

  const messageData = {
    messaging_product: 'whatsapp',
    to: toNumber,
    type: 'text',
    text: { body: `Hello ${name}, thank you for contacting us!` },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v15.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ message: 'WhatsApp message sent', data });
    } else {
      res.status(500).json({ error: data.error || 'Failed to send message' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
