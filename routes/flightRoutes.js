const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const verifyToken = require('../middleware/verify-token');


router.get('/', flightController.getAllflights);

router.get('/:flightId', flightController.getFlightById);

router.use(verifyToken);

router.post('/', flightController.createFlight);

router.put('/:flightId', flightController.updateFlight);

router.delete('/:flightId', flightController.deleteFlight);

module.exports = router;