import BlogCategory from "../models/BlogCategory.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/CustomError.js";
import ApiFeatures from "../utils/ApiFeatures.js"

export const createBlogCategory = asyncErrorHandler(async (req, res, next) => {
    const category = await BlogCategory.create(req.body)
    res.status(200).json({
        status: 'success',
        data: { category }
    })
})

export const updateBlogCategory = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const category = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!category) {
        const err = new CustomError('Blog Category not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { category }
    })
})

export const getAllBlogCategories = asyncErrorHandler(async (req, res, next) => {
    const categoryQuery = new ApiFeatures(BlogCategory.find({}), req.query).filter().sort().limitFields().pagination()
    const categories = await categoryQuery.query
    res.status(200).json({
        status: 'success',
        count: categories.length,
        data: { categories }
    })
})

export const getBlogCategoryById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const category = await BlogCategory.findById(id)
    if (!category) {
        const err = new CustomError('Blog Category not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { category }
    })
})

export const deleteBlogCategory = asyncErrorHandler(async (req, res, next) => {
    await BlogCategory.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
})