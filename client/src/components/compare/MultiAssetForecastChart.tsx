import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { TrajectoryPoint } from '../../data/compareMockData'

const ASSET_COLORS: Record<string, string> = {
  AAPL: 'rgba(45, 212, 191, 0.95)',
  NVDA: 'rgba(163, 230, 53, 0.95)',
  MSFT: 'rgba(56, 189, 248, 0.95)',
  GOOGL: 'rgba(251, 191, 36, 0.95)',
  AMZN: 'rgba(244, 114, 182, 0.95)',
  META: 'rgba(139, 92, 246, 0.95)',
  TSLA: 'rgba(248, 113, 113, 0.95)',
  JPM: 'rgba(94, 234, 212, 0.95)',
}

const defaultColor = 'rgba(148, 163, 184, 0.9)'

type MultiAssetForecastChartProps = {
  data: TrajectoryPoint[]
  tickers: string[]
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color?: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur">
      <p className="mb-2 text-xs text-slate-400">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
        </p>
      ))}
    </div>
  )
}

export default function MultiAssetForecastChart({ data, tickers }: MultiAssetForecastChartProps) {
  const [visible, setVisible] = useState<Record<string, boolean>>(
    tickers.reduce((acc, t) => ({ ...acc, [t]: true }), {})
  )

  const toggle = (ticker: string) => {
    setVisible((prev) => ({ ...prev, [ticker]: !prev[ticker] }))
  }

  if (tickers.length === 0) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <h2 className="text-lg font-semibold text-white">Predicted Price Trajectory Comparison</h2>
      <p className="mt-1 text-sm text-slate-400">
        Multi-line forecast; hover to compare values at same time. Toggle assets below.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {tickers.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              visible[t]
                ? 'border-teal-400/50 bg-teal-500/20 text-teal-200'
                : 'border-white/10 bg-white/5 text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="rgba(148,163,184,0.9)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(148,163,184,0.9)" tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => (
                <span className={visible[value] ? 'text-slate-300' : 'text-slate-600'}>{value}</span>
              )}
            />
            {tickers.map((ticker) => (
              <Line
                key={ticker}
                type="monotone"
                dataKey={ticker}
                name={ticker}
                stroke={ASSET_COLORS[ticker] ?? defaultColor}
                strokeWidth={2}
                dot={{ r: 3 }}
                hide={!visible[ticker]}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
