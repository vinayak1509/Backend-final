import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router = Router();

router.route('/register').post(registerUser) // we are routing the request 
// to /register and finally calling the register user method

// router.route('/login').post(login)
export default router