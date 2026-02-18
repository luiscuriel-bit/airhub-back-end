import mongoose, { Schema, Document } from 'mongoose';

export interface IFlight extends Document {
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    availableSeats: number;
    status: 'scheduled' | 'delayed' | 'canceled' | 'completed';
    price: number;
    passengers: mongoose.Types.ObjectId[];
    staff: mongoose.Types.ObjectId[];
};

const flightSchema: Schema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        trim: true,
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
        min: 0,
    },
    passengers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    staff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true,
});

export default mongoose.model<IFlight>('Flight', flightSchema);