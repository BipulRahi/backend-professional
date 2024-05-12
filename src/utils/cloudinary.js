import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { log } from "console";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECREAT,
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
     if(!localfilepath) return null;
     const res = await cloudinary.uploader.upload(localfilepath,{
        resource_type:"auto"
     })
    //  console.log("file uploaded Successfully ",res);

    fs.unlinkSync(localfilepath)
     return res

  } catch (error) {
    fs.unlinkSync(localfilepath)
    // it remove the locally  file as the upload operaation is get failed 
    return null;
  }
};

export {uploadOnCloudinary}