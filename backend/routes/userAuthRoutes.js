const express = require('express');
const router  = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userAuthController');
const { protect, authorizeUser } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login',    loginUser);
router.get ('/me',       protect, authorizeUser, getUserProfile);
router.put ('/me',       protect, authorizeUser, updateUserProfile);

module.exports = router;
