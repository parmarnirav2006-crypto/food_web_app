import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), upload.single('image'), uploadImage);

export default router;
