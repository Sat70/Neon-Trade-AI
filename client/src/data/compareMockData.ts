/**
 * Mock data for Compare page. Replace with real ML Model later.
 */

export type TimeHorizonCompare = 'Short Term' | 'Medium Term' | 'Long Term'
export type AIRating = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+'
export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface CompareAssetOption {
  id: string
  ticker: string
  name: string
}

export interface CompareAssetSummary {
  ticker: string
  rating: AIRating
  expectedReturn: number
  riskLevel: RiskLevel
  confidence: number
}

export interface TrajectoryPoint {
  date: string
  [ticker: string]: string | number
}

export interface MetricRow {
  label: string
  unit?: string
  lowerIsBetter?: boolean
  [ticker: string]: string | number | boolean | undefined
}

export interface RiskRewardPoint {
  ticker: string
  risk: number
  expectedReturn: number
  confidence: number
}

export interface TimelinePhase {
  label: string
  startPct: number
  endPct: number
  type: 'entry' | 'peak' | 'risk' | 'neutral'
}

export interface AssetTimeline {
  ticker: string
  phases: TimelinePhase[]
}

// Searchable asset pool (max 4 selectable)
export const assetPool: CompareAssetOption[] = [
  { id: 'aapl', ticker: 'AAPL', name: 'Apple Inc.' },
  { id: 'nvda', ticker: 'NVDA', name: 'NVIDIA Corporation' },
  { id: 'msft', ticker: 'MSFT', name: 'Microsoft Corporation' },
  { id: 'googl', ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { id: 'amzn', ticker: 'AMZN', name: 'Amazon.com Inc.' },
  { id: 'meta', ticker: 'META', name: 'Meta Platforms Inc.' },
  { id: 'tsla', ticker: 'TSLA', name: 'Tesla Inc.' },
  { id: 'jpm', ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
]

// Summary strip: ticker, rating, return %, risk, confidence (for 2–4 selected)
export const comparisonSummaries: CompareAssetSummary[] = [
  { ticker: 'AAPL', rating: 'A', expectedReturn: 12.5, riskLevel: 'Low', confidence: 85 },
  { ticker: 'NVDA', rating: 'A+', expectedReturn: 18.2, riskLevel: 'Medium', confidence: 82 },
  { ticker: 'MSFT', rating: 'A', expectedReturn: 14.1, riskLevel: 'Low', confidence: 88 },
]

// Multi-line trajectory: one key per ticker + date
export const trajectoryComparisonData: TrajectoryPoint[] = [
  { date: 'D0', AAPL: 189, NVDA: 142, MSFT: 418 },
  { date: 'D7', AAPL: 192, NVDA: 148, MSFT: 425 },
  { date: 'D14', AAPL: 196, NVDA: 155, MSFT: 432 },
  { date: 'D21', AAPL: 200, NVDA: 162, MSFT: 438 },
  { date: 'D30', AAPL: 212, NVDA: 168, MSFT: 447 },
]

// Metric table: rows = metrics, columns = tickers; best per row highlighted
export const comparisonMatrixRows: MetricRow[] = [
  { label: 'Expected upside', unit: '%', AAPL: 12.5, NVDA: 18.2, MSFT: 14.1 },
  { label: 'Max drawdown risk', unit: '%', lowerIsBetter: true, AAPL: 8, NVDA: 14, MSFT: 7 },
  { label: 'Volatility forecast', unit: '%', lowerIsBetter: true, AAPL: 22, NVDA: 35, MSFT: 20 },
  { label: 'AI confidence', unit: '%', AAPL: 85, NVDA: 82, MSFT: 88 },
  { label: 'Time to target', unit: 'days', lowerIsBetter: true, AAPL: 30, NVDA: 21, MSFT: 28 },
  { label: 'Signal stability', unit: '/10', AAPL: 8.2, NVDA: 7.1, MSFT: 8.8 },
  { label: 'Risk-adjusted score', unit: '/100', AAPL: 78, NVDA: 72, MSFT: 84 },
]

// Risk vs reward scatter
export const riskRewardData: RiskRewardPoint[] = [
  { ticker: 'AAPL', risk: 8, expectedReturn: 12.5, confidence: 85 },
  { ticker: 'NVDA', risk: 14, expectedReturn: 18.2, confidence: 82 },
  { ticker: 'MSFT', risk: 7, expectedReturn: 14.1, confidence: 88 },
]

// Timeline: entry window, peak window, risk period per asset
export const timelineComparisonData: AssetTimeline[] = [
  {
    ticker: 'AAPL',
    phases: [
      { label: 'Entry', startPct: 0, endPct: 15, type: 'entry' },
      { label: 'Peak', startPct: 50, endPct: 85, type: 'peak' },
      { label: 'Risk up', startPct: 85, endPct: 100, type: 'risk' },
    ],
  },
  {
    ticker: 'NVDA',
    phases: [
      { label: 'Entry', startPct: 0, endPct: 20, type: 'entry' },
      { label: 'Peak', startPct: 40, endPct: 75, type: 'peak' },
      { label: 'Risk up', startPct: 75, endPct: 100, type: 'risk' },
    ],
  },
  {
    ticker: 'MSFT',
    phases: [
      { label: 'Entry', startPct: 0, endPct: 18, type: 'entry' },
      { label: 'Peak', startPct: 45, endPct: 90, type: 'peak' },
      { label: 'Risk up', startPct: 90, endPct: 100, type: 'risk' },
    ],
  },
]

export const aiVerdictText =
  'Among the selected assets, MSFT shows the strongest risk-adjusted profile with the highest AI confidence (88%) and best risk-adjusted score. AAPL offers solid upside with the lowest volatility—better for short-term momentum and capital preservation. NVDA has the highest expected return but comes with greater drawdown risk; it fits a medium-term horizon if you can tolerate volatility. Conclusion: For a safer long-term allocation, prefer MSFT or AAPL; for higher upside with more volatility, NVDA is the pick.'
