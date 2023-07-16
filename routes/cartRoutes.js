import { Router } from "express";
import { protectRoutes } from "../middlewares/protectRoutes.js"
import {
    addToCart,
    createCart,
    getUserCart,
    emptyCart,
    removeFromCart,
    applyCoupon
} from "../controllers/cartController.js"

const router = Router()

router.use(protectRoutes)

router.route('/')
    .get(getUserCart)
    .post(createCart, addToCart)
    .delete(emptyCart)
    .patch(removeFromCart)

router.route('/apply-coupon')
    .post(applyCoupon)

export default router