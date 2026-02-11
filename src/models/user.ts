import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'admin' | 'staff' | 'passenger';
    assignedFlights: mongoose.Types.ObjectId[];
    bookings: mongoose.Types.ObjectId[];
};

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'passenger'],
        default: 'passenger'
    },
    assignedFlights: [{
        type: Schema.Types.ObjectId,
        ref: 'Flight',
    }],
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking',
    }],
},
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
    }
);

export default mongoose.model<IUser>('User', userSchema);