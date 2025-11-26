import { Router, Request, Response } from 'express'

const router = Router()

type SamplePrediction = {
  symbol: string
  direction: 'bullish' | 'bearish' | 'neutral'
  timeframe: string
  confidence: number
  targetPrice: number
  generatedAt: string
}

const samplePredictions: SamplePrediction[] = [
  {
    symbol: 'AAPL',
    direction: 'bullish',
    timeframe: '24h',
    confidence: 0.82,
    targetPrice: 212.4,
    generatedAt: new Date().toISOString(),
  },
  {
    symbol: 'NVDA',
    direction: 'bullish',
    timeframe: '48h',
    confidence: 0.76,
    targetPrice: 134.2,
    generatedAt: new Date().toISOString(),
  },
  {
    symbol: 'TSLA',
    direction: 'neutral',
    timeframe: '24h',
    confidence: 0.58,
    targetPrice: 222.1,
    generatedAt: new Date().toISOString(),
  },
]

router.get('/', (_req: Request, res: Response) => {
  res.json({ predictions: samplePredictions })
})

router.post('/', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Create prediction not implemented yet.' })
})

router.put('/:id', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Update prediction not implemented yet.' })
})

router.delete('/:id', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Delete prediction not implemented yet.' })
})

export default router

