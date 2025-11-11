const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingType: {
    type: String,
    required: true,
    enum: ['hotel', 'restaurant', 'flight', 'bus'],
  },
  details: mongoose.Schema.Types.Mixed, // Flexible field for any booking details
  isPaid: {
    type: Boolean,
    default: false,
  },
  confirmationCode: String,
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);