const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const Provider = require('../models/Provider');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];

  if (!token)
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    let account = await User.findById(id);
    if (!account) account = await Provider.findById(id);
    if (!account) return res.status(401).json({ success: false, message: 'Account not found' });
    req.user = account;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const authorizeUser     = (req, res, next) => req.user.role === 'user'     ? next() : res.status(403).json({ success: false, message: 'Users only' });
const authorizeProvider = (req, res, next) => req.user.role === 'provider' ? next() : res.status(403).json({ success: false, message: 'Providers only' });

module.exports = { protect, authorizeUser, authorizeProvider };
