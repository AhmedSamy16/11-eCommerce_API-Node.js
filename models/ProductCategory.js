import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Category title is required'],
        unique: true,
        index: true,
        trim: true
    }
}, {
    timestamps: true
})

const ProductCategory = mongoose.model('Category', categorySchema)

export default ProductCategory