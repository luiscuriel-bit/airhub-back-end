const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        unique: true,
    },
    origin: {
        type: String,
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        required: true,
        trim: true,
    },
    departureTime: {
        type: Date,
        required: true,
    },
    arrivalTime: {
        type: Date,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 0,
        max: 1000,
    },
    status: {
        type: String,
        enum: ['scheduled', 'delayed', 'canceled', 'completed'],
        default: 'scheduled',
    },
    price: {
        type: Number,
        required: true,
    },
    passengers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;