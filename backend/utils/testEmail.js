/**
 * Run this file to test your Gmail config BEFORE starting the server
 * Command: node utils/testEmail.js
 */
// CORRECT
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const nodemailer = require("nodemailer");

const test = async () => {
  console.log("Testing Gmail config...");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS
      ? "✅ Set (" + process.env.EMAIL_PASS.length + " chars)"
      : "❌ NOT SET",
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Gmail connection successful! OTP emails will work.");
  } catch (err) {
    console.error("❌ Gmail connection failed:", err.message);
    console.log("\n📋 How to fix:");
    console.log("1. Go to https://myaccount.google.com/security");
    console.log("2. Turn ON 2-Step Verification");
    console.log("3. Go to https://myaccount.google.com/apppasswords");
    console.log("4. App = Mail, Device = Other → name it ServiceMate");
    console.log("5. Copy the 16-char password into .env as EMAIL_PASS");
    console.log("6. Make sure there are NO spaces in the password");
  }
};

test();
