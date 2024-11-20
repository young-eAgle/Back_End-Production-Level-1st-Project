import express from "express";
// import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

/* ========>>   middleware  <<========   */
// middleware starts Here when ever we use app.use its mean we are using middleware.
app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

// app.use(cookieParser())

/* ========>>   routes <<========   */
//routes start here
import userRouter from './routes/user.routes.js'

//routes declaration

/*  when we were using app.get at that time we were writing routes controller 
all in the same file but now things are organized so we will use (app.use) instead of (app.get)  */
app.use("/users", userRouter)



/* But If we are using (api) then we will use api version this will be a standard practice */

app.use("/api/v1/users", userRouter)



//here when user will go /users controll will be provided to userRouter and in the userRouter we will define logic

//http://localhost:8000/users/register         --this will be url for above route

export default app