import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dde6a5ng1",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage for Multer
// This stores the file in memory as a Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export { cloudinary, upload };