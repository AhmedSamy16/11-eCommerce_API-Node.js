import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required!'],
        unique: true,
        index: true,
        trim: true
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
    }
}, {
    timestamps: true
})

const Brand = mongoose.model('Brand', brandSchema)

export default Brand