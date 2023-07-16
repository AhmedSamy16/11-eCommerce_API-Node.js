import User from "../models/User.js";
import Blog from "../models/Blog.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/CustomError.js";
import ApiFeatures from "../utils/ApiFeatures.js"
import cloudinaryUploadImage from "../utils/cloudinary.js"
import fs from "fs"

export const createBlog = asyncErrorHandler(async (req, res, next) => {
    const blog = await Blog.create(req.body)
    res.status(201).json({
        status: 'success',
        data: { blog }
    })
})

export const getBlogById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    // const blog = await Blog.findById(id)
    const [ blog, _ ] = await Promise.all([
        Blog.findById(id),
        Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true, runValidators: true })
    ])
    if (!blog) {
        const err = new CustomError('Blog not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { blog }
    })
})

export const getAllBlogs = asyncErrorHandler(async (req, res, next) => {
    const blogsQuery = new ApiFeatures(Blog.find(), req.query).filter().sort().limitFields().pagination()
    const blogs = await blogsQuery.query
    res.status(200).json({
        status: 'success',
        count: blogs.length,
        data: { blogs }
    })
})

export const updateBlog = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!blog) {
        const err = new CustomError('Blog not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { blog }
    })
})

export const deleteBlog = asyncErrorHandler(async (req, res, next) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'success'
    })
})

export const handleBlogLiking = asyncErrorHandler(async (req, res, next) => {
    const { blogId } = req.params
    const blog = await Blog.findById(blogId)
    if (!blog) {
        const err = new CustomError('Blog not found!', 404)
        return next(err)
    }
    const loggedInUserId = req?.user?._id
    const alreadyDisliked = blog.dislikes.find(
        userId => userId?.toString() === loggedInUserId?.toString()
    )
    let updateParams = {}
    let responseParams = {
        isDisLiked: false
    }
    if (alreadyDisliked) {
        updateParams = { 
            $pull: { dislikes: loggedInUserId },
            $push: { likes: loggedInUserId }
        }
        responseParams.isLiked = true
    } else {
        const alreadyLiked = blog.likes.find(
            userId => userId?.toString() === loggedInUserId.toString()
        )
        if (alreadyLiked) {
            updateParams = {
                $pull: { likes: loggedInUserId }
            }
            responseParams.isLiked = false
        } else {
            updateParams = {
                $push: { likes: loggedInUserId }
            }
            responseParams.isLiked = true
        }
    }
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateParams, { new: true, runValidators: true })
    responseParams.likes = updatedBlog.likes
    responseParams.dislikes = updatedBlog.dislikes
    res.status(200).json({
        status: 'success',
        data: responseParams
    })
})

export const handleBlogDisliking = asyncErrorHandler(async (req, res, next) => {
    const { blogId } = req.params
    const blog = await Blog.findById(blogId)
    if (!blog) {
        const err = new CustomError('Blog not found!', 404)
        return next(err)
    }
    const loggedInUserId = req?.user?._id
    let updateParams = {}
    let responseParams = {
        isLiked: false
    }
    const alreadyLiked = blog.likes.find(
        userId => userId?.toString() === loggedInUserId.toString()
    )
    if (alreadyLiked) {
        updateParams = {
            $pull: { likes: loggedInUserId },
            $push: { dislikes: loggedInUserId }
        }
        responseParams.isDisLiked = true
    } else {
        const alreadyDisliked = blog.dislikes.find(
            userId => userId?.toString() === loggedInUserId.toString()
        )
        if (alreadyDisliked) {
            updateParams = {
                $pull: { dislikes: loggedInUserId }
            }
            responseParams.isDisLiked = false
        } else {
            updateParams = {
                $push: { dislikes: loggedInUserId }
            }
            responseParams.isDisLiked = true
        }
    }
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateParams, { new: true, runValidators: true })
    responseParams.likes = updatedBlog.likes
    responseParams.dislikes = updatedBlog.dislikes
    res.status(200).json({
        status: 'success',
        data: responseParams
    })
})

export const blogUploadImages = asyncErrorHandler(async (req, res, next) => {
    const { blogId } = req.params
    let urls = []
    const uploader = (path) => cloudinaryUploadImage(path)
    for (const file of req.files) {
        const { path } = file
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
    }
    const blog = await Blog.findByIdAndUpdate(
        blogId,
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
        data: { blog }
    })
})