import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            count: {
                type: Number,
                default: 1
            },
            color: String, 
            price: Number
        }
    ],
    cartTotal: {
        type: Number,
        default: 0
    },
    totalAfterDiscount: Number,
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required for cart']
    }
}, {
    timestamps: true
})

const Cart = mongoose.model('Cart', cartSchema)

export default Cart