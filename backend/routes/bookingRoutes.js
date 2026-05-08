const express = require('express')
const router  = express.Router()
const {
  createBooking, getUserBookings, getProviderBookings,
  updateBookingStatus, cancelBooking, markPaymentDone,
  addOrUpdateReview, deleteReview, deleteBooking, deleteAllHistory,
} = require('../controllers/bookingController')
const { protect, authorizeUser, authorizeProvider } = require('../middleware/auth')

router.post('/',                    protect, authorizeUser,     createBooking)
router.get ('/my',                  protect, authorizeUser,     getUserBookings)
router.get ('/provider',            protect, authorizeProvider, getProviderBookings)
router.put ('/:id/status',          protect, authorizeProvider, updateBookingStatus)
router.put ('/:id/cancel',          protect, authorizeUser,     cancelBooking)
router.put ('/:id/payment',         protect, authorizeUser,     markPaymentDone)
router.post('/:id/review',          protect, authorizeUser,     addOrUpdateReview)
router.delete('/:id/review',        protect, authorizeUser,     deleteReview)
router.delete('/history/all',       protect,                    deleteAllHistory)
router.delete('/:id',               protect,                    deleteBooking)

module.exports = router
