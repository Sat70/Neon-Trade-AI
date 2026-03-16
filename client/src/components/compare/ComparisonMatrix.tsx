import type { MetricRow } from '../../data/compareMockData'

type ComparisonMatrixProps = {
  rows: MetricRow[]
  tickers: string[]
}

function getBestValue(row: MetricRow, tickers: string[]): string | null {
  const values = tickers
    .map((t) => ({ t, v: row[t] as number }))
    .filter((x) => typeof x.v === 'number')
  if (values.length === 0) return null
  const lowerIsBetter = row.lowerIsBetter === true
  const sorted = [...values].sort((a, b) => (lowerIsBetter ? a.v - b.v : b.v - a.v))
  return sorted[0].t
}

export default function ComparisonMatrix({ rows, tickers }: ComparisonMatrixProps) {
  if (tickers.length === 0) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <div className="border-b border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">Metric-by-Metric Comparison</h2>
        <p className="mt-1 text-sm text-slate-400">
          Best value per row highlighted. Color-coded strengths and weaknesses.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left font-medium text-slate-400">Metric</th>
              {tickers.map((t) => (
                <th key={t} className="px-4 py-3 text-center font-semibold text-white">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const bestTicker = getBestValue(row, tickers)
              return (
                <tr
                  key={row.label}
                  className={`border-b border-white/5 ${i % 2 === 1 ? 'bg-white/[0.02]' : ''}`}
                >
                  <td className="px-4 py-3 text-slate-300">
                    {row.label}
                    {row.unit && <span className="ml-1 text-slate-500">{row.unit}</span>}
                  </td>
                  {tickers.map((t) => {
                    const val = row[t]
                    const isBest = bestTicker === t
                    const num = typeof val === 'number' ? val : '—'
                    const display = typeof num === 'number' ? (Number.isInteger(num) ? num : num.toFixed(1)) : num
                    return (
                      <td
                        key={t}
                        className={`px-4 py-3 text-center ${
                          isBest ? 'font-semibold text-teal-300' : 'text-slate-300'
                        }`}
                      >
                        {isBest && (
                          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-teal-400" />
                        )}
                        {display}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
