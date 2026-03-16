import type { SignalType } from '../../data/overviewMockData'

type TrendBadgeProps = {
  signal: SignalType
  className?: string
}

const signalStyles: Record<SignalType, string> = {
  Bullish: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  Neutral: 'bg-slate-500/20 text-slate-300 border-slate-400/40',
  Bearish: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
}

const TrendBadge = ({ signal, className = '' }: TrendBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${signalStyles[signal]} ${className}`}
    >
      {signal === 'Bullish' && '↑ '}
      {signal === 'Bearish' && '↓ '}
      {signal}
    </span>
  )
}

export default TrendBadge
