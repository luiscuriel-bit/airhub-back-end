import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHandler';

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('--- ERROR LOG ---');
    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'An unknown error occurred.';

    // Handle Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Invalid input data. Please check your fields.';
    }

    // Handle Mongo Duplicate Key Errors (e.g. unique: true)
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered.';
    }

    return sendError(res, statusCode, err);
};