const Booking = require('../models/booking');
const Flight = require('../models/flight');
const User = require('../models/user');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createBooking = async (req, res) => {
    try {
        const { flightId } = req.body;

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
            passenger: req.user.id,
            seatNumber: (flight.passengers.length + 1).toString(),
        });

        flight.passengers.push(req.user.id);
        flight.availableSeats -= 1;
        await flight.save();

        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { bookings: booking._id } },
            { new: true }
        );

        return sendSuccess(res, 201, booking);
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ passenger: req.user.id })
            .populate('flight')
            .populate('passenger');
        return sendSuccess(res, 200, bookings);
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('flight')
            .populate('passenger');
        if (!booking) {
            return sendError(res, 404, new Error('Booking not found.'));
        }
        return sendSuccess(res, 200, booking);
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.bookingId);

        if (!booking) {
            return sendError(res, 404, new Error('Booking not found.'));
        }
        return sendSuccess(res, 200, booking);
    } catch (error) {
        return sendError(res, 500, error);
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    deleteBooking,
};

