import multer from "multer";
import path from "path"
import CustomError from "../utils/CustomError.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "/public/images/"))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.originalname + '-' + uniqueSuffix + '.jpg')
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new CustomError('Unsupported file type', 400), false)
    }
}

export const multerUploadImages = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2000000
    }
})