/**
 * Mock data for Predictions page. Replace with real API later.
 */

export type TimeHorizon = '1D' | '7D' | '30D' | '90D'
export type AssetType = 'Stocks' | 'Crypto' | 'Indices'
export type ScenarioName = 'Bull Case' | 'Base Case' | 'Bear Case'
export type SignalStrength = 'Strong Buy' | 'Buy' | 'Neutral' | 'Avoid'

export interface PriceTrajectoryPoint {
  date: string
  current: number
  predicted: number
  upper: number
  lower: number
}

export interface Scenario {
  name: ScenarioName
  expectedReturn: number
  probability: number
  risk: 'Low' | 'Medium' | 'High'
  sparkline: number[]
}

export interface TimingSlot {
  time: string
  signal: SignalStrength
  momentum: number
  volatility: number
  confidence: number
}

export interface ComparisonAsset {
  name: string
  expectedUpside: number
  drawdownRisk: number
  timeToTarget: number
  confidence: number
}

export interface VolatilityPoint {
  date: string
  volatility: number
  zone: 'low' | 'normal' | 'high' | 'spike'
}

// Price trajectory with confidence bands (mock 30-day forecast)
export const priceTrajectoryData: PriceTrajectoryPoint[] = [
  { date: 'D0', current: 189, predicted: 189, upper: 192, lower: 186 },
  { date: 'D5', current: 191, predicted: 194, upper: 198, lower: 190 },
  { date: 'D10', current: 193, predicted: 198, upper: 203, lower: 193 },
  { date: 'D15', current: 195, predicted: 202, upper: 208, lower: 196 },
  { date: 'D20', current: 197, predicted: 206, upper: 212, lower: 200 },
  { date: 'D25', current: 199, predicted: 210, upper: 216, lower: 204 },
  { date: 'D30', current: 201, predicted: 214, upper: 220, lower: 208 },
]

// Scenarios for probabilistic view
export const scenarios: Scenario[] = [
  { name: 'Bull Case', expectedReturn: 18.5, probability: 35, risk: 'Medium', sparkline: [0, 2, 5, 8, 12, 16, 18.5] },
  { name: 'Base Case', expectedReturn: 12.2, probability: 50, risk: 'Low', sparkline: [0, 1, 4, 6, 9, 11, 12.2] },
  { name: 'Bear Case', expectedReturn: -4.2, probability: 15, risk: 'High', sparkline: [0, -0.5, -1.5, -2.5, -3.2, -3.8, -4.2] },
]

// Timing heatmap: time windows vs signal strength (mock)
export const timingSlots: TimingSlot[] = [
  { time: '09:30', signal: 'Neutral', momentum: 0.3, volatility: 0.4, confidence: 72 },
  { time: '10:00', signal: 'Buy', momentum: 0.5, volatility: 0.35, confidence: 78 },
  { time: '10:30', signal: 'Strong Buy', momentum: 0.72, volatility: 0.28, confidence: 85 },
  { time: '11:00', signal: 'Buy', momentum: 0.58, volatility: 0.32, confidence: 80 },
  { time: '11:30', signal: 'Neutral', momentum: 0.4, volatility: 0.38, confidence: 74 },
  { time: '14:00', signal: 'Avoid', momentum: 0.15, volatility: 0.55, confidence: 65 },
  { time: '14:30', signal: 'Neutral', momentum: 0.35, volatility: 0.42, confidence: 70 },
  { time: '15:00', signal: 'Buy', momentum: 0.52, volatility: 0.36, confidence: 79 },
  { time: '15:30', signal: 'Strong Buy', momentum: 0.68, volatility: 0.30, confidence: 83 },
]

// Comparison: two assets for radar/multi-factor
export const comparisonAssets: ComparisonAsset[] = [
  { name: 'AAPL', expectedUpside: 12.5, drawdownRisk: 8, timeToTarget: 30, confidence: 85 },
  { name: 'NVDA', expectedUpside: 18.2, drawdownRisk: 14, timeToTarget: 21, confidence: 78 },
]

// Volatility forecast curve
export const volatilityForecastData: VolatilityPoint[] = [
  { date: 'W1', volatility: 0.22, zone: 'normal' },
  { date: 'W2', volatility: 0.28, zone: 'high' },
  { date: 'W3', volatility: 0.35, zone: 'spike' },
  { date: 'W4', volatility: 0.26, zone: 'normal' },
  { date: 'W5', volatility: 0.20, zone: 'low' },
  { date: 'W6', volatility: 0.18, zone: 'low' },
]

export const aiReasoningText =
  'AI weights price action (momentum and support levels), institutional flow (unusual options and block trades), macro signals (rates and sector rotation), sentiment (social and news), and historical patterns (seasonality and volatility regimes). The current forecast favors upside over the next 30 days with elevated volatility in weeks 2–3; optimal entry windows align with high-confidence Buy signals on the timing heatmap.'

export const nextHighProbabilityEntry = '10:30 – 11:00 · Strong Buy · 85% confidence'
