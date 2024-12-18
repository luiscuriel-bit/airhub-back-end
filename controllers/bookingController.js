const Booking = require('../models/booking');
const Flight = require('../models/flight');
const User = require('../models/user');

// Create a New Booking
const createBooking = async (req, res) => {
    try {
        const { flight, passenger, seatNumber } = req.body;

        // We Check if flight exists here
        const flightExists = await Flight.findById(flight);
        if (!flightExists) {
            return res.status(404).json({ message: 'Flight not found.' });
        }

        // Then Check if passenger exists
        const passengerExists = await User.findById(passenger);
        if (!passengerExists) {
            return res.status(404).json({ message: 'Passenger not found.' });
        }

        //  Then Check if the seat is already booked
        const existingBooking = await Booking.findOne({ flight, seatNumber });
        if (existingBooking) {
            return res.status(400).json({ message: 'Seat is already booked.' });
        }

        // Create a new booking. booking.create will add the booking to our database
        const booking = await Booking.create({
            flight,
            passenger,
            seatNumber,
            status: 'confirmed',
        });

       return res.status(201).json({ booking, message: 'Booking created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the booking.' });
    }
};

// Get All Bookings. Learned from ChatGPT that this .populate method replaces the ObjectId with the actual data from the referenced collection.
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('flight', 'flightNumber origin destination')
            .populate('passenger', 'username firstName lastName email');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching bookings.' });
    }
};

// Get Booking by ID
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('flight', 'flightNumber origin destination')
            .populate('passenger', 'username firstName lastName email');

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
        const { bookingId } = req.params;
        const { seatNumber, flight, status } = req.body

        console.log('Incoming Update Data:', req.body)

        // Find the booking by ID

        const booking = await Booking.findById(bookingId);
            
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        // If flight is being updated, verify the new flight exists
        if (flight) {
            const flightExists = await Flight.findById(flight);
            if (!flightExists) {
                return res.status(404).json({ message: 'Flight not found' });
            }
            booking.flight = flight; //This updates the flight
        }

        // update seatNumber
        if (seatNumber) {
            booking.seatNumber = seatNumber;
        }

        // Update status 
        if (status) {
            booking.status = status;
        }

        const updateBooking = await booking.save();

        res.status(200).json({
            message: 'Booking updated successfully',
            updateBooking,
        });

    } catch (error) {
        console.error('Error updating booking:', error.message || error);
        console.dir(error, { depth: null });

        res.status(500).json({ message: 'An error occurred while updating the booking.',
            error: error.message || 'Unknown error',
         });
        
    
    }
};

// Delete Booking
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

