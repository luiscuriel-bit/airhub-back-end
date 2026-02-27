import mongoose, { Schema, Document, mongo } from 'mongoose';

export interface IBooking extends Document {
    flight: mongoose.Types.ObjectId;
    passenger: mongoose.Types.ObjectId;
    seatNumber: string;
    status: 'confirmed' | 'canceled';
};

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
        trim: true,
    },
    status: {
        type: String,
        enum: ['confirmed', 'canceled'],
        default: 'confirmed',
    },
}, {
    timestamps: true
});

export default mongoose.model<IBooking>('Booking', bookingSchema);