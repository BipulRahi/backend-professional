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
     console.log("file uploaded Successfully ",res);
     return res.url

  } catch (error) {
    fs.unlinkSync(localfilepath)
    // it remove the locally  file as the upload operaation is get failed 
    return null;
  }
};

cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" },
  function (error, result) {
    console.log(result);
  }
);
