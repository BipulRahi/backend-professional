import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/Apierror.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registeruser = asynchandler(async (req, res) => {
  //get data from frontend
  // vlidation - not empty
  // check if user already register ?
  // check for image ,check foe avtar
  // upload them to cloudinary
  // create a user object
  // create entry in db
  // remove password and refresh token from respond
  // check for user creation - return res or return error
  const { name, fullname, password, email, username } = req.body;

  //    if(fullname ==="") throw new ApiError(400,"full name is required ");   bacho wala way
    if (
        [fullname,name,email,password,username].some((fields)=>fields?.trim()==="")
    ) {
        throw new ApiError(400,"All field are manadatory and required")
    }

    // const existedUser=User.findOne({}) // here we give query like usernme etc but for double chek means for chek for username and email also we use diff things 
    const existeduser=User.findOne({
        $or:[{username},{email}]
    })

    if (existeduser) {
        throw ApiError(409,"User already exists ");
    }
    const avatarlocalpath=req.files?.avatar[0]?.path;
    const coverImagelocalpath=req.files?.coverImage[0]?.path;
    if(!avatarlocalpath) throw new ApiError(408,"avatar not found ");

    const avatar=await uploadOnCloudinary(avatarlocalpath);
    const coverImage=await uploadOnCloudinary(coverImagelocalpath);
    if(!avatar) throw new ApiError(400,"avatar not uploaded to cloudinary")

    const user=await User.create({fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",email,password,username:username.toLowerCase()
    })
    const createduser=await User.findById(user._id).select("-password -refreshToken")
    if(!createduser) throw new ApiError(500,"something went wrong while registering the user db nhai kr pay model user k ");
    // res.status(201).json({createduser})
     res.status(201).json(
        new ApiResponse(200,createduser,"user register successfully")
     )

//   res.json({ name, fullname, password, username });
});

export { registeruser };
