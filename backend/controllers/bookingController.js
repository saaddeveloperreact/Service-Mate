const Booking  = require('../models/Booking')
const Provider = require('../models/Provider')
const Review   = require('../models/Review')

exports.createBooking = async (req, res, next) => {
  try {
    const { providerId, description, scheduledDate, scheduledTime, address, notes } = req.body
    const provider = await Provider.findById(providerId)
    if (!provider) return res.status(404).json({ success:false, message:'Provider not found' })
    const booking = await Booking.create({
      user: req.user._id, provider: providerId, serviceCategory: provider.serviceCategory,
      description, scheduledDate, scheduledTime, address, notes,
    })
    await Provider.findByIdAndUpdate(providerId, { $push: { bookings: booking._id } })
    res.status(201).json({ success:true, message:'Booking request sent!', booking })
  } catch (err) { next(err) }
}

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('provider', 'name serviceCategory avatar phone rating rateMin rateMax')
      .sort({ createdAt: -1 })
    res.json({ success:true, bookings })
  } catch (err) { next(err) }
}

exports.getProviderBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate('user', 'name phone email avatar')
      .sort({ createdAt: -1 })
    res.json({ success:true, bookings })
  } catch (err) { next(err) }
}

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, totalAmount, hoursWorked } = req.body
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ success:false, message:'Booking not found' })
    if (booking.provider.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Not authorized' })

    booking.status = status

    // When accepted → generate UPI QR string
    if (status === 'accepted') {
      const provider = await Provider.findById(booking.provider)
      const upiId    = process.env.UPI_ID || `${provider.name.replace(/\s+/g,'').toLowerCase()}@upi`
      const amount   = provider.rateMin  // use minimum rate as initial QR amount
      booking.qrCode = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(provider.name)}&am=${amount}&cu=INR&tn=${encodeURIComponent('ServiceMate - ' + booking.serviceCategory)}`
    }

    // When completed → save total
    if (status === 'completed') {
      if (totalAmount) booking.totalAmount    = Number(totalAmount)
      if (hoursWorked) booking.hoursWorked    = Number(hoursWorked)
      booking.receiptGenerated = true
    }

    await booking.save()
    res.json({ success:true, message:'Booking updated', booking })
  } catch (err) { next(err) }
}

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ success:false, message:'Booking not found' })
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Not authorized' })
    booking.status = 'cancelled'
    await booking.save()
    res.json({ success:true, message:'Booking cancelled', booking })
  } catch (err) { next(err) }
}

exports.markPaymentDone = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ success:false, message:'Booking not found' })
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Not authorized' })
    booking.paymentStatus = 'paid'
    await booking.save()
    res.json({ success:true, message:'Payment marked as done', booking })
  } catch (err) { next(err) }
}

exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ success:false, message:'Booking not found' })
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Not authorized' })
    if (booking.status !== 'completed')
      return res.status(400).json({ success:false, message:'Can only review completed bookings' })
    const review = await Review.create({ booking: booking._id, user: req.user._id, provider: booking.provider, rating, comment })
    booking.review = { rating, comment, createdAt: new Date() }
    await booking.save()
    const reviews = await Review.find({ provider: booking.provider })
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    await Provider.findByIdAndUpdate(booking.provider, {
      'rating.average': parseFloat(avg.toFixed(1)),
      'rating.count':   reviews.length,
    })
    res.status(201).json({ success:true, message:'Review submitted', review })
  } catch (err) { next(err) }
}
