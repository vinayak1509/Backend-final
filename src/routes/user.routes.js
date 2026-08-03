import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(
    //middleware 
    //uplaod is imported from multer , it has a lot of functionality
    // here , we are using .fields
    upload.fields([
        {
            name : "avatar",
            maxcount: 1  // how many files will you accept
        },{
            name: "coverImage",
            maxcount: 1
        }
    ]),
    registerUser
) // we are routing the request 
// to /register and finally calling the register user method

// router.route('/login').post(login)

router.route('/login').post(loginUser)


//Secured routes

router.route('/logout').post(verifyJwt ,logoutUser);

router.route("/refresh-token").post(refreshAccessToken)
export default router