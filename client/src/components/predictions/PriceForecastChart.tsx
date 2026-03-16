import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts'
import type { PriceTrajectoryPoint } from '../../data/predictionsMockData'

type PriceForecastChartProps = {
  data: PriceTrajectoryPoint[]
}

const chartTheme = {
  grid: 'rgba(255, 255, 255, 0.06)',
  text: 'rgba(148, 163, 184, 0.9)',
  teal: 'rgba(45, 212, 191, 0.9)',
  tealFill: 'rgba(45, 212, 191, 0.15)',
  slate: 'rgba(148, 163, 184, 0.9)',
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
      <p className="text-xs text-slate-400">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-medium text-teal-300">
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
        </p>
      ))}
    </div>
  )
}

export default function PriceForecastChart({ data }: PriceForecastChartProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <h2 className="text-lg font-semibold text-white">AI Price Trajectory Forecast</h2>
      <p className="mt-1 text-sm text-slate-400">Current price vs AI-predicted future with confidence bands</p>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="confidenceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartTheme.teal} stopOpacity={0.2} />
                <stop offset="100%" stopColor={chartTheme.teal} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis dataKey="date" stroke={chartTheme.text} tick={{ fontSize: 12 }} />
            <YAxis stroke={chartTheme.text} tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => <span className="text-slate-300">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#confidenceFill)"
              fillOpacity={1}
            />
            <Area type="monotone" dataKey="lower" stroke="none" fill="rgba(15, 23, 42, 0.9)" />
            <Line
              type="monotone"
              dataKey="current"
              name="Current"
              stroke={chartTheme.slate}
              strokeWidth={2}
              dot={{ fill: chartTheme.slate, r: 3 }}
              strokeDasharray="4 2"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="AI Predicted"
              stroke={chartTheme.teal}
              strokeWidth={2.5}
              dot={{ fill: chartTheme.teal, r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
