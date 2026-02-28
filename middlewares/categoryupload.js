import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "categories", // 👈 NEW folder
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export const categoryupload = multer({ storage: categoryStorage });