import {Request, Response, NextFunction} from 'express';
import {sendError} from '../utils/responseHandler';

export default function verifyAdmin(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
        return sendError(res, 403, new Error('Access denied. Admin privileges are required.'));
    }
    
    next();
};