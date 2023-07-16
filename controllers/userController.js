import User from "../models/User.js"
import ApiFeatures from "../utils/ApiFeatures.js"
import CustomError from "../utils/CustomError.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import createAndSendToken from "../utils/tokenHandler.js"

export const register = asyncErrorHandler(async (req, res, next) => {
    const user = await User.create(req.body)
    user.password = undefined
    res.status(201).json({
        status: 'success',
        data: { user }
    })
})

export const login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        const err = new CustomError('Please provide email and password for login', 400)
        return next(err)
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
        const err = new CustomError('Invalid email or password', 400)
        return next(err)
    }
    createAndSendToken({
        user,
        res,
        statusCode: 200
    })
})

export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const usersQuery = new ApiFeatures(User.find(), req.query).filter().sort().limitFields().pagination()
    const users = await usersQuery.query
    res.status(200).json({
        status: 'success',
        count: users.length,
        data: { users }
    })
})

export const getUserById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id)
    res.status(200).json({
        status: 'success',
        data: { user }
    })
})

export const updateUser = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    if (req.body.password) {
        const err = new CustomError('Password update is not available in this route', 400)
        return next(err)
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.status(200).json({
        status: 'success',
        data: { user }
    })
})

export const deleteUser = asyncErrorHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    res.status(204).json({ status: 'success' })
})

export const handleUserBlocking = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
        const err = new CustomError('User not Found!', 404)
        return next(err)
    }
    const blokStatus = user.isBlocked
    user.isBlocked = !user.isBlocked
    await user.save()
    res.status(200).json({
        status: 'success',
        message: `User is ${blokStatus ? 'unblocked' : 'blocked'} successfully`
    })
})

export const getWishlist = asyncErrorHandler(async (req, res, next) => {
    const { _id } = req.user
    const user = await User.findById(_id).populate('wishList')
    res.status(200).json({
        status: 'success',
        count: user.wishList.length,
        data: { wishlist: user.wishList }
    })
})

export const saveAddress = asyncErrorHandler(async (req, res, next) => {
    const { _id } = req.user
    const { address } = req.body
    const user = await User.findByIdAndUpdate(_id, {
        address,
    }, {
        new: true, runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: { user }
    })
})