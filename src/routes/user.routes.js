import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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
export default router