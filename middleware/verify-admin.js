const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next) {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authorization token.' });
    }
}

module.exports = verifyAdmin;