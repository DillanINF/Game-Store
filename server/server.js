const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // agar bisa diakses dari frontend React

app.post('/api/checkout', async (req, res) => {
  const { email, name, address } = req.body;

  // Ganti dengan email dan App Password Gmail kamu
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourgmail@gmail.com',      // GANTI dengan email pengirim
      pass: 'yourapppassword',          // GANTI dengan App Password Gmail
    },
  });

  try {
    await transporter.sendMail({
      from: '"GameStore" <yourgmail@gmail.com>', // GANTI juga di sini
      to: email,
      subject: 'Order Confirmation',
      text: `Terima kasih, ${name}, pesananmu sudah diterima!`,
      html: `<b>Terima kasih, ${name}</b><br>Pesananmu sudah diterima!<br>Alamat: ${address}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
