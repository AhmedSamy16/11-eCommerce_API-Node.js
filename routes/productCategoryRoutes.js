import { Router } from "express"
import { 
    createProductCategory, 
    updateProductCategory,
    getAllProductCategories,
    deleteProductCategory,
    getProductCategoryById
} from "../controllers/productCategoryController.js"
import { protectRoutes, restrict } from "../middlewares/protectRoutes.js"

const router = Router()

router.use(protectRoutes)

router.use(restrict('admin'))

router.route('/')
    .post(createProductCategory)
    .get(getAllProductCategories)

router.route('/:id')
    .get(getProductCategoryById)
    .patch(updateProductCategory)
    .delete(deleteProductCategory)

export default router