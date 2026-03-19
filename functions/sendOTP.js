const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin securely (Supports Vercel / Cloud Env variables)
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    serviceAccount = require('./serviceAccountKey.json');
  }
} catch (error) {
  console.warn('⚠️ Warning: Firebase Service Account could not be loaded from env or file.');
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  // Fallback for default cloud environment
  admin.initializeApp();
}

// Create transporter using Gmail (you can change to any SMTP service)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password'    // Replace with your app password
  },
});

exports.sendOTP = functions.https.onCall(async (data, context) => {
  const { to, otp, name } = data;

  try {
    console.log(`Sending OTP to ${to}: ${otp}`);

    const mailOptions = {
      from: '"Naga Balaji Tiffin" <your-email@gmail.com>',
      to: to,
      subject: 'Your OTP Code for Naga Balaji Tiffin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0 0 20px 0; font-size: 24px;">🍱 Naga Balaji Tiffin</h1>
            <h2 style="margin: 0 0 10px 0; font-size: 18px;">Your OTP Code</h2>
            <div style="background: white; color: #10b981; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 3px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="margin: 20px 0 0 0; color: #6b7280;">This code will expire in 10 minutes.</p>
            <p style="margin: 0; color: #9ca3af; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">Best regards,<br/>Team Naga Balaji Tiffin</p>
            </div>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Log to Firestore for tracking
    await admin.firestore().collection('email_logs').add({
      to: to,
      otp: otp,
      name: name,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'sent'
    });

    console.log('Email sent successfully to:', to);
    return { success: true, message: 'OTP sent successfully' };

  } catch (error) {
    console.error('Error sending email:', error);

    // Log error
    await admin.firestore().collection('email_logs').add({
      to: to,
      error: error.message,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed'
    });

    return { success: false, message: 'Failed to send OTP' };
  }
});
