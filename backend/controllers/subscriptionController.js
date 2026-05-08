const Razorpay     = require('razorpay')
const crypto       = require('crypto')
const Subscription = require('../models/Subscription')
const Provider     = require('../models/Provider')

const PLANS = {
  monthly:   { amount: 40000,  months: 1,  label: '1 Month'  },  // paise
  quarterly: { amount: 70000,  months: 3,  label: '3 Months' },
  biannual:  { amount: 120000, months: 6,  label: '6 Months' },
}

const getRazorpay = () => new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Create Razorpay order
exports.createOrder = async (req, res, next) => {
  try {
    const { plan } = req.body
    if (!PLANS[plan]) return res.status(400).json({ success:false, message:'Invalid plan' })

    const { amount, label } = PLANS[plan]
    const razorpay = getRazorpay()
    const order    = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt:  `sub_${req.user._id}_${Date.now()}`,
      notes:    { provider: req.user._id.toString(), plan },
    })

    res.json({ success:true, order, plan, amount: amount / 100, label,
      key: process.env.RAZORPAY_KEY_ID })
  } catch (err) { next(err) }
}

// Verify payment & activate subscription
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body

    const body      = razorpay_order_id + '|' + razorpay_payment_id
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature)
      return res.status(400).json({ success:false, message:'Payment verification failed' })

    const { months } = PLANS[plan]
    const startDate  = new Date()
    const endDate    = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + months)

    // Save subscription record
    const sub = await Subscription.create({
      provider:          req.user._id,
      plan,
      amount:            PLANS[plan].amount / 100,
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status:            'active',
      startDate,
      endDate,
      durationMonths:    months,
    })

    // Update provider subscription status
    await Provider.findByIdAndUpdate(req.user._id, {
      subscription: { status: 'active', plan, endDate },
    })

    res.json({ success:true, message:'Subscription activated!', subscription: sub })
  } catch (err) { next(err) }
}

// Get current subscription status
exports.getSubscription = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user._id)
    const latest   = await Subscription.findOne({ provider: req.user._id }).sort({ createdAt: -1 })

    // Auto-expire if past endDate
    if (provider.subscription?.endDate && new Date() > provider.subscription.endDate) {
      await Provider.findByIdAndUpdate(req.user._id, { 'subscription.status': 'expired' })
      provider.subscription.status = 'expired'
    }

    res.json({ success:true, subscription: provider.subscription, latest })
  } catch (err) { next(err) }
}
