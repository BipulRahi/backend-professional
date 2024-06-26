import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessandrefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accessToken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();
    user.refreshToken = refreshtoken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access token "
    );
  }
};

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
    [fullname, name, email, password, username].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All field are manadatory and required");
  }

  // const existedUser=User.findOne({}) // here we give query like usernme etc but for double chek means for chek for username and email also we use diff things
  const existeduser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existeduser) {
    throw new ApiError(409, "User already exists ");
  }
  console.log("\n here is req \n", req.files);
  const avatarlocalpath = req.files?.avatar[0]?.path;
  //   const coverImagelocalpath = req.files?.coverImage[0]?.path;
  let coverImagelocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagelocalpath = req.files.coverImage[0].path;
  }
  if (!avatarlocalpath) throw new ApiError(408, "avatar not found ");

  const avatar = await uploadOnCloudinary(avatarlocalpath);
  const coverImage = await uploadOnCloudinary(coverImagelocalpath);
  if (!avatar) throw new ApiError(400, "avatar not uploaded to cloudinary");

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createduser)
    throw new ApiError(
      500,
      "something went wrong while registering the user db nhai kr pay model user k "
    );
  // res.status(201).json({createduser})
  res
    .status(201)
    .json(new ApiResponse(200, createduser, "user register successfully"));

  //   res.json({ name, fullname, password, username });
});

const loginuser = asynchandler(async (req, res) => {
  // req.body->data
  //username or email
  // find user
  // password check
  // ccess nd refresh token generate
  // cookie

  const { email, password, username } = req.body;

  if (!username || !email)
    throw new ApiError(400, "user name or email must needed");
  if (!password) throw new ApiError(400, "password needed ");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new ApiError("please sign up first");
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(400, "User doesnt exists");

  const {accessToken, refreshtoken } = await generateAccessandrefreshToken(user._id);
  
// console.log(user);

  // console.log("\n\n printing token \n\n ",accessToken,refreshtoken);
  const loggineduser = await User.findById(user._id)
  .select(
    "-password -refreshToken"
  );
// console.log("BIPUL",loggineduser)
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshtoken, option)
    .json(
      new ApiResponse(
        200,
        { user: loggineduser, accessToken, refreshtoken },
        "User logged in sucesssfully"
      )
    );
});


const logoutuser=asynchandler(async(req,res)=>{
await User.findByIdAndUpdate(req.user._id,
  {
    $set:{refreshToken:null}
  },
{
  new:true
})



const option = {
  httpOnly: true,
  secure: true,
};

res.status(200)
.clearCookie("accessToken",option)
.clearCookie("refreshToken",option)
.json(new ApiResponse(200,{},"user logged out "))

})


const refreshAccessToken=asynchandler(async(req,res)=>{

  const incommingAccessToken=req.cookies?.refreshToken || req.body.refreshToken;

  if(!incommingAccessToken) throw new ApiError(400,"the token not in the cookies while refreshing the Access token");

// console.log(incommingAccessToken)
  
try {
    
    const income=jwt.verify(incommingAccessToken,process.env.REFRESH_TOKEN_SECRET)
    const user=await User.findById(income?._id);
    if(!user) throw new ApiError(400,"invalid token no user found with tthis token");
    if(incommingAccessToken!==user?.refreshToken){throw new ApiError(400,"token not match with the given and token in db")};
    
  
  
    const {  accessToken ,refreshtoken} = await generateAccessandrefreshToken(user._id);
  // console.log("heheheh"+ refreshtoken);
    const option = {
      httpOnly: true,
      secure: true,
    };
    console.log(refreshtoken==incommingAccessToken);

    res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshtoken,option)
    .json(new ApiResponse(
      200,{
        accessToken:accessToken,
        refreshToken:refreshtoken,
    
      },"Access tokeen refreshes "
    ))
    
  } catch (error) {
    throw new ApiError(400,error.message || "token jwt invalid ")
  }
  
})

// 19 20 21

export { registeruser, loginuser,logoutuser,refreshAccessToken };
