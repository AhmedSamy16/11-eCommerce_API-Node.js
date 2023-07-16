import { v2 } from "cloudinary"
import CustomError from "./CustomError.js"
import { config } from "dotenv"
config()

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudinaryUploadImage = (fileToUpload) => {
    return new Promise((resolve, reject) => {
        v2.uploader.upload(fileToUpload, (err, result) => {
            if (err) {
                reject(new CustomError(err.message, 500))
            }
            resolve({
                url: result.secure_url
            }, {
                resource_type: 'auto'
            })
        })
    })
}

export default cloudinaryUploadImage