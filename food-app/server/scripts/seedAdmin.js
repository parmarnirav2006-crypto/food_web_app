import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || 'admin@quickbite.app';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log(`Updated existing user as admin: ${email}`);
    } else {
      await User.create({
        name: 'QuickBite Admin',
        email,
        password,
        role: 'admin',
        isVerified: true
      });
      console.log(`Admin user created: ${email}`);
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();
