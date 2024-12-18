const Flight = require('../models/flight');

const getAllflights = async (req, res) => {
    try {
        const flights = await Flight.find();
        res.status(200).json(flights)
    } catch (error) {
        res.status(500).json({ message: 'An error ocurred while fetching flights.' });
    }
};

const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.flightId);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        return res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ message: 'An error ocurred while fetching the flight.' });
    }
};

const createFlight = async (req, res) => {
    try {
        console.log('Incoming Request Body:', req.body);
        const newFlight = await Flight.create(req.body);
        res.status(201).json(newFlight);
    } catch (error) {
        res.status(500).json({ error: 'An error ocurred while creating the flight.' })
    }
};

const updateFlight = async (req, res) => {
    try {
        const updatedFlight = await Flight.findByIdAndUpdate(req.params.flightId, req.body, {
            new: true,
        });

        if (!updatedFlight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json(updatedFlight);
    } catch (error) {
        res.status(500).json({ message: 'An error ocurred while updating the flight.' });
    }
};

const deleteFlight = async (req, res) => {
    try {
        const deletedFlight = await Flight.findByIdAndDelete(req.params.flightId);

        if (!deletedFlight) {
            return res.status(404).json({ message: 'Flight not found.' })
        }

        res.status(200).json({ message: 'Flight successfully deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'An error ocurred while deleting the flight.' });
    }
};

module.exports = {
    getAllflights, getFlightById, createFlight, updateFlight, deleteFlight,
};

//in getFlightsbyId i changed "return res.json(404).json" to " return res.status(404).json" we were calling it twice and it threw an error in my postman testing.