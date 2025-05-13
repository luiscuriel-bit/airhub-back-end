const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');
const verifyToken = require('../middleware/verify-token');

router.use(verifyToken);

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:bookingId', getBookingById);
router.delete('/:bookingId', deleteBooking);

module.exports = router;