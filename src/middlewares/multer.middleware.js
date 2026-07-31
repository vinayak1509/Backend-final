import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) { // req is the request made by the user 
    // if the req contains only the json data or normal data , then those things we already know how to process
    // but if that data contains any type of file, then multer is used (2nd parameter -> file)
    // 'cb' is the callback function
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage })
