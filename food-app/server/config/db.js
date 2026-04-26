import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from environment variables');
  }

  const conn = await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== 'production'
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
