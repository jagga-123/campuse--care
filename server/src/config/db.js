import mongoose from 'mongoose';

export default async function connectDB() {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/campuscare';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000,
    });

    console.log(`MongoDB connected: ${uri}`);
  } catch (error) {
    console.warn('MongoDB connection failed:', error.message);
  }
}
