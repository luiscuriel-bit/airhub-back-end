const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const SALT_LENGTH = 12;

const signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });

        if (existingUser) {
            return sendError(res, 400, new Error('Username is already in use.'));
        }

        const { username, firstName, lastName, email, password, role } = req.body;

        const user = await User.create({
            username, firstName, lastName, email, role,
            password: bcrypt.hashSync(password, SALT_LENGTH),
        });


        const accessToken = generateAccessToken(user);
        // Set access token as HttpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const refreshToken = generateRefreshToken(user);
        // Set refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
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
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const signin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return sendError(res, 404, new Error('User not found.'));
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return sendError(res, 401, new Error('Invalid username or password.'));
        }

        const accessToken = generateAccessToken(user);
        // Set access token as HttpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const refreshToken = generateRefreshToken(user);
        // Set refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
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
    } catch (error) {
        return sendError(res, 500, error);
    }
};

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return sendError(res, 401, new Error('Refresh token required'));
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
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

        try {
            const user = await User.findById(decoded.id);

            if (!user) {
                return sendError(res, 404, new Error('User not found.'));
            }

            const accessToken = generateAccessToken(user);
            // Set access token as HttpOnly cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const refreshToken = generateRefreshToken(user);
            // Set refresh token as HttpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
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
        } catch (error) {
            return sendError(res, 500, error);
        }
    });
};

const signout = (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 0,
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 0,
    });
    return sendSuccess(res, 200, { message: 'Logged out successfully' });
};

const updateUser = async (req, res) => {
    try {
        const { username, firstName, lastName, email } = req.body;
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, firstName, lastName, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return sendError(res, 404, new Error('User not found.'));
        }
        return sendSuccess(res, 200, updatedUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return sendError(res, 400, new Error('Invalid input. Please check the data you submitted.'));
        }

        console.error('Error updating user:', error.message);
        return sendError(res, 500, error);
    }
};

module.exports = {
    signup,
    signin,
    refreshToken,
    signout,
    updateUser,
};
