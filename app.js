import express from "express"
import CustomError from './utils/CustomError.js'
import globalErrorHandler from "./middlewares/globalErrorHandler.js"
import userRouter from "./routes/userRoutes.js"
import productRouter from "./routes/productRoutes.js"
import blogRouter from "./routes/blogRoutes.js"
import productCategoryRouter from "./routes/productCategoryRoutes.js"
import blogCategoryRouter from "./routes/blogCategoryRoutes.js"
import brandRouter from "./routes/brandRoutes.js"
import couponRouter from "./routes/couponRoutes.js"
import cartRouter from "./routes/cartRoutes.js"

const app = express()

app.use(express.json())

app.use('/api/v1/users', userRouter)

app.use('/api/v1/products', productRouter)

app.use('/api/v1/blogs', blogRouter)

app.use('/api/v1/productCategory', productCategoryRouter)

app.use('/api/v1/blogCategory', blogCategoryRouter)

app.use('/api/v1/brands', brandRouter)

app.use('/api/v1/coupons', couponRouter)

app.use('/api/v1/cart', cartRouter)

app.use('*', (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on server!`, 404)
    next(err)
})

app.use(globalErrorHandler)

export default app