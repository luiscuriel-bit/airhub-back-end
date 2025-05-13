const { sendError } = require('../utils/responseHandler');

function verifyAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return sendError(res, 403, new Error('Access denied. Admin privileges are required.'));
    }
    
    next();
}

module.exports = verifyAdmin;