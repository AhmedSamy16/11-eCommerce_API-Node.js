import { Router } from "express"
import { protectRoutes, restrict } from "../middlewares/protectRoutes.js"
import {
    getAllBlogCategories,
    getBlogCategoryById,
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
} from "../controllers/blogCategoryController.js"

const router = Router()

router.use(protectRoutes)

router.use(restrict('admin'))

router.route('/')
    .get(getAllBlogCategories)
    .post(createBlogCategory)

router.route('/:id')
    .get(getBlogCategoryById)
    .patch(updateBlogCategory)
    .delete(deleteBlogCategory)

export default router