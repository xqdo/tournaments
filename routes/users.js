import express from 'express';
import cookieParser from 'cookie-parser';
import registerUser from '../controllers/registerController.js';
import login from '../controllers/loginController.js';
import refresh from '../controllers/refreshController.js';
import logout from '../controllers/logoutController.js';
import patchUser from '../controllers/edituserController.js';

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
router.patch("/", patchUser)
//DELETE

//DO NOT CHANGE THIS 
export default router
