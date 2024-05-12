import dotenv from "dotenv"
dotenv.config({
    path:"./.env",
})
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
  
  try {

    const res=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log("mongodb connected "+res.connection);
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR ", error);
    process.exit(1);
  }
};


export default connectDB