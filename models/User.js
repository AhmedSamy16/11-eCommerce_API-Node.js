import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    passwordChangedAt: Date,
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: String
    },
    wishList: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.comparePassword = async function(pswd) {
    return await bcrypt.compare(pswd, this.password)
}

userSchema.methods.isPasswordChanged = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const pswdChanged = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < pswdChanged
    }
    return false
}

const User = mongoose.model('User', userSchema)

export default User