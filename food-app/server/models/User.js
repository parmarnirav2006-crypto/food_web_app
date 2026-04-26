import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, default: 'India', trim: true },
    contactNumber: { type: String, trim: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    isVerified: { type: Boolean, default: false, index: true },
    refreshToken: { type: String, select: false, default: null },
    otp: {
      code: { type: String, select: false, default: null },
      expiresAt: { type: Date, default: null },
      purpose: { type: String, enum: ['register', 'login'], default: 'login' }
    },
    addresses: [addressSchema],
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

userSchema.index({ createdAt: -1 });

userSchema.pre('save', async function hashPassword(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
