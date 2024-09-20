import express from 'express';
import cookieParser from 'cookie-parser';
import registerUser from '../controllers/user/registerController.js';
import login from '../controllers/user/loginController.js';
import refresh from '../controllers/user/refreshController.js';
import logout from '../controllers/user/logoutController.js';
import patchUser from '../controllers/user/edituserController.js';
import deleteUser from '../controllers/user/deleteUserController.js';
import auth from "../middlewares/authmw.js"
const router = express.Router();

// THE CRUD API
// DON'T USE JUST '/' ROUTES 
//GET
router.use(express.json())
router.use(cookieParser())
router.get('/all', (req, res) =>
{
    res.status(200).send("hello yousef");
})
router.get('/', refresh)
router.get('/logout', logout)

//POST

router.post("/login", login)

router.post("/register", registerUser)

//PATCH
router.patch("/", auth, patchUser)
//DELETE
router.post('/delete', auth, deleteUser)
//DO NOT CHANGE THIS 
export default router
