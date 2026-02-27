import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {sendError} from '../utils/responseHandler';

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken;
    if (!token) {
        return sendError(res, 401, new Error('Access denied. No token provided.'));
    }
    
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            return sendError(res, 403, new Error(
                err.name === 'TokenExpiredError'
                    ? 'Login expired. Please, log in again.'
                    : 'Invalid token.'
            ));
        }
        (req as any).user = decoded; // Attach decoded user info to request
        next();
    });
};