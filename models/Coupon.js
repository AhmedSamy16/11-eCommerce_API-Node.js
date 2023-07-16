import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Coupon name is required'],
        uppercase: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: [true, 'Coupon expiry date is required']
    },
    discount: {
        type: Number,
        required: [true, 'Coupon discount is required']
    }
}, {
    timestamps: true
})

const Coupon = mongoose.model('Coupon', couponSchema)

export default Coupon