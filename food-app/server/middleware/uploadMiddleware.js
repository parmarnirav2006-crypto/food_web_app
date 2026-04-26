import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: process.env.CLOUDINARY_FOLDER || 'food-app',
    resource_type: 'image',
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  })
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

export default upload;
