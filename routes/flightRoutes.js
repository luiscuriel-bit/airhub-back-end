const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const verifyToken = require('../middleware/verify-token');


router.get('/', flightController.getAllflights);
router.post('/search', flightController.searchFlights);

router.get('/:flightId', flightController.getFlightById);

router.post('/', flightController.createFlight);
router.use(verifyToken);


router.put('/:flightId', flightController.updateFlight);

router.delete('/:flightId', flightController.deleteFlight);

module.exports = router;