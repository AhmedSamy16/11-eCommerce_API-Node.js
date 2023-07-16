import { Router } from "express"
import { protectRoutes, restrict } from "../middlewares/protectRoutes.js"
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    handleBlogLiking,
    handleBlogDisliking,
    blogUploadImages
} from "../controllers/blogController.js"
import { multerUploadImages } from "../middlewares/multer.js"

const router = Router()

router.use(protectRoutes)

router.route('/')
    .get(getAllBlogs)
    .post(restrict('admin'), createBlog)

router.route('/:id')
    .get(getBlogById)
    .patch(restrict('admin'), updateBlog)
    .delete(restrict('admin'), deleteBlog)

router.route('/handleBlogLiking/:blogId')
    .patch(handleBlogLiking)

router.route('/handleBlogDisliking/:blogId')
    .patch(handleBlogDisliking)

router.route('/uploadImages/:blogId')
    .post(restrict('admin'), multerUploadImages.array('images', 2), blogUploadImages)

export default router