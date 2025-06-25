import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// app.post('/send-email', async (req, res) => {
//   const {
//     user_name,
//     user_email,
//     user_location,
//     user_date,
//     user_time,
//   } = req.body;

//   console.log("req.body",req.body)

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: user_email,
//     subject: 'Plasma Donation Appointment Confirmation',
//     html: `
//       <h2>Thank you, ${user_name}!</h2>
//       <p>Your plasma donation appointment is confirmed with the following details:</p>
//       <ul>
//         <li><strong>Location:</strong> ${user_location}</li>
//         <li><strong>Date:</strong> ${user_date}</li>
//         <li><strong>Time:</strong> ${user_time}</li>
//       </ul>
//       <p>We appreciate your contribution to saving lives! 💙</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ success: true, message: 'Email sent successfully' });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ success: false, error: 'Failed to send email' });
//   }
// });

app.post('/send-email', async (req, res) => {
  const {
    to,
    subject,
    name,
    phone,
    donorStatus,
    location,
    preferredDate,
    preferredTime
  } = req.body;

  console.log("req.body", req.body); // For debugging

  // Build the HTML email body using dynamic data
  const beautifiedBody = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <p>Hi ${name || 'Donor'},</p>
      <p>Thank you for reaching out to <strong>CarePlasma</strong>. Your appointment has been scheduled.</p>
      <p><strong>Here are your appointment details:</strong></p>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Donor Status:</td><td style="padding: 8px;">${donorStatus}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Preferred Location:</td><td style="padding: 8px;">${location}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Preferred Date:</td><td style="padding: 8px;">${preferredDate}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Preferred Time:</td><td style="padding: 8px;">${preferredTime}</td></tr>
      </table>
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br><strong>CarePlasma Team</strong></p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: beautifiedBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
