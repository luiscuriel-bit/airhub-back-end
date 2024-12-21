const Booking = require('../models/booking');
const Flight = require('../models/flight');
const User = require('../models/user');

// Create a New Booking
const createBooking = async (req, res) => {
    try {
        if (!req.body.availableSeats) {
            return res.status(409).json(({ message: 'No available seats' }));
        }

        // Create a new booking. booking.create will add the booking to our database
        const booking = await Booking.create({
            flight: req.body._id,
            passenger: req.user._id,
            seatNumber: req.body.passengers.length + 1,
        });

        const passenger = User.findByIdAndUpdate(
            req.user._id,
            { $push: { bookings: booking._id } }, // Añadir el vuelo al array
            { new: true } // Devuelve el documento actualizado
        );
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found.' });
        }

        req.body.passengers.push(req.user._id);
        req.body.availableSeats -= 1;
        const updatedFlight = await Flight.findByIdAndUpdate(req.body._id, {
            passengers: req.body.passengers,
            availableSeats: req.body.availableSeats,
        }, {
            new: true,
        });

        return res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the booking.' });
    }
};

// Get All Bookings. Learned from ChatGPT that this .populate method replaces the ObjectId with the actual data from the referenced collection.
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('flight')
            .populate('passenger', '_id firstName lastName email');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Booking by ID
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('flight')
            .populate('passenger', '_id firstName lastName email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the booking.' });
    }
};

// Update Booking information
const updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.bookingId, req.body, {
            new: true,
        });

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while updating the booking.',
        });

    }
};

const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({ message: 'Booking deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the booking.' });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
};

