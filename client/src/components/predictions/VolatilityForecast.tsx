import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from 'recharts'
import type { VolatilityPoint } from '../../data/predictionsMockData'

type VolatilityForecastProps = {
  data: VolatilityPoint[]
}

const zoneColors: Record<string, string> = {
  low: 'rgba(45, 212, 191, 0.4)',
  normal: 'rgba(148, 163, 184, 0.3)',
  high: 'rgba(251, 191, 36, 0.4)',
  spike: 'rgba(244, 63, 94, 0.4)',
}

export default function VolatilityForecast({ data }: VolatilityForecastProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <h2 className="text-lg font-semibold text-white">Risk & Volatility Outlook</h2>
      <p className="mt-1 text-sm text-slate-400">Volatility forecast curve and risk expansion/contraction zones</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2 py-1 text-emerald-300">
          Low Risk Window
        </span>
        <span className="rounded-full border border-rose-400/40 bg-rose-500/20 px-2 py-1 text-rose-300">
          Volatility Spike Expected
        </span>
      </div>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="rgba(148,163,184,0.9)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(148,163,184,0.9)" tick={{ fontSize: 12 }} domain={[0, 'auto']} />
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.[0] ? (
                  <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur">
                    <p className="text-sm text-slate-400">{payload[0].payload.date}</p>
                    <p className="text-sm font-medium text-teal-300">
                      Volatility: {(payload[0].value as number).toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{payload[0].payload.zone}</p>
                  </div>
                ) : null
              }
            />
            <Line
              type="monotone"
              dataKey="volatility"
              name="Volatility"
              stroke="rgba(45, 212, 191, 0.9)"
              strokeWidth={2}
              dot={{ fill: 'rgba(45, 212, 191, 0.8)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
