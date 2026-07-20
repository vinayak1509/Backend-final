// require('dotenv').config({path: './env'}) this makes the code 
// inconsistent as somewhere it is import and now require

import dotenv from 'dotenv'

import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import connectDB from "./db/index.js"; // 2nd approach

// dotenv needs to be configured separately
dotenv.config({
    path: './env'
})



connectDB();





/*
First approach:
everything is written in the index file only , this approach is 
also good and accepted but this pollutes index file very much, so another
approach is to create a separate file to database connection and just import 
that file in index file
import express from "express";

const app  = express();


;(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/
            ${DB_NAME}`) // Database's name is being imported from .env file , that's why process.env
        
            // listener : this is used because there can be cases when the database has successfully 
            // being connected but the express app is not able to communicate, that's why to handle 
            // those error , we are using listeners 'app.on()'

        app.on("error", (error) => {
            console.log("Error : ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("ERROR : ", error);
        throw err
        
    }
})() // iifi

Important points : 
---Database is always in another continent , so always use async await while connecting DB
---Sometimes, while connecting DB , there can be some errors. So , always use try catch to handle error
 */