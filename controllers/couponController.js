import Coupon from "../models/Coupon.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import ApiFeatures from "../utils/ApiFeatures.js"

export const createCoupon = asyncErrorHandler(async (req, res, next) => {
    const coupon = await Coupon.create(req.body)
    res.status(201).json({
        status: 'success',
        data: { coupon }
    })
})

export const getAllCoupons = asyncErrorHandler(async (req, res, next) => {
    const couponsQuery = new ApiFeatures(Coupon.find(), req.query).filter().sort().limitFields().pagination()
    const coupons = await couponsQuery.query
    res.status(200).json({
        status: 'success',
        count: coupons.length,
        data: { coupons }
    })
})

export const updateCoupon = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.status(200).json({
        status: 'success',
        data: { coupon }
    })
})

export const deleteCoupon = asyncErrorHandler(async (req, res, next) => {
    await Coupon.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
})