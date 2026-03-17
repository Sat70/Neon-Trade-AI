import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import type { Scenario } from '../../data/predictionsMockData'

type ScenarioCardProps = {
  scenario: Scenario
}

const riskColors: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-rose-400',
}

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  const chartData = scenario.sparkline.map((v, i) => ({ name: `${i}`, value: v }))
  const isNegative = scenario.expectedReturn < 0

  return (
    <div
      data-cursor="hover"
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-teal-500/10 backdrop-blur-lg transition hover:border-teal-400/30 hover:shadow-teal-500/20"
    >
      <h3 className="text-lg font-semibold text-white">{scenario.name}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-400">Expected return</p>
          <p className={`font-semibold ${isNegative ? 'text-rose-400' : 'text-lime-400'}`}>
            {isNegative ? '' : '+'}{scenario.expectedReturn}%
          </p>
        </div>
        <div>
          <p className="text-slate-400">Probability</p>
          <p className="font-semibold text-teal-300">{scenario.probability}%</p>
        </div>
        <div>
          <p className="text-slate-400">Risk</p>
          <p className={riskColors[scenario.risk] ?? 'text-slate-300'}>{scenario.risk}</p>
        </div>
      </div>
      <div className="mt-4 h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <defs>
              <linearGradient id={`spark-${scenario.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(45, 212, 191, 0.4)" />
                <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip content={() => null} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isNegative ? 'rgba(244, 63, 94, 0.8)' : 'rgba(45, 212, 191, 0.8)'}
              fill={isNegative ? 'rgba(244, 63, 94, 0.15)' : 'url(#spark-' + scenario.name + ')'}
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
