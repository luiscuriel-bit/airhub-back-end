const Flight = require('../models/flight');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getAllflights = async (req, res) => {
    try {
        const flights = await Flight.find();
        return sendSuccess(res, 200, flights);
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.flightId);
        if (!flight) {
            return sendError(res, 404, new Error('Flight not found'));
        }
        return sendSuccess(res, 200, flight);
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const createFlight = async (req, res) => {
    try {
        const { flightNumber, origin, destination, departureTime, arrivalTime, availableSeats, status, price } = req.body;
        const newFlight = await Flight.create({ flightNumber, origin, destination, departureTime, arrivalTime, availableSeats, status, price });
        return sendSuccess(res, 201, newFlight);
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const updateFlight = async (req, res) => {
    try {
        const updatedFlight = await Flight.findByIdAndUpdate(req.params.flightId, req.body, {
            new: true, runValidators: true,
        });

        if (!updatedFlight) {
            return sendError(res, 404, new Error('Flight not found'));
        }
        return sendSuccess(res, 200, updatedFlight);
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const deleteFlight = async (req, res) => {
    try {
        const deletedFlight = await Flight.findByIdAndDelete(req.params.flightId);

        if (!deletedFlight) {
            return sendError(res, 404, new Error('Flight not found.'));
        }
        return sendSuccess(res, 200, { message: 'Flight successfully deleted.' });
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const searchFlights = async (req, res) => {
    try {
        const query = { ...req.body };

        if (query.departureStart || query.departureEnd) {
            const departureQuery = {};

            if (query.departureStart) {
                const start = new Date(query.departureStart);
                start.setHours(0, 0, 0, 0); // Start of day
                departureQuery.$gte = start;
            }

            if (query.departureEnd) {
                const end = new Date(query.departureEnd);
                end.setHours(23, 59, 59, 999); // End of day
                departureQuery.$lte = end;
            }

            query.departureTime = departureQuery;

            delete query.departureStart;
            delete query.departureEnd;
        }

        const flights = await Flight.find(query);

        if (!flights.length) {
            return sendError(res, 404, new Error('No flights match your criteria.'));
        }

        return sendSuccess(res, 200, flights);
    } catch (error) {
        return sendError(res, 500, error);
    }
};

module.exports = {
    getAllflights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight,
    searchFlights,
};