const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendAutoReply = async (req, res) => {
  const { name, email } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Thank you for contacting me!',
    text: `Hi ${name},\n\nThanks for visiting my page. I’ll get back to you soon!\n\n- Portfolio Owner`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Auto-reply sent successfully' });
  } catch (error) {
    console.error('Error sending auto-reply email:', error);
    res.status(500).json({ success: false, message: 'Failed to send auto-reply' });
  }
};

module.exports = sendAutoReply;
