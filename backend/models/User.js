const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: [true, 'Name is required'],  trim: true, maxlength: 50 },
    email:    { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, required: [true, 'Password required'], minlength: 6, select: false },
    phone:    { type: String, trim: true },
    address:  { street: String, city: String, state: String, pincode: String },
    avatar:   { type: String, default: '' },
    role:     { type: String, enum: ['user'], default: 'user' },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
