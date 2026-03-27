const User        = require('../models/User')
const Provider    = require('../models/Provider')
const OTP         = require('../models/OTP')
const bcrypt      = require('bcryptjs')
const sendEmail   = require('../utils/sendEmail')
const otpTemplate = require('../utils/otpTemplate')

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

// ─── STEP 1: Send OTP ─────────────────────────────────────────────────────────
exports.sendOTP = async (req, res, next) => {
  try {
    const { email, role } = req.body

    if (!email || !role)
      return res.status(400).json({ success: false, message: 'Email and role are required' })

    const account = role === 'user'
      ? await User.findOne({ email })
      : await Provider.findOne({ email })

    if (!account)
      return res.status(404).json({ success: false, message: 'No account found with this email' })

    await OTP.deleteMany({ email, role })

    const otp       = generateOTP()
    const hashedOTP = await bcrypt.hash(otp, 10)

    await OTP.create({ email, otp: hashedOTP, role })

    try {
      await sendEmail({
        to:      email,
        subject: 'ServiceMate — Password Reset OTP',
        html:    otpTemplate(otp, account.name),
      })
    } catch (emailErr) {
      await OTP.deleteMany({ email, role })
      return res.status(500).json({
        success: false,
        message: 'Could not send OTP email. Please check your Gmail App Password in the backend .env file.',
      })
    }

    res.json({ success: true, message: `OTP sent to ${email}` })
  } catch (err) {
    next(err)
  }
}

// ─── STEP 2: Verify OTP ───────────────────────────────────────────────────────
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, role } = req.body

    if (!email || !otp || !role)
      return res.status(400).json({ success: false, message: 'Email, OTP, and role are required' })

    const otpRecord = await OTP.findOne({ email, role })

    if (!otpRecord)
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new one.' })

    const isMatch = await bcrypt.compare(otp, otpRecord.otp)

    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' })

    res.json({ success: true, message: 'OTP verified successfully' })
  } catch (err) {
    next(err)
  }
}

// ─── STEP 3: Reset Password ───────────────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, role, newPassword } = req.body

    if (!email || !otp || !role || !newPassword)
      return res.status(400).json({ success: false, message: 'All fields are required' })

    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })

    const otpRecord = await OTP.findOne({ email, role })

    if (!otpRecord)
      return res.status(400).json({ success: false, message: 'OTP expired. Please start over.' })

    const isMatch = await bcrypt.compare(otp, otpRecord.otp)

    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid OTP.' })

    if (role === 'user') {
      const user = await User.findOne({ email })
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      user.password = newPassword
      await user.save()
    } else {
      const provider = await Provider.findOne({ email })
      if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' })
      provider.password = newPassword
      await provider.save()
    }

    await OTP.deleteMany({ email, role })

    res.json({ success: true, message: 'Password reset successfully! You can now login.' })
  } catch (err) {
    next(err)
  }
}
