// step 1 : Using multer ,  we will take the file from user and upload it temporarily on local server 
// step 2 : Using cloudinary, we will take that file from the local storage and upload it on the server


import fs from "fs" // filesystem
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null;
        }
        // upload the file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type: "auto"
        })
        // file has successfully beed uploaded
        console.log("file is uploaded on cloudinary" , response.url); // the public url after the file has been uploaded
        return response;
    } catch(err){
        // if we are inside this catch block , this means that we have the local file path
        // but there was a problem uploading it on cloudinary, so we need to delete (or unlink) 
        // that file from the local storage

        fs.unlink(localFilePath) // remove the locally saved temporary file as the upload opn got failed
        return null;
    }
}

export {uploadOnCloudinary};

