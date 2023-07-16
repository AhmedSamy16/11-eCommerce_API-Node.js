import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product's title is required"],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, "Product's description is required"],
        unique: true
    },
    price: {
        type: Number,
        required: [true, "Product's price is required"]
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        enum: ['Apple', 'Samsung', 'Lenovo']
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    quantity: {
        type: Number,
        requierd: [true, "Product's quantity is required"]
    },
    images: [],
    color: {
        type: String,
        required: [true, 'Color is required']
    },
    ratings: [{
        stars: Number,
        comment: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0,
        select: false
    }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product