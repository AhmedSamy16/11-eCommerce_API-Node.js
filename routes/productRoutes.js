import { Router } from "express"
import { protectRoutes, restrict } from "../middlewares/protectRoutes.js"
import {
    createProduct, 
    deleteProduct, 
    getAllProducts, 
    getProductById,
    updateProduct,
    handleWishList,
    handleRating,
    productUploadImages
} from "../controllers/productController.js"
import { multerUploadImages } from "../middlewares/multer.js"

const router = Router()

router.use(protectRoutes)

router.route('/')
    .post(restrict('admin'), createProduct)
    .get(getAllProducts)

router.route('/:id')
    .get(getProductById)
    .patch(restrict('admin'), updateProduct)
    .delete(restrict('admin'), deleteProduct)

router.route('/wishlist/:prodId')
    .post(handleWishList)

router.route('/ratings/:prodId')
    .post(handleRating)

router.route('/uploadImages/:prodId')
    .post(restrict('admin'), multerUploadImages.array("images", 10), productUploadImages)

export default router