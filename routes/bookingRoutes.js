const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');

router.post('/', createBooking);


router.get('/', getAllBookings);


router.get('/:bookingId', getBookingById);


router.put('/:bookingId', updateBooking);


router.delete('/:bookingId', deleteBooking);

module.exports = router;