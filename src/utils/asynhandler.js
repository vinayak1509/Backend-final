// for promises : 
// requestHandler is a function which is being resolved here

const asyncHandler = (requestHandler) =>{
    (req , res , next) => {
        Promise.resolve(requestHandler(req , res , next)).catch((err) => next(err))
    }
}




export {asyncHandler};

// const asyncHandler = () => {} // normal function 
// const asyncHandler = (func) => () => {} // this higher order function accepts the normal function as parameter
// const asyncHandler = (func) => async () => {} // now , the upper function is passed into another higher order function


// higher order function 

// using try catch: 

// const asyncHandler = (fn) => async (req , res , next) =>{
//     try{
//         await fn(req , res , next)
//     } catch(error) { // this is a way of handling errors , if error has a code then that will be displayed , otherwise 500
//         req.status(error.code || 500).json({ // further we have json in this , which sends success flag and error
//             success : true,
//             message : error.message
//         });
        
//     }
// }


// above we are sending a json response for error , but we should have a standardised code for these kind of situations..
// This means that if we dont have a standardised code , then someone can send success flag before status or error message before anything
// that's why we need a standardised code.
// Now we want to make the api resonse as well as api error standardised
// for this we need to write some extra code , 
// Go to utils/ApiError.js
 