import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"; //Use of cookie-parser is to access user's cookies from the server and set those cookie


const app = express();

// app.use(cors()) //use method is used when we use middleware
// above line is enough to configure CORS , but we can have more options in cors

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit : "16kb"})) // here, JSON is being configured in expresss, it means that it is accpeting json THROUGH FORMS
app.use(express.urlencoded({extended : true , limit : "16kb"})) // we also need to configure the data coming from URL
app.use(express.static("public")) // sometimes , we need to store some files like pdf and photos . for this purpose ,
//  we create a folder "pubblic" and store those files in this folder. The same folder is being configured through static
app.use(cookieParser())

app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend is running"
    });
});

// routes import 
import userRouter from './routes/user.routes.js' 


// routes declaration
// http://localhost:8000/users/register

app.use("/api/v1/users" , userRouter) // as soon as a user types /users , it the control will to
// userRouter means in the user.routes.js file
// Now if we want to route to login user, then we don't need to write it here separately 
// just add another route method in user.routes

export default app;

