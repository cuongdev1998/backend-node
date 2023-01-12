const AppError = require('../utils/appError');
const handleJWTExpiredError = err => {
    return new AppError('Your token has expired! login again', 401)
}
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err.status,
        message: err.message,
        stack: err.stack,
    })
}
const sendErrorProd = (err, res) => {
    if(err.isOperational) {
        console.log(err.message)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }
}
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    }
    if (process.env.NODE_ENV === 'production') {
        let error = {...err}
        console.log(error, "error")
        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError(err);
        }
        sendErrorProd(error, res)
    }


}

