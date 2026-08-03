import mongoose, { Schema } from "mongoose";

import jwt from "jsonwebtoken"; // jwt is a package used for tokens
import bcrypt from "bcrypt"; // bcrypt is a package use to hash the password

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // if you want to make a field searchable in a very optimized way , then make index true for that field.
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url 
        required: true
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "password is required"]
    },
    refreshToken: {
        type: String
    }



}, { timestamps: true })



// pre is a hook which is being applied on the userSchema . Using pre , 
// we can perform the opertaion that we want to perform just before a 
// particular task is being started.

// for example here we are using it with save , which means that we want to perform the 
// function just before the file will be saved
// "pre" accepts two parameters :- one is the task before which it needs to be executed (save) 
// and second is the function which we want to perform before save (here we are converting the password into hash)

userSchema.pre("save", async function (next) {  // simple arrow function is not used here because arrow functions do not hold 
    // the current reference , here this function is being applied on userSchema , so it should hold the reference of userSchema ("this" keyword)
    if (!this.isModified("password")) return next // hash only when the password is modified else no need

    this.password = await bcrypt.hash(this.password, 10)
    next
    // .hash is a function which is used which bcrypt to hash the currrent password .. 
    // it accepts two parameteres : - the password and a no. (how many rounds)
})

// just like hooks , we can create our own custom methods.... following method will be used to check if the entered password is correct or not 

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)  // bcrypt has a function called "comapre" which compares the password with the hashed password
}
 
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname, // this is coming from the database
        },
        process.env.ACCESS_TOKEN_SECERT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema);

