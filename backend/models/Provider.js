const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const providerSchema = new mongoose.Schema(
  {
    name:            { type: String,  required: true, trim: true, maxlength: 50 },
    email:           { type: String,  required: true, unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password:        { type: String,  required: true, minlength: 6, select: false },
    phone:           { type: String,  required: true, trim: true },
    serviceCategory: { type: String,  required: true, enum: ['Electrician','Plumber','Carpenter','Painter','Cleaner','AC Technician','Mechanic','Mason','Gardener','Security Guard','Other'] },
    experience:      { type: Number,  required: true, min: 0 },
    hourlyRate:      { type: Number,  required: true, min: 0 },
    bio:             { type: String,  maxlength: 500 },
    avatar:          { type: String,  default: '' },
    address:         { street: String, city: { type: String, required: true }, state: { type: String, required: true }, pincode: String },
    skills:          [String],
    rating:          { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    isVerified:      { type: Boolean, default: false },
    isAvailable:     { type: Boolean, default: true },
    role:            { type: String,  enum: ['provider'], default: 'provider' },
    bookings:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    isActive:        { type: Boolean, default: true },
  },
  { timestamps: true }
);

providerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

providerSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Provider', providerSchema);
