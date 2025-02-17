import dotenv from "dotenv";

dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading to cloudinary!");
  }
};

// delete path :
const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("failed to delete assets from cloudinary!");
  }
};

export { uploadMediaToCloudinary, deleteMediaFromCloudinary };
