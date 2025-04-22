const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

// Optional: Load from .env if you set it up that way
// require('dotenv').config();

const app = express();
const port = 4000;

// Replace these with your actual Twilio credentials
const accountSid = '';
const authToken = '';
const fromPhone = '';

const client = twilio(accountSid, authToken);

app.use(bodyParser.json());

app.post('/sms-webhook', async (req, res) => {
  try {
    const document = req.body?.payload;

    if (!document) {
      console.log("No payload found in webhook.");
      return res.status(400).send('Invalid webhook data');
    }

    const {
      contact_name,
      contact_phone,
      medicine_name,
      user_name,
      date
    } = document;

    const message = `📢 from MedTracker ${contact_name}, ${medicine_name} was taken by ${user_name} on ${date}.`;

    console.log("Sending SMS to:", contact_phone);
    console.log("Message:", message);

    await client.messages.create({
      body: message,
      from: fromPhone,
      to: contact_phone
    });

    console.log("✅ SMS sent successfully");
    res.status(200).send('SMS sent successfully');
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    res.status(500).send('Failed to send SMS');
  }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`📡 Webhook server listening at http://0.0.0.0:${port}/sms-webhook`);
  });
