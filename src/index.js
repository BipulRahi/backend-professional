
import connectDB from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("😎 Server is running on PORT ", process.env.PORT);
    });
  })
  .catch((e) => {console.log("Mongodb connection failed ",e);});

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
