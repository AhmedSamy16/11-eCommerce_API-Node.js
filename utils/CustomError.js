
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.status = statusCode >= 500 ? 'error' : 'failed'
        this.statusCode = statusCode
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

export default CustomError