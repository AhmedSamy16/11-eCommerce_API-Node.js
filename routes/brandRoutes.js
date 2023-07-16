import { Router } from "express"
import { protectRoutes, restrict } from "../middlewares/protectRoutes.js"
import {
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} from "../controllers/brandController.js"

const router = Router()

router.use(protectRoutes)

router.route('/')
    .get(getAllBrands)
    .post(restrict('admin'), createBrand)

router.route('/:id')
    .get(getBrandById)
    .patch(restrict('admin'), updateBrand)
    .delete(restrict('admin'), deleteBrand)

export default router