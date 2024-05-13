import jwt from "jsonwebtoken";
import { ApiError } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
export const verifyJWT=asynchandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) throw new ApiError(400,"unautorized handle")
        const decorderd=   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user= await User.findById(decorderd._id).select("-password -refreshToken")
       if(!user) throw new ApiError(400,"invlid token")
        req.user=user;
    next()
    } catch (error) {
        throw new ApiError(401,error?.message||"invalid access token")
    }
})