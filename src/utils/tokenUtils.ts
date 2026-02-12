import jwt from 'jsonwebtoken';
import { IUser } from '../models/user';

export function generateAccessToken(user: IUser) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
    },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' },
    );
};

export function generateRefreshToken(user: IUser) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
    },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' },
    );
};