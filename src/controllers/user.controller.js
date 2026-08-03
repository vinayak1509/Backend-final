import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        //user.save(); // if you save like this, then mongoose model will kick in 
        // the pre save hook and it will hash the password again, so we need to use 
        // { validateBeforeSave: false } to avoid that

        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token")
    }
}

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
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }


    const user = await User.create({
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

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

});

const loginUser = asyncHandler(async (req, res) => {
    // get user login credentials
    // validation
    // if not registered , then return
    // password check
    // access and refresh token
    // send cookies

    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Email or username is required");
    }

    const user = await User.findOne(
        { $or: [{ email }, { username }] }
    );

    if (!user) {
        throw new ApiError(404, "User not registered");
    }

    const passwordCheck = await user.isPasswordCorrect(password); // this function is 
    // accessed only by "user" and not by "User" as "User" is an object of mongoose but 
    // "user" is an object created by you

    if (!passwordCheck) {
        throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true, // cookies can only be managed from server 
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    // Since, the authMiddleWare has been executed before the execution of this method , 
    // req.user must have been created before this, so we can directly access req.user._id
    // to extract the userId
    await User.findByIdAndUpdate(
        req.user._id,
        { // we are updating the user document in the database and setting the refreshToken to undefined
            $set: {
                refreshToken: undefined
            }
        },
        { // this option is used to return the updated document instead of the original document
            new: true
        }
    )

    const options = {
        httpOnly: true, // cookies can only be managed from server 
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    console.log(incomingRefreshToken);
    
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh Token")
        }
    
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh Token in expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200, {
                accessToken,
                refreshToken
            },
                "Access token refreshed"
            ))
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid refresh token")
    }
})
export { registerUser, loginUser, logoutUser , refreshAccessToken};