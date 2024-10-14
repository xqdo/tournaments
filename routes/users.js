import express from 'express';
import cookieParser from 'cookie-parser';
import registerUser from '../controllers/user/registerController.js';

import login from '../controllers/user/loginController.js';
import refresh from '../controllers/user/refreshController.js';
import logout from '../controllers/user/logoutController.js';
import patchUser from '../controllers/user/edituserController.js';
import deleteUser from '../controllers/user/deleteUserController.js';
import auth from "../middlewares/authmw.js"
import getUserDetails from '../controllers/user/getUserDetails.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, 'media/profiles'); // Directory where images are saved
    },
    filename: function (req, file, cb)
    {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});
const upload = multer({ storage: storage });
const router = express.Router();

router.use(express.json())
router.use(cookieParser())
// THE CRUD API
// DON'T USE JUST '/' ROUTES 


// GET ALL USERS

//refresh the token 
router.get('/', refresh)

//logout the user
router.get('/logout', logout)

//get the info of registered user
router.get('/my', auth, getUserDetails)
//get User By username
router.get('/:username', getUserDetails)

//login
router.post("/login", login)

//register
router.post("/register", upload.single('profileImage'), registerUser)

//edit Anything
router.patch("/", auth, upload.single('profileImage'), patchUser)

//delete User
//???? - EDIT for the Team sake - ????
router.post('/delete', auth, deleteUser)

export default router
