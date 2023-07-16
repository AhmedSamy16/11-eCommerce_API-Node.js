import { Router } from "express"
import { protectRoutes, restrict } from "../middlewares/protectRoutes.js"
import {
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
} from "../controllers/couponController.js"

const router = Router()

router.use(protectRoutes)

router.use(restrict('admin'))

router.route('/')
    .get(getAllCoupons)
    .post(createCoupon)

router.route('/:id')
    .patch(updateCoupon)
    .delete(deleteCoupon)

export default router