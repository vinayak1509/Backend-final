//Node js gives us an Error class,
// Here we will make our own class that will inherit the error class and we will try 
// to overwrite the methods of that class to control the flow of error

class ApiError extends Error {
    // this class has all the properties of the built-in Error class , 
    // below in the constructor, we are specifying the properties which we would need 
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        statck = ""
    ){
        // we are overwriting the methods and variables below;
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if(statck){
            this.stack = statck
        } else{
            Error.captureStackTrace(this , this.constructor)

        } 
        // stacktrace keeps a track of where the error occured.
        //It tells Node.js to generate a stack trace starting from where the ApiError was created,
         //rather than including the constructor itself.

    }
}

// when we create an object of this class , 
// throw new ApiError(404 , "User not found") ---> this means statusCode = 404
// and message = 'User not found'

export {ApiError};