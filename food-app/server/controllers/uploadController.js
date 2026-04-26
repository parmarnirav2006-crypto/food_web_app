import asyncHandler from 'express-async-handler';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Image file is required');
  }

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: req.file.path,
      publicId: req.file.filename
    }
  });
});
