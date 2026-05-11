import { Request, Response, Router } from 'express'

const router = Router()

const ML_SERVICE_BASE_URL = process.env.ML_SERVICE_URL ?? 'http://127.0.0.1:8000'
const CACHE_TTL_MS = 5 * 60 * 1000
const cache = new Map<string, { expiresAt: number; payload: unknown }>()

router.post('/', async (req: Request, res: Response) => {
  const body = req.body as { type?: string; data?: Record<string, unknown> }
  if (!body?.type || !body?.data) {
    return res.status(400).json({ message: 'Body requires { type, data }.' })
  }

  const cacheKey = `${body.type}:${JSON.stringify(body.data)}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() < cached.expiresAt) {
    return res.json(cached.payload)
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)
    const response = await fetch(`${ML_SERVICE_BASE_URL}/llm-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    const payload = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        message: 'ML service returned an error',
        details: payload,
      })
    }

    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, payload })
    return res.json(payload)
  } catch (error) {
    return res.status(502).json({
      message: 'Failed to reach ML insights service.',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router

