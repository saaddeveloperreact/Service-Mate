const Provider = require('../models/Provider')
const jwt      = require('jsonwebtoken')

const genToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

const providerFields = p => ({
  _id: p._id, name: p.name, email: p.email, phone: p.phone,
  serviceCategory: p.serviceCategory, experience: p.experience,
  rateMin: p.rateMin, rateMax: p.rateMax,
  role: p.role, avatar: p.avatar, address: p.address,
  isVerified: p.isVerified, isAvailable: p.isAvailable, rating: p.rating,
  bio: p.bio, skills: p.skills,
})

exports.registerProvider = async (req, res, next) => {
  try {
    const { name, email, password, phone, serviceCategory, experience, rateMin, rateMax, bio, address, skills } = req.body
    if (await Provider.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' })
    const provider = await Provider.create({
      name, email, password, phone, serviceCategory, experience, rateMin, rateMax, bio, address,
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
    })
    const token = genToken(provider._id)
    res.status(201).json({ success: true, message: 'Provider registered successfully', token, provider: providerFields(provider) })
  } catch (err) { next(err) }
}

exports.loginProvider = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' })
    const provider = await Provider.findOne({ email }).select('+password')
    if (!provider || !(await provider.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    const token = genToken(provider._id)
    res.json({ success: true, message: 'Login successful', token, provider: providerFields(provider) })
  } catch (err) { next(err) }
}

exports.getProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user._id)
    res.json({ success: true, provider })
  } catch (err) { next(err) }
}

exports.updateProviderProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, rateMin, rateMax, skills, isAvailable, address } = req.body
    const provider = await Provider.findByIdAndUpdate(
      req.user._id,
      { name, phone, bio, rateMin, rateMax, isAvailable, address, ...(skills && { skills: skills.split(',').map(s => s.trim()) }) },
      { new: true, runValidators: true }
    )
    res.json({ success: true, message: 'Profile updated', provider })
  } catch (err) { next(err) }
}
