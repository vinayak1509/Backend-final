import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"

const connectDB = async() => {
    try {
        // mongoose.connect return an object so that can be stored into a variable
       const connectionInstance = await mongoose
       .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

       console.log(`\n MongoDB connected !! DB HOST: 
        ${connectionInstance.connection.host}`);
       
    } catch(error) {
        console.log('MONGODB connection error' , error);
        process.exit(1)
    }

}

// We communicate with the database multiple times . This part will be common everytime . 
// So , we can create a separate file and wrap this function inside that file and whenever needed ,  
// we can use that file
// we are creating the file inside the utils folder





export default connectDB