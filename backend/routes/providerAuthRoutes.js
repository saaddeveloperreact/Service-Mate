const express = require('express');
const router  = express.Router();
const { registerProvider, loginProvider, getProviderProfile, updateProviderProfile } = require('../controllers/providerAuthController');
const { protect, authorizeProvider } = require('../middleware/auth');

router.post('/register', registerProvider);
router.post('/login',    loginProvider);
router.get ('/me',       protect, authorizeProvider, getProviderProfile);
router.put ('/me',       protect, authorizeProvider, updateProviderProfile);

module.exports = router;
