import type { SnapshotMetric } from '../../data/overviewMockData'

type MarketSnapshotCardProps = {
  metric: SnapshotMetric
}

const trendIcon = (trend: 'up' | 'down' | 'neutral') => {
  if (trend === 'up') return <span className="text-lime-400">↑</span>
  if (trend === 'down') return <span className="text-rose-400">↓</span>
  return <span className="text-slate-400">→</span>
}

const MarketSnapshotCard = ({ metric }: MarketSnapshotCardProps) => {
  return (
    <div data-cursor="hover" className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-teal-500/10 backdrop-blur-lg transition hover:border-teal-400/30 hover:shadow-teal-500/20">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{metric.title}</p>
        {trendIcon(metric.trend)}
      </div>
      <p className="mt-3 text-2xl font-semibold text-white md:text-3xl">{metric.value}</p>
      {metric.trendLabel && (
        <p className="mt-1 text-xs text-slate-400">
          <span className="text-lime-400/90">{metric.trendLabel}</span>
        </p>
      )}
      <div className="mt-3 h-px w-12 rounded-full bg-gradient-to-r from-teal-400 to-transparent" />
    </div>
  )
}

export default MarketSnapshotCard
