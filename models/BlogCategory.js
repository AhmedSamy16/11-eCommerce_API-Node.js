import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog Category title is required!'],
        unique: true,
        trim: true,
        index: true
    }
}, {
    timestamps: true
})

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema)

export default BlogCategory