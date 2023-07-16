import Cart from "../models/Cart.js"
import Product from "../models/Product.js"
import Coupon from "../models/Coupon.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import CustomError from "../utils/CustomError.js"
import mongoose from "mongoose"

export const getUserCart = asyncErrorHandler(async (req, res, next) => {
    const { _id } = req.user
    let cart = await Cart.findOne({ orderBy: _id }).populate('products.product')
    if (!cart) cart = []
    res.status(200).json({
        status: 'success',
        data: { cart }
    })
})

export const createCart = asyncErrorHandler(async (req, res, next) => {
    const { _id } = req.user
    let cart = await Cart.findOne({ orderBy: _id })
    if (!cart) {
        cart = await Cart.create({ orderBy: _id })
    }
    req.cart = cart
    next()
})

export const addToCart = asyncErrorHandler(async (req, res, next) => {
    const { _id } = req.user
    const { cartProducts } = req.body
    let products = []
    let total = 0
    for (const prod of cartProducts) {
        const [product, alreadyInCart] = await Promise.all([
            Product.findById(prod.prodId),
            Cart.findOne({
                orderBy: _id,
                "products.0": { $exists: true }
            }).where('products')
            .nin([new mongoose.Types.ObjectId(prod.prodId)])
        ])
        if (product && !alreadyInCart) {
            products.push({
                product: product._id,
                count: prod.count,
                color: prod.color,
                price: product.price
            })
            total += product.price * +prod.count
        }
    }
    const cart = await Cart.findByIdAndUpdate(
        req.cart._id,
        { $push: { products: { $each: products } }, $inc: { cartTotal: total } },
        { upsert: true, new: true, runValidators: true }
    ).populate('products.product')
    res.status(200).json({
        status: 'success',
        data: {
            cart
        }
    })
})

export const removeFromCart = asyncErrorHandler(async (req, res, next) => {
    const { _id } = req.user
    const { id } = req.body
    const cart = await Cart.findOne({ orderBy: _id })
    const item = cart?.products.find(prod => prod._id.toString() === id.toString())
    const total = cart.cartTotal - (item.count * item.price)
    const newCart = await Cart.findOneAndUpdate(
        { orderBy: _id },
        {
            $pull: { products: item },
            cartTotal: total
        },
        {
            new: true,
            runValidators: true
        }
    )
    res.status(200).json({
        status: 'success',
        data: {
            cart: newCart
        }
    })
})

export const emptyCart = asyncErrorHandler(async (req, res, next) => {
    const { _id } = req.user
    const cart = await Cart.findOneAndUpdate(
        { orderBy: _id },
        { products: [], cartTotal: 0, totalAfterDiscount: 0 },
        { new: true, runValidators: true }
    )
    if (!cart) {
        const err = new CustomError('Cart not found!', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        cart
    })
})

export const applyCoupon = asyncErrorHandler(async (req, res, next) => {
    const { coupon } = req.body
    const { _id } = req.user
    const [validCoupon, cart] = await Promise.all([
        Coupon.findOne({
            name: coupon,
            expiresAt: { $gt: Date.now() }
        }),
        Cart.findOne({ orderBy: _id, "products.0": { $exists: true } })
    ])
    if (!validCoupon) {
        const err = new CustomError('Invalid Coupon', 400)
        return next(err)
    }
    if (!cart) {
        const err = new CustomError('You can not apply coupon', 400)
        return next(err)
    }
    let totalAfterDiscount = cart.cartTotal - (cart.cartTotal * validCoupon.discount / 100)
    if (totalAfterDiscount < 0) {
        totalAfterDiscount = 0
    }
    const newCart = await Cart.findOneAndUpdate(
        { orderBy: _id },
        { totalAfterDiscount },
        { new: true, runValidators: true }
    )
    res.status(200).json({
        status: 'success',
        data: { cart: newCart }
    })
})