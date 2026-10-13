import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const createStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `roshni-creations/${folderName}`,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
  });
};

const upload = (folderName) => multer({ storage: createStorage(folderName) });

export default upload;
