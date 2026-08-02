import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { log } from "console";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user detail from frontend
    // validation - not empty
    // check if user already exists: username , email
    // check for images
    // check for avatar
    // upload them to cloudinary , avatar check
    // create user object - create entry in DB
    // remove password and refresh token field from response
    // check for user creation
    // return res 


    const { fullname, username, email, password } = req.body
    console.log("email: ", email);


    //    if(fullname === ""){
    //     throw new ApiError(400 , "fullname is required")
    //    }

    if (
        [fullname, username, email, password].some((field) => field?.trim() === "") // this function will check if any of the 
        // fields among the mentioned empty after trimming , then it wil throw error
        // in one go it checks any of the field is empty
        // if any one field is missing , then it will return true , then we will throw error
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        console.log(existedUser);
        throw new ApiError(409, "User already registered")
    }

    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const converImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }


    const user  = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    // below we are checking is the user was successfully created or not .
    // whenever a new user is created in mongoDB , it automatically adds a field "_id" which is unique
    // so, we can use this id to confirm if the user was created successfully or not
    // whichever field you don't want just write inside the .select method with "-"
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered successfully")
    )

});

export { registerUser };