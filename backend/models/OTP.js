const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  otp:       { type: String, required: true },
  role:      { type: String, enum: ['user', 'provider'], required: true },
  createdAt: { type: Date,   default: Date.now, expires: 600 }, // auto-delete after 10 mins
})

module.exports = mongoose.model('OTP', otpSchema)
