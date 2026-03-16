import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import type { ComparisonAsset } from '../../data/predictionsMockData'

type PredictionComparisonChartProps = {
  assets: ComparisonAsset[]
}

const tealFill = 'rgba(45, 212, 191, 0.3)'
const limeFill = 'rgba(163, 230, 53, 0.25)'

function toRadarData(assets: ComparisonAsset[]) {
  const keys = ['expectedUpside', 'confidence', 'timeToTarget', 'drawdownRisk'] as const
  const labels: Record<string, string> = {
    expectedUpside: 'Upside %',
    confidence: 'Confidence',
    timeToTarget: 'Days to Target',
    drawdownRisk: 'Drawdown Risk',
  }
  return keys.map((key) => {
    const point: Record<string, string | number> = { subject: labels[key], fullMark: key === 'drawdownRisk' ? 20 : 100 }
    assets.forEach((a, i) => {
      point[`asset${i}`] = a[key]
    })
    return point
  })
}

export default function PredictionComparisonChart({ assets }: PredictionComparisonChartProps) {
  const radarData = toRadarData(assets)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <h2 className="text-lg font-semibold text-white">Prediction Comparison</h2>
      <p className="mt-1 text-sm text-slate-400">Side-by-side: expected upside, drawdown risk, time to target, confidence</p>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: 'rgba(148, 163, 184, 0.9)', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 'auto']}
              tick={{ fill: 'rgba(148, 163, 184, 0.6)', fontSize: 10 }}
            />
            {assets.map((a, i) => (
              <Radar
                key={a.name}
                name={a.name}
                dataKey={`asset${i}`}
                stroke={i === 0 ? 'rgba(45, 212, 191, 0.9)' : 'rgba(163, 230, 53, 0.9)'}
                fill={i === 0 ? tealFill : limeFill}
                fillOpacity={0.6}
                strokeWidth={1.5}
              />
            ))}
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => <span className="text-slate-300">{value}</span>}
            />
            <Tooltip
              content={({ payload }) =>
                payload?.length ? (
                  <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur">
                    {payload.map((entry) => (
                      <p key={entry.name} className="text-sm text-teal-300">
                        {entry.name}: {typeof entry.value === 'number' ? entry.value : entry.value}
                      </p>
                    ))}
                  </div>
                ) : null
              }
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
