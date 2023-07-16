import Product from "../models/Product.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import CustomError from "../utils/CustomError.js"
import ApiFeatures from "../utils/ApiFeatures.js"
import slugify from "slugify"
import User from "../models/User.js"
import cloudinaryUploadImage from "../utils/cloudinary.js"
import fs from "fs"

export const createProduct = asyncErrorHandler(async (req, res, next) => {
    req.body.slug = slugify(req.body.title)
    const product = await Product.create(req.body)
    res.status(201).json({
        status: 'success',
        data: { product }
    })
})

export const getAllProducts = asyncErrorHandler(async (req, res, next) => {
    const productsQuery = new ApiFeatures(Product.find(), req.query).filter().sort().limitFields().pagination()
    const products = await productsQuery.query
    res.status(200).json({
        status: 'success',
        count: products.length,
        data: { products }
    })
})

export const getProductById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
        const err = new CustomError('Product not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { product }
    })
})

export const updateProduct = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.status(200).json({
        status: 'success',
        data: { product }
    })
})

export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
    await Product.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'success'
    })
})

export const handleWishList = asyncErrorHandler(async (req, res, next) => {
    const userId = req?.user._id
    const { prodId } = req.params
    const user = await User.findById(userId)
    if (!user) {
        const err = new CustomError('User not found!', 404)
        return next(err)
    }
    const alreadyAdded = user.wishList.find(
        id => id?.toString() === prodId
    )
    let updateParams = {}
    if (alreadyAdded) {
        updateParams = {
            $pull: { wishList: prodId }
        }
    } else {
        updateParams = {
            $push: { wishList: prodId }
        }
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateParams,
        { new: true, runValidators: true }
    )
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

export const handleRating = asyncErrorHandler(async (req, res, next) => {
    const loggedInUserId = req.user._id
    const { prodId } = req.params
    const { stars, comment } = req.body
    const product = await Product.findById(prodId)
    if (!product) {
        const err = new CustomError('Product not found!', 404)
        return next(err)
    }
    const alreadyRated = product.ratings.find(
        rating => rating.postedBy.toString() === loggedInUserId.toString()
    )
    let findParams = {}
    let updateParams = {}
    if (alreadyRated) {
        findParams.ratings = {
            $elemMatch: alreadyRated
        }
        updateParams = {
            $set: { "ratings.$.stars": stars, "ratings.$.comment": comment }
        }
    } else {
        findParams._id = prodId
        updateParams = {
            $push: {
                ratings: {
                    stars,
                    comment,
                    postedBy: loggedInUserId
                }
            }
        }
    }
    await Product.updateOne(findParams, updateParams)
    // Calculating average ratings
    const finalProduct = await Product.findById(prodId)
    const totalRatings = finalProduct.ratings.length
    const ratingsSum = finalProduct.ratings.reduce((prev, curr) => prev + curr.stars, 0)
    const averageRating = Math.round(ratingsSum / totalRatings)
    finalProduct.averageRating = averageRating
    await finalProduct.save()
    res.status(200).json({
        status: 'success',
        data: {
            product: finalProduct
        }
    })
})

export const productUploadImages = asyncErrorHandler(async (req, res, next) => {
    const { prodId } = req.params
    const uploader = (path) => cloudinaryUploadImage(path)
    const urls = []
    for (const file of req.files) {
        const { path } = file
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
    }
    const product = await Product.findByIdAndUpdate(
        prodId,
        {
            images: urls
        },
        {
            new: true,
            runValidators: true
        }
    )
    res.status(200).json({
        status: 'success',
        data: { product }
    })
})