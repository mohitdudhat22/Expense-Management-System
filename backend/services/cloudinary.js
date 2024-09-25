import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'avatars',
      resource_type: 'auto'
    });
    console.log("file uploaded to cloudinary successfully");
    return result;
  } catch (error) {
    fs.unlinkSync(filePath); // Delete the file after upload attempt
    console.error("Error uploading file to cloudinary:", error);
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("file deleted from cloudinary successfully");
  } catch (error) {
    console.error("Error deleting file from cloudinary:", error);
    throw error;
  }
};  



