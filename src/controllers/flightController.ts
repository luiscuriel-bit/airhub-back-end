import { Request, Response } from 'express';
import Flight from "../models/flight";
import { sendSuccess, sendError } from "../utils/responseHandler";

const getAllflights = async (req: Request, res: Response) => {
    const flights = await Flight.find();
    return sendSuccess(res, 200, flights);
};

const getFlightById = async (req: Request, res: Response) => {
    const flight = await Flight.findById((req as any).params.flightId);
    if (!flight) {
        return sendError(res, 404, new Error('Flight not found'));
    }
    return sendSuccess(res, 200, flight);
};

const createFlight = async (req: Request, res: Response) => {
    const { flightNumber, origin, destination, departureTime, arrivalTime, availableSeats, status, price } = (req as any).body;
    const newFlight = await Flight.create({ flightNumber, origin, destination, departureTime, arrivalTime, availableSeats, status, price });

    req.app.get('io').emit('flight:created', newFlight);

    return sendSuccess(res, 201, newFlight);
};

const updateFlight = async (req: Request, res: Response) => {
    const updatedFlight = await Flight.findByIdAndUpdate((req as any).params.flightId, (req as any).body, {
        new: true, runValidators: true,
    });

    if (!updatedFlight) {
        return sendError(res, 404, new Error('Flight not found'));
    }

    req.app.get('io').emit('flight:updated', updatedFlight);

    return sendSuccess(res, 200, updatedFlight);
};

const deleteFlight = async (req: Request, res: Response) => {
    const id = (req as any).params.flightId;
    const deletedFlight = await Flight.findByIdAndDelete(id);

    if (!deletedFlight) {
        return sendError(res, 404, new Error('Flight not found.'));
    }

    req.app.get('io').emit('flight:deleted', id);
    return sendSuccess(res, 200, { message: 'Flight successfully deleted.' });
};

const searchFlights = async (req: Request, res: Response) => {
    const query = { ...(req as any).body };

    if (query.departureStart || query.departureEnd) {
        const departureQuery: any = {};

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
};

export {
    getAllflights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight,
    searchFlights,
};