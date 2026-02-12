import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
import { sendSuccess, sendError } from '../utils/responseHandler';

const SALT_LENGTH = 12;

export const signup = async (req: Request, res: Response) => {
    const existingUser = await User.findOne({ username: (req as any).body.username });

    if (existingUser) {
        return sendError(res, 400, new Error('Username is already in use.'));
    }

    const { username, firstName, lastName, email, password, role } = (req as any).body;

    const user = await User.create({
        username, firstName, lastName, email, role,
        password: bcrypt.hashSync(password, SALT_LENGTH),
    });

    const accessToken = generateAccessToken(user);
    // Set access token as HttpOnly cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const refreshToken = generateRefreshToken(user);
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, 201, {
        user: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        }
    });
};

export const signin = async (req: Request, res: Response) => {
    const user = await User.findOne({ username: (req as any).body.username });

    if (!user) {
        return sendError(res, 404, new Error('User not found.'));
    }
    if (!bcrypt.compareSync((req as any).body.password, user.password)) {
        return sendError(res, 401, new Error('Invalid username or password.'));
    }

    const accessToken = generateAccessToken(user);
    // Set access token as HttpOnly cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const refreshToken = generateRefreshToken(user);
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendSuccess(res, 200, {
        user: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
    });
};

export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = (req as any).cookies.refreshToken;
    if (!refreshToken) {
        return sendError(res, 401, new Error('Refresh token required'));
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, async (err: any, decoded: any) => {
        if (err) {
            return sendError(
                res,
                403,
                new Error(
                    err.name === 'TokenExpiredError'
                        ? 'Login expired. Please, log in again.'
                        : 'Invalid token'
                )
            );
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return sendError(res, 404, new Error('User not found.'));
        }

        const accessToken = generateAccessToken(user);
        // Set access token as HttpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const newRefreshToken = generateRefreshToken(user);
        // Set refresh token as HttpOnly cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return sendSuccess(res, 200, {
            user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    });
};

export const signout = (req: Request, res: Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0,
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0,
    });
    return sendSuccess(res, 200, { message: 'Logged out successfully' });
};

export const updateUser = async (req: Request, res: Response) => {
    const { username, firstName, lastName, email } = (req as any).body;
    const userId = (req as any).user.id;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, firstName, lastName, email },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return sendError(res, 404, new Error('User not found.'));
    }
    return sendSuccess(res, 200, updatedUser);
};

