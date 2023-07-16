import jwt from "jsonwebtoken"

const signToken = (id) => {
    const token = jwt.sign({ id }, process.env.SECRET_STR)
    return token
}

const createAndSendToken = (args) => {
    const { user, res, statusCode } = args
    if (!user || !res || !statusCode) return
    const token = signToken(user.id)
    user.password = undefined
    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    })
}

export default createAndSendToken