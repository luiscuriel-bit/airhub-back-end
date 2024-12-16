const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    },
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seatNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed', 'canceled'],
        default: 'confirmed',
    },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;