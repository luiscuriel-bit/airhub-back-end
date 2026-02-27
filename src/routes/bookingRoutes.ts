import express from 'express';
const router = express.Router();

import * as bookingController from '../controllers/bookingController';
import verifyToken from '../middleware/verify-token';
import {asyncWrapper} from '../utils/asyncWrapper';

router.use(verifyToken as any);

router.post('/', asyncWrapper(bookingController.createBooking));
router.get('/', asyncWrapper(bookingController.getAllBookings));
router.get('/:bookingId', asyncWrapper(bookingController.getBookingById));
router.delete('/:bookingId', asyncWrapper(bookingController.deleteBooking));

export default router;