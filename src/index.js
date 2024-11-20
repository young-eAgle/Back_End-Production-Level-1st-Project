// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/db.js";
import app from './app.js'

dotenv.config({path:'./env'})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||80000 ,()=>{
        console.log(`Server is running at port:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO DB Connection Failed!!!", err);
})

/*

import express from "express";

const app = express()

(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("ERROR:" , error)
            throw error
        })


        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }catch (error){
        console.error("ERROR:" ,error)
        throw err
    }
})()

 */

/* above given approach is called if ease and we are using async and await and try catch 
for the proper way of connecting data.   */


// function connectDB(){



// }



// connectDB()