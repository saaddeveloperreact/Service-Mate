const express = require('express')
const router  = express.Router()
const { createOrder, verifyPayment, getSubscription } = require('../controllers/subscriptionController')
const { protect, authorizeProvider } = require('../middleware/auth')

router.post('/create-order',   protect, authorizeProvider, createOrder)
router.post('/verify-payment', protect, authorizeProvider, verifyPayment)
router.get ('/status',         protect, authorizeProvider, getSubscription)

module.exports = router
