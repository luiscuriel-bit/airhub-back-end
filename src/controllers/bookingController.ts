import { Request, Response } from 'express';
import Booking from '../models/booking';
import Flight from '../models/flight';
import User from '../models/user';
import { sendSuccess, sendError } from '../utils/responseHandler';

const createBooking = async (req: Request, res: Response) => {
    const { flightId } = (req as any).body;

    if (!flightId) {
        return sendError(res, 400, new Error('Flight ID is required.'));
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
        return sendError(res, 404, new Error('Flight not found.'));
    }

    if (flight.availableSeats <= 0) {
        return sendError(res, 409, new Error('No available seats on this flight.'));
    }

    const booking = await Booking.create({
        flight: flight._id,
        passenger: (req as any).user._id,
        seatNumber: (flight.passengers.length + 1).toString(),
    });

    flight.passengers.push((req as any).user._id);
    flight.availableSeats -= 1;
    await flight.save();

    req.app.get('io').emit('flight:updated', flight);

    await User.findByIdAndUpdate(
        (req as any).user._id,
        { $push: { bookings: booking._id } },
        { new: true }
    );

    return sendSuccess(res, 201, booking);
};

const getAllBookings = async (req: Request, res: Response) => {
    const bookings = await Booking.find({ passenger: (req as any).user._id })
        .populate('flight')
        .populate('passenger');
    return sendSuccess(res, 200, bookings);
};

const getBookingById = async (req: Request, res: Response) => {
    const booking = await Booking.findById((req as any).params.bookingId)
        .populate('flight')
        .populate('passenger');
    if (!booking) {
        return sendError(res, 404, new Error('Booking not found.'));
    }
    return sendSuccess(res, 200, booking);
};

const deleteBooking = async (req: Request, res: Response) => {
    const booking = await Booking.findByIdAndDelete((req as any).params.bookingId);

    if (!booking) {
        return sendError(res, 404, new Error('Booking not found.'));
    }
    return sendSuccess(res, 200, booking);
};

export {
    createBooking,
    getAllBookings,
    getBookingById,
    deleteBooking,
};