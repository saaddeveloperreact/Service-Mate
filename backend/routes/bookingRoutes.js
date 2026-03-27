const express = require('express');
const router  = express.Router();
const { createBooking, getUserBookings, getProviderBookings, updateBookingStatus, cancelBooking, addReview } = require('../controllers/bookingController');
const { protect, authorizeUser, authorizeProvider } = require('../middleware/auth');

router.post('/',               protect, authorizeUser,     createBooking);
router.get ('/my',             protect, authorizeUser,     getUserBookings);
router.get ('/provider',       protect, authorizeProvider, getProviderBookings);
router.put ('/:id/status',     protect, authorizeProvider, updateBookingStatus);
router.put ('/:id/cancel',     protect, authorizeUser,     cancelBooking);
router.post('/:id/review',     protect, authorizeUser,     addReview);

module.exports = router;
