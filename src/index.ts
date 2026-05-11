import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import predictionRoutes from './routes/predictionRoutes'
import signalRoutes from './routes/signalRoutes'
import riskRoutes from './routes/riskRoutes'
import scenarioRoutes from './routes/scenarioRoutes'
import timingRoutes from './routes/timingRoutes'
import insightsRoutes from './routes/insightsRoutes'
import authRouter from './routes/auth'
import { connectDB } from './config/db'
import { seedDemoUser } from './seedDemoUser'

dotenv.config()
const app = express()
const PORT = process.env.PORT ?? 3000
const DEFAULT_ORIGIN = 'http://localhost:5173'

// Allow localhost on any port (Vite may use 5173, 5174, etc.) and explicit CLIENT_ORIGIN
const allowedOrigins = [
  DEFAULT_ORIGIN,
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]
if (process.env.CLIENT_ORIGIN && !allowedOrigins.includes(process.env.CLIENT_ORIGIN)) {
  allowedOrigins.push(process.env.CLIENT_ORIGIN)
}
app.use(
  cors({
    origin: (origin, cb) => {
      const allow = !origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      cb(null, allow ? origin || allowedOrigins[0] : false)
    },
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json())

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/predictions', predictionRoutes)
app.use('/api/signal', signalRoutes)
app.use('/api/risk', riskRoutes)
app.use('/api/scenarios', scenarioRoutes)
app.use('/api/timing', timingRoutes)
app.use('/api/insights', insightsRoutes)

const startServer = async () => {
  await connectDB()

  await seedDemoUser()

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`API listening on http://localhost:${PORT}`)
    console.log(`  Health check: curl http://localhost:${PORT}/api/health`)
  })
}

startServer()
  .catch((error) => {
    console.error('Failed to start server', error)
    process.exit(1)
  })

