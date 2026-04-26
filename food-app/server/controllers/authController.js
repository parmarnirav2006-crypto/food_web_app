import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateOTP from '../utils/generateOTP.js';
import sendEmail from '../utils/sendEmail.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie
} from '../utils/generateTokens.js';

const assertValidRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 400;
    throw error;
  }
};

const sendOtpEmail = async (email, otp, purpose) => {
  try {
    await sendEmail({
      to: email,
      subject: `Your Food App ${purpose} OTP`,
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Your verification code</h2>
          <p>Use the OTP below to complete your ${purpose} on Food App:</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #F97316;">${otp}</div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
    // Continue even if email fails — OTP is logged below
  }
  console.log(`\n==========================`);
  console.log(`OTP for ${email}: ${otp}`);
  console.log(`==========================\n`);
};

const issueAuthResponse = async (res, user) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  user.otp = { code: null, expiresAt: null, purpose: 'login' };
  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      addresses: user.addresses
    }
  };
};

export const register = asyncHandler(async (req, res) => {
  assertValidRequest(req);

  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail }).select('+password +otp.code');

  if (user?.isVerified) {
    res.status(409);
    throw new Error('User already exists. Please login instead.');
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  if (!user) {
    user = await User.create({
      name,
      email: normalizedEmail,
      password,
      otp: { code: otp, expiresAt: otpExpiry, purpose: 'register' }
    });
  } else {
    user.name = name;
    user.password = password;
    user.otp = { code: otp, expiresAt: otpExpiry, purpose: 'register' };
    await user.save();
  }

  await sendOtpEmail(normalizedEmail, otp, 'registration');

  res.status(201).json({
    success: true,
    message: 'Registration OTP sent to email',
    email: normalizedEmail
  });
});

export const requestLoginOtp = asyncHandler(async (req, res) => {
  assertValidRequest(req);

  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+password +otp.code');

  if (!user) {
    res.status(404);
    throw new Error('User not found. Please register first.');
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error('Email is not verified. Complete registration OTP first.');
  }

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const otp = generateOTP();
  user.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    purpose: 'login'
  };
  await user.save();

  await sendOtpEmail(normalizedEmail, otp, 'login');

  res.status(200).json({
    success: true,
    message: 'Login OTP sent successfully',
    email: normalizedEmail
  });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email, purpose = 'login' } = req.body;
  const normalizedEmail = email?.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+otp.code');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const otp = generateOTP();
  user.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    purpose
  };
  await user.save();

  await sendOtpEmail(normalizedEmail, otp, purpose);

  res.status(200).json({ success: true, message: 'OTP resent successfully' });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  assertValidRequest(req);

  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+otp.code +refreshToken');

  if (!user || !user.otp?.code) {
    res.status(400);
    throw new Error('OTP not requested');
  }

  if (user.otp.code !== otp) {
    res.status(400);
    throw new Error('Invalid OTP');
  }

  if (!user.otp.expiresAt || user.otp.expiresAt < new Date()) {
    res.status(400);
    throw new Error('OTP expired. Please request a new one.');
  }

  user.isVerified = true;
  const payload = await issueAuthResponse(res, user);

  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    ...payload
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    res.status(401);
    throw new Error('Refresh token missing');
  }

  const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user || user.refreshToken !== incomingRefreshToken) {
    res.status(401);
    throw new Error('Refresh token is invalid');
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);
  user.refreshToken = refreshToken;
  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({ success: true, accessToken });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id).select('+refreshToken');
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.avatar = req.body.avatar || user.avatar;

  if (Array.isArray(req.body.addresses)) {
    user.addresses = req.body.addresses;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      addresses: user.addresses
    }
  });
});