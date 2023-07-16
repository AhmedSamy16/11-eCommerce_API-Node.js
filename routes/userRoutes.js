import { Router } from "express"
import { register, 
        login, 
        getAllUsers, 
        getUserById, 
        deleteUser, 
        updateUser, 
        handleUserBlocking,
        getWishlist,
        saveAddress
    } from "../controllers/userController.js"
import { protectRoutes, restrict } from "../middlewares/protectRoutes.js"

const router = Router()

router.route('/register').post(register)

router.route('/login').post(login)

router.route('/all-users')
    .get(protectRoutes, restrict('admin'), getAllUsers)

router.route('/wishlist')
    .get(protectRoutes, getWishlist)

router.route('/save-address')
    .patch(protectRoutes, saveAddress)

router.route('/:id')
    .get(protectRoutes, restrict('admin'), getUserById)
    .delete(protectRoutes, deleteUser)
    .patch(protectRoutes, updateUser)

router.route('/handleUserBlocking/:id')
    .patch(protectRoutes, restrict('admin'), handleUserBlocking)


export default router