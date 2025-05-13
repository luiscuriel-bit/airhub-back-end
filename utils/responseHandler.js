
const isProduction = process.env.NODE_ENV === 'production';

const sendSuccess = (res, statusCode, data = null) => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
};

const sendError = (res, statusCode, error) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: isProduction ? 'An internal server error occurred.' : error.message || 'An unknown error occurred.',
  });
};

module.exports = { sendSuccess, sendError };