import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import predictionRoutes from './routes/predictionRoutes'
import authRouter from './routes/auth'
import { connectDB } from './config/db'
import prisma from './prisma'

dotenv.config()
const app = express()
const PORT = process.env.PORT ?? 5000
const DEFAULT_ORIGIN = 'http://localhost:5173'

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? DEFAULT_ORIGIN,
  })
)
app.use(express.json())

app.use('/api/auth', authRouter)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.use('/api/predictions', predictionRoutes)

const startServer = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set. Please configure Neon connection string in server/.env.')
    process.exit(1)
  }

  // Ensure Prisma can connect to Neon
  await prisma.$connect()

  // Connect Mongo only if still needed for other features
  await connectDB()

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
  })
}

startServer()
  .catch((error) => {
    console.error('Failed to start server', error)
    process.exit(1)
  })

