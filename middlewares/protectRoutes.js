import CustomError from "../utils/CustomError.js"
import util from "util"
import jwt from "jsonwebtoken"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import User from "../models/User.js"

export const protectRoutes = asyncErrorHandler(async (req, res, next) => {
    // 1. Check if authorization token exists
    const headerToken = req.headers.authorization
    let token
    if (headerToken && headerToken.startsWith('Bearer')) {
        token = headerToken.split(' ')[1]
    }
    if (!token) {
        const err = new CustomError('You are not logged in!', 401)
        return next(err)
    }
    // 2. validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR)
    // 3. Check if user exists
    const user = await User.findById(decodedToken.id)
    if (!user) {
        const err = new CustomError('This user does not exist!', 401)
        return next(err)
    }
    // 4. Check if password changed after the token was issued
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat)
    if (isPasswordChanged) {
        const err = new CustomError('Password has changed recently! Please login again', 401)
        return next(err)
    }
    // 5. Allow user to access
    req.user = user
    next()
})

export const restrict = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const err = new CustomError('You do not have permissions to perform this action', 403)
            return next(err)
        }
        next()
    }
}