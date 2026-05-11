import { Request, Response, Router } from 'express'

const router = Router()

const ML_SERVICE_BASE_URL = process.env.ML_SERVICE_URL ?? 'http://127.0.0.1:8000'
const VALID_HORIZONS = new Set(['intraday', 'short-term', 'long-term'])
const VALID_TICKERS = new Set(['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'AMD', 'META', 'SPY'])
const CACHE_TTL_MS = 10 * 60 * 1000
const cache = new Map<string, { expiresAt: number; payload: unknown }>()

router.get('/', async (req: Request, res: Response) => {
  const tickerParam = String(req.query.ticker ?? 'AAPL').toUpperCase()
  const horizonParam = String(req.query.horizon ?? 'short-term')
  const cacheKey = `${tickerParam}:${horizonParam}`

  const cached = cache.get(cacheKey)
  if (cached && Date.now() < cached.expiresAt) {
    return res.json(cached.payload)
  }

  if (!VALID_TICKERS.has(tickerParam)) {
    return res.status(400).json({
      message: `Unsupported ticker '${tickerParam}'.`,
      supportedTickers: Array.from(VALID_TICKERS),
    })
  }
  if (!VALID_HORIZONS.has(horizonParam)) {
    return res.status(400).json({
      message: `Unsupported horizon '${horizonParam}'.`,
      supportedHorizons: Array.from(VALID_HORIZONS),
    })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    const response = await fetch(
      `${ML_SERVICE_BASE_URL}/scenarios?ticker=${encodeURIComponent(tickerParam)}&horizon=${encodeURIComponent(horizonParam)}`,
      { signal: controller.signal },
    )
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
      message: 'Failed to reach ML scenario service.',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router

