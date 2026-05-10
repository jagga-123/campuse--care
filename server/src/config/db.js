import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not defined - running in mock mode');
    return;
  }

  try {
    const connection = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000,
    });
    
    await Promise.race([
      connection,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 3000)
      )
    ]);
    
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed - running in mock mode:', error.message);
  }
}
