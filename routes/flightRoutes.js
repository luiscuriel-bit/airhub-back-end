const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const verifyToken = require('../middleware/verify-token');
const verifyAdmin = require('../middleware/verify-admin');

router.post('/search', flightController.searchFlights);
router.get('/:flightId', flightController.getFlightById);

router.use(verifyToken, verifyAdmin);
router.get('/', flightController.getAllflights);
router.post('/', flightController.createFlight);
router.put('/:flightId', flightController.updateFlight);
router.delete('/:flightId', flightController.deleteFlight);

module.exports = router;