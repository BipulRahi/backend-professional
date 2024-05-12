import dotenv from "dotenv"
dotenv.config({
    path:'./env'
})


import connectDB from "./db/index.js";



connectDB()






// import express from "express";
// const app=express();
// ;(async()=>{
//     try {
//         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",()=>{console.log(error);throw error})
//         app.listen(process.env.PORT,()=>{console.log("app is listing on port "+process.env.PORT);})
//     } catch (error) {
//         console.log(error);
//     }
// })()