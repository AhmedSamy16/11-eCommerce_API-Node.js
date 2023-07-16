import ProductCategory from "../models/ProductCategory.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/CustomError.js";
import ApiFeatures from "../utils/ApiFeatures.js"

export const createProductCategory = asyncErrorHandler(async (req, res, next) => {
    const category = await ProductCategory.create(req.body)
    res.status(200).json({
        status: 'success',
        data: { category }
    })
})

export const updateProductCategory = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const category = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!category) {
        const err = new CustomError('Product Category not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { category }
    })
})

export const getAllProductCategories = asyncErrorHandler(async (req, res, next) => {
    const categoryQuery = new ApiFeatures(ProductCategory.find({}), req.query).filter().sort().limitFields().pagination()
    const categories = await categoryQuery.query
    res.status(200).json({
        status: 'success',
        count: categories.length,
        data: { categories }
    })
})

export const getProductCategoryById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const category = await ProductCategory.findById(id)
    if (!category) {
        const err = new CustomError('Product Category not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { category }
    })
})

export const deleteProductCategory = asyncErrorHandler(async (req, res, next) => {
    await ProductCategory.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
})