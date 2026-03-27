const User = require('../models/User');
const jwt  = require('jsonwebtoken');

const genToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });
    const user  = await User.create({ name, email, password, phone, address });
    const token = genToken(user._id);
    res.status(201).json({ success: true, message: 'Registration successful', token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, address: user.address } });
  } catch (err) { next(err); }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = genToken(user._id);
    res.json({ success: true, message: 'Login successful', token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, address: user.address } });
  } catch (err) { next(err); }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) { next(err); }
};
