const Booking  = require('../models/Booking')
const Provider = require('../models/Provider')

exports.createBooking = async (req, res, next) => {
  try {
    const { providerId, description, scheduledDate, scheduledTime, address, notes } = req.body
    const provider = await Provider.findById(providerId)
    if (!provider) return res.status(404).json({ success:false, message:'Provider not found' })

    // Check provider subscription
    if (provider.subscription?.status !== 'active') {
      return res.status(403).json({ success:false, message:'This provider has not activated their subscription yet. Please try another provider.' })
    }

    const booking = await Booking.create({
      user: req.user._id, provider: providerId,
      serviceCategory: provider.serviceCategory,
      description, scheduledDate, scheduledTime, address, notes,
    })
    await Provider.findByIdAndUpdate(providerId, { $push: { bookings: booking._id } })
    res.status(201).json({ success:true, booking })
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
    if (status === 'completed') {
      if (totalAmount) booking.totalAmount = Number(totalAmount)
      if (hoursWorked) booking.hoursWorked = Number(hoursWorked)
      booking.receiptGenerated = true
    }
    await booking.save()
    res.json({ success:true, booking })
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
    res.json({ success:true, booking })
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
    res.json({ success:true, booking })
  } catch (err) { next(err) }
}

// ── REVIEWS ──────────────────────────────────────────────────────────────
exports.addOrUpdateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ success:false, message:'Booking not found' })
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Not authorized' })
    if (booking.status !== 'completed')
      return res.status(400).json({ success:false, message:'Can only review completed bookings' })

    const isUpdate = !!booking.review?.rating
    booking.review = {
      rating, comment,
      createdAt: booking.review?.createdAt || new Date(),
      updatedAt: new Date(),
    }
    await booking.save()

    // Recalculate provider rating
    const allBookings = await Booking.find({ provider: booking.provider, 'review.rating': { $exists: true } })
    const avg = allBookings.reduce((s,b) => s + b.review.rating, 0) / allBookings.length
    await Provider.findByIdAndUpdate(booking.provider, {
      'rating.average': parseFloat(avg.toFixed(1)),
      'rating.count':   allBookings.length,
    })

    res.json({ success:true, message: isUpdate ? 'Review updated' : 'Review submitted', booking })
  } catch (err) { next(err) }
}

exports.deleteReview = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ success:false, message:'Booking not found' })
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Not authorized' })

    booking.review = undefined
    await booking.save()

    // Recalculate rating
    const allBookings = await Booking.find({ provider: booking.provider, 'review.rating': { $exists: true } })
    const avg = allBookings.length ? allBookings.reduce((s,b) => s + b.review.rating, 0) / allBookings.length : 0
    await Provider.findByIdAndUpdate(booking.provider, {
      'rating.average': parseFloat(avg.toFixed(1)),
      'rating.count':   allBookings.length,
    })

    res.json({ success:true, message:'Review deleted', booking })
  } catch (err) { next(err) }
}

// ── DELETE HISTORY ────────────────────────────────────────────────────────
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ success:false, message:'Booking not found' })

    const isUser     = booking.user.toString()     === req.user._id.toString()
    const isProvider = booking.provider.toString() === req.user._id.toString()
    if (!isUser && !isProvider)
      return res.status(403).json({ success:false, message:'Not authorized' })

    // Only allow deleting completed/cancelled bookings
    if (!['completed','cancelled','rejected'].includes(booking.status))
      return res.status(400).json({ success:false, message:'Can only delete completed or cancelled bookings' })

    await Booking.findByIdAndDelete(req.params.id)
    res.json({ success:true, message:'Booking deleted' })
  } catch (err) { next(err) }
}

exports.deleteAllHistory = async (req, res, next) => {
  try {
    const role = req.user.role
    const query = role === 'provider'
      ? { provider: req.user._id, status: { $in: ['completed','cancelled','rejected'] } }
      : { user:     req.user._id, status: { $in: ['completed','cancelled','rejected'] } }

    const result = await Booking.deleteMany(query)
    res.json({ success:true, message:`${result.deletedCount} bookings deleted` })
  } catch (err) { next(err) }
}
