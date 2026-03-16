import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from 'recharts'
import type { RiskRewardPoint } from '../../data/compareMockData'

const COLORS = [
  'rgba(45, 212, 191, 0.9)',
  'rgba(163, 230, 53, 0.9)',
  'rgba(56, 189, 248, 0.9)',
  'rgba(251, 191, 36, 0.9)',
]

type RiskRewardScatterProps = {
  data: RiskRewardPoint[]
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: RiskRewardPoint }>
}) => {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur">
      <p className="font-semibold text-white">{p.ticker}</p>
      <p className="mt-1 text-xs text-slate-400">Risk: {p.risk}%</p>
      <p className="text-xs text-slate-400">Expected return: {p.expectedReturn}%</p>
      <p className="text-xs text-slate-400">Confidence: {p.confidence}%</p>
    </div>
  )
}

export default function RiskRewardScatter({ data }: RiskRewardScatterProps) {
  if (data.length === 0) return null

  // Scale bubble size by confidence (z maps to radius via ZAxis range)
  const scaled = data.map((d) => ({
    ...d,
    z: Math.max(40, (d.confidence / 100) * 120),
  }))

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <h2 className="text-lg font-semibold text-white">Risk vs Reward Positioning</h2>
      <p className="mt-1 text-sm text-slate-400">
        X: Risk · Y: Expected return · Bubble size: AI confidence
      </p>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              type="number"
              dataKey="risk"
              name="Risk"
              stroke="rgba(148,163,184,0.9)"
              tick={{ fontSize: 12 }}
              label={{ value: 'Risk %', position: 'bottom', fill: 'rgba(148,163,184,0.8)' }}
            />
            <YAxis
              type="number"
              dataKey="expectedReturn"
              name="Return"
              stroke="rgba(148,163,184,0.9)"
              tick={{ fontSize: 12 }}
              label={{ value: 'Expected Return %', angle: -90, position: 'insideLeft', fill: 'rgba(148,163,184,0.8)' }}
            />
            <ZAxis type="number" dataKey="z" range={[40, 120]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(45,212,191,0.5)' }} />
            <Scatter name="Assets" data={scaled}>
              {scaled.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
