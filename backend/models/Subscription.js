const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema(
  {
    provider:   { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    plan:       { type: String, enum: ['monthly','quarterly','biannual'], required: true },
    amount:     { type: Number, required: true },
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    status:     { type: String, enum: ['pending','active','expired'], default: 'pending' },
    startDate:  { type: Date },
    endDate:    { type: Date },
    durationMonths: { type: Number },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Subscription', subscriptionSchema)
