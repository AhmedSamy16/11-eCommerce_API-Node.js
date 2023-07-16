import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/CustomError.js";
import Brand from "../models/Brand.js";
import ApiFeatures from "../utils/ApiFeatures.js"

export const createBrand = asyncErrorHandler(async (req, res, next) => {
    const brand = await Brand.create(req.body)
    res.status(201).json({
        status: 'success',
        data: { brand }
    })
})

export const updateBrand = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!brand) {
        const err = new CustomError('Brand not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { brand }
    })
})

export const getBrandById = asyncErrorHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id)
    if (!brand) {
        const err = new CustomError('Brand not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { brand }
    })
})

export const getAllBrands = asyncErrorHandler(async (req, res, next) => {
    const brandQuery = new ApiFeatures(Brand.find(), req.query).filter().sort().limitFields().pagination()
    const brands = await brandQuery.query
    res.status(200).json({
        status: 'success',
        count: brands.length,
        data: { brands }
    })
})

export const deleteBrand = asyncErrorHandler(async (req, res, next) => {
    await Brand.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
})