import CustomError from "../utils/CustomError.js"

const devError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error
    })
}

const prodError = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later'
        })
    }
}

const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}`
    return new CustomError(msg, 400)
}

const duplicateKeyErrorHandler = (err) => {
    const msg = `${err.keyValue.name} already exists!`
    return new CustomError(msg, 400)
}

const validationErrorHandler = (err) => {
    let msg = Object.values(err.errors).map(val => val.message).join('. ')
    msg = `Invalid input data:; ${msg}`
    return new CustomError(msg, 400)
}


const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'
    if (process.env.NODE_ENV === 'development') {
        devError(res, error)
    } else if (process.env.NODE_ENV === 'production') {
        // Invalid Id value
        if (error.name === 'CastError') {
            error = castErrorHandler(error)
        }
        // Duplicate value error
        if (error.code === 11000) {
            error = duplicateKeyErrorHandler(error)
        }
        // Mongoose Validation Error
        if (error.name === 'ValidationError') {
            error = validationErrorHandler(error)
        }
        prodError(res, error)
    }
}

export default globalErrorHandler