import express from 'express';
const router = express.Router();
import * as flightController from '../controllers/flightController';
import verifyToken from '../middleware/verify-token';
import verifyAdmin from '../middleware/verify-admin';
import {asyncWrapper} from '../utils/asyncWrapper';

router.post('/search', asyncWrapper(flightController.searchFlights));
router.get('/:flightId', asyncWrapper(flightController.getFlightById));

router.use(verifyToken as any, verifyAdmin as any);
router.get('/', asyncWrapper(flightController.getAllflights));
router.post('/', asyncWrapper(flightController.createFlight));
router.put('/:flightId', asyncWrapper(flightController.updateFlight));
router.delete('/:flightId', asyncWrapper(flightController.deleteFlight));

export default router;