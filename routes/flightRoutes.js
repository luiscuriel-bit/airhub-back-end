const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const verifyToken = require('../middleware/verify-token');
const verifyAdmin = require('../middleware/verify-admin');


router.post('/search', flightController.searchFlights);


router.use(verifyToken);
router.post('/', flightController.createFlight);
router.get('/:flightId', flightController.getFlightById);
router.put('/:flightId', flightController.updateFlight);
router.delete('/:flightId', flightController.deleteFlight);
router.use(verifyAdmin)
router.get('/', flightController.getAllflights);

module.exports = router;