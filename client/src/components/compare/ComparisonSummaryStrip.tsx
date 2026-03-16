import type { CompareAssetSummary, RiskLevel } from '../../data/compareMockData'
//Quick Verdict
type ComparisonSummaryStripProps = {
  summaries: CompareAssetSummary[]
}

const riskColors: Record<RiskLevel, string> = {
  Low: 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300',
  Medium: 'border-amber-400/50 bg-amber-500/20 text-amber-300',
  High: 'border-rose-400/50 bg-rose-500/20 text-rose-300',
}

const ratingColors: Record<string, string> = {
  'A+': 'text-emerald-400',
  A: 'text-teal-400',
  'A-': 'text-teal-300',
  'B+': 'text-lime-400',
  B: 'text-slate-300',
  'B-': 'text-amber-400',
  'C+': 'text-amber-500',
}

export default function ComparisonSummaryStrip({ summaries }: ComparisonSummaryStripProps) {
  if (summaries.length === 0) return null

  return (
    <div className="p-6 border shadow-xl rounded-2xl border-white/10 bg-white/5 shadow-teal-500/10 backdrop-blur-lg">
      <h2 className="mb-4 text-lg font-semibold text-white">Quick verdict</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map((s) => (
          <div
            key={s.ticker}
            data-cursor="hover"
            className="flex items-center justify-between px-4 py-3 transition border rounded-xl border-white/10 bg-black/30 hover:border-teal-400/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-white">{s.ticker}</span>
              <span className={`text-sm font-semibold ${ratingColors[s.rating] ?? 'text-slate-300'}`}>
                {s.rating}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-right">
              <span className="text-slate-400">
                Return <span className="font-medium text-teal-300">{s.expectedReturn}%</span>
              </span>
              <span className={`rounded-full border px-2 py-0.5 ${riskColors[s.riskLevel]}`}>
                {s.riskLevel}
              </span>
              <span className="text-slate-400">
                Conf <span className="font-medium text-white">{s.confidence}%</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
