import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId).select('-password -refreshToken -otp.code');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Access denied');
  }
  next();
};
