import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

type ChartDataPoint = { name: string; current?: number; predicted?: number }
type BarDataPoint = { name: string; confidence: number; fill?: string }

type AnalyticsChartsProps = {
  lineData: ChartDataPoint[]
  barData: BarDataPoint[]
}

const chartTheme = {
  stroke: 'rgba(45, 212, 191, 0.9)',
  fill: 'rgba(45, 212, 191, 0.4)',
  grid: 'rgba(255, 255, 255, 0.06)',
  text: 'rgba(148, 163, 184, 0.9)',
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur">
      <p className="text-xs text-slate-400">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-medium text-teal-300">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

const AnalyticsCharts = ({ lineData, barData }: AnalyticsChartsProps) => {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
        <h3 className="text-lg font-semibold text-white">Predicted vs Current Price</h3>
        <p className="mt-1 text-sm text-slate-400">7-day trend (mock)</p>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="name" stroke={chartTheme.text} tick={{ fontSize: 12 }} />
              <YAxis stroke={chartTheme.text} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => <span className="text-slate-300">{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="current"
                name="Current"
                stroke="rgba(148, 163, 184, 0.9)"
                strokeWidth={2}
                dot={{ fill: 'rgba(148, 163, 184, 0.6)' }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted"
                stroke={chartTheme.stroke}
                strokeWidth={2}
                dot={{ fill: 'rgba(45, 212, 191, 0.6)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
        <h3 className="text-lg font-semibold text-white">Confidence Comparison</h3>
        <p className="mt-1 text-sm text-slate-400">Top picks by AI confidence</p>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis type="number" domain={[0, 100]} stroke={chartTheme.text} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" stroke={chartTheme.text} tick={{ fontSize: 12 }} width={40} />
              <Tooltip
                content={({ payload }) => (
                  <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur">
                    {payload?.[0] && (
                      <p className="text-sm font-medium text-teal-300">
                        {payload[0].payload.name}: {payload[0].value}%
                      </p>
                    )}
                  </div>
                )}
              />
              <Bar dataKey="confidence" name="Confidence %" radius={[0, 4, 4, 0]} fill="rgba(45, 212, 191, 0.7)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts
