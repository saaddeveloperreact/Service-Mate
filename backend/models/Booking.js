const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true },
    provider:        { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    serviceCategory: { type: String, required: true },
    description:     { type: String, required: true, maxlength: 500 },
    scheduledDate:   { type: Date,   required: true },
    scheduledTime:   { type: String, required: true },
    address:         { street: String, city: String, state: String, pincode: String },
    status:          { type: String, enum: ['pending','accepted','rejected','in-progress','completed','cancelled'], default: 'pending' },
    totalAmount:     { type: Number, default: 0 },
    hoursWorked:     { type: Number, default: 0 },
    review:          { rating: { type: Number, min:1, max:5 }, comment: { type: String, maxlength: 300 }, createdAt: Date },
    paymentStatus:   { type: String, enum: ['unpaid','paid'], default: 'unpaid' },
    notes:           { type: String, maxlength: 300 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
