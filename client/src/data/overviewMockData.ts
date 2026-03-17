/**
 * Mock data for Overview page. Replace with real API later.
 */

export type TimeFilter = 'Intraday' | 'Short Term' | 'Long Term'
export type MarketType = 'Stocks' | 'Crypto' | 'Indices'
export type SignalType = 'Bullish' | 'Neutral' | 'Bearish'
export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface SnapshotMetric {
  title: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  trendLabel?: string
}

export interface StockRecommendation {
  ticker: string
  name: string
  price: number
  predictedUpside: number
  confidence: number
  signal: SignalType
  horizon: TimeFilter
  risk: RiskLevel
}

export interface SectorAllocation {
  sector: string
  percent: number
}

export const marketSnapshotCards: SnapshotMetric[] = [
  { title: 'Market Sentiment', value: 'Bullish', trend: 'up', trendLabel: '+12% vs last week' },
  { title: 'Top Sector Today', value: 'Technology', trend: 'neutral' },
  { title: 'Avg Confidence', value: '82%', trend: 'up', trendLabel: '↑ 3%' },
  { title: 'AI Signal Strength', value: 'Strong', trend: 'up' },
]

export const topPicks: StockRecommendation[] = [
  { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 485.2, predictedUpside: 18.5, confidence: 92, signal: 'Bullish', horizon: 'Short Term', risk: 'Medium' },
  { ticker: 'AAPL', name: 'Apple Inc.', price: 189.84, predictedUpside: 8.2, confidence: 85, signal: 'Bullish', horizon: 'Long Term', risk: 'Low' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', price: 378.91, predictedUpside: 12.1, confidence: 88, signal: 'Bullish', horizon: 'Short Term', risk: 'Low' },
  { ticker: 'TSLA', name: 'Tesla Inc.', price: 248.5, predictedUpside: 15.3, confidence: 78, signal: 'Bullish', horizon: 'Intraday', risk: 'High' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 141.8, predictedUpside: 9.4, confidence: 82, signal: 'Bullish', horizon: 'Long Term', risk: 'Low' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, predictedUpside: 11.2, confidence: 80, signal: 'Bullish', horizon: 'Short Term', risk: 'Medium' },
]

export const sectorBreakdown: SectorAllocation[] = [
  { sector: 'Technology', percent: 42 },
  { sector: 'Finance', percent: 18 },
  { sector: 'Healthcare', percent: 15 },
  { sector: 'Consumer', percent: 12 },
  { sector: 'Energy', percent: 8 },
  { sector: 'Other', percent: 5 },
]

export const chartDataPredictedVsCurrent = [
  { name: 'Mon', current: 180, predicted: 182 },
  { name: 'Tue', current: 182, predicted: 185 },
  { name: 'Wed', current: 184, predicted: 186 },
  { name: 'Thu', current: 183, predicted: 188 },
  { name: 'Fri', current: 186, predicted: 190 },
  { name: 'Sat', current: 188, predicted: 192 },
  { name: 'Sun', current: 189, predicted: 195 },
]

export const confidenceComparisonData = topPicks.slice(0, 6).map((p) => ({
  name: p.ticker,
  confidence: p.confidence,
  fill: p.signal === 'Bullish' ? 'rgba(45, 212, 191, 0.8)' : 'rgba(148, 163, 184, 0.6)',
}))

export const aiInsightText =
  'AI detected strong institutional buying in semiconductor and software stocks, with momentum acceleration and low downside volatility. Sentiment indicators suggest continued strength in technology over the next 2–4 weeks. Consider overweight exposure to large-cap tech with high confidence scores.'
