const AppError = require('../utils/appError');
const handleJWTExpiredError = err => {
    return new AppError('Your token has expired! login again', 401)
}
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (err.name === 'JsonWebTokenError') {
        err = handleJWTExpiredError(err);
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })

}

