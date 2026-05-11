import mongoose from 'mongoose'

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('MONGODB_URI not set. Please configure MongoDB connection string in .env')
    process.exit(1)
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return
    }
    await mongoose.connect(uri)
    console.log('Local MongoDB connected ✅')
  } catch (error) {
    console.error('MongoDB connection error ❌', (error as Error).message)
    process.exit(1)
  }
}




