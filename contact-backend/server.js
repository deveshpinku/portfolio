const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const whatsappRoutes = require('./routes/whatsapp');
const autoReplyRoutes = require('./routes/autoReply');  // ✅ import autoReply route
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();

app.use(cors());
app.use(express.json());

// ✅ Route Setup
app.use('/api/contact', contactRoutes);
app.use('/api', whatsappRoutes);
app.use('/api', autoReplyRoutes);  // ✅ this handles /api/send-auto-reply

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
