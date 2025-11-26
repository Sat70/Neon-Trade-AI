import mongoose from 'mongoose'

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('MONGODB_URI is not set. Please define it in your environment before starting the server.')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(uri)
    // conn.connection.host is available once connected
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:', (error as Error).message)
    process.exit(1)
  }
}


