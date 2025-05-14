const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

function verifyToken(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token) {
        return sendError(res, 401, new Error('Access denied. No token provided.'));
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return sendError(res, 403, new Error(
                err.name === 'TokenExpiredError'
                    ? 'Login expired. Please, log in again.'
                    : 'Invalid token.'
            ));
        }
        req.user = decoded; // Attach decoded user info to request
        next();
    });
}

module.exports = verifyToken;