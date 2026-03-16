import type { TimingSlot, SignalStrength } from '../../data/predictionsMockData'

type TimingHeatmapProps = {
  slots: TimingSlot[]
  nextEntry?: string
}

const signalColors: Record<SignalStrength, string> = {
  'Strong Buy': 'bg-emerald-500/40 border-emerald-400/60 text-emerald-200',
  Buy: 'bg-teal-500/30 border-teal-400/50 text-teal-200',
  Neutral: 'bg-slate-500/20 border-slate-400/40 text-slate-300',
  Avoid: 'bg-rose-500/30 border-rose-400/50 text-rose-200',
}

export default function TimingHeatmap({ slots, nextEntry }: TimingHeatmapProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <h2 className="text-lg font-semibold text-white">Optimal Entry & Exit Windows</h2>
      <p className="mt-1 text-sm text-slate-400">Time-based signal strength (momentum, volatility, volume, AI confidence)</p>
      {nextEntry && (
        <div className="mt-4 rounded-xl border border-teal-400/30 bg-teal-500/10 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-teal-300">Next High-Probability Entry</p>
          <p className="mt-1 text-sm font-medium text-white">{nextEntry}</p>
        </div>
      )}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {slots.map((slot) => (
          <div
            key={slot.time}
            className={`rounded-xl border p-4 transition ${signalColors[slot.signal]}`}
          >
            <p className="text-lg font-semibold text-white">{slot.time}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider">{slot.signal}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
              <span>Mom {slot.momentum * 100}%</span>
              <span>Vol {(slot.volatility * 100).toFixed(0)}%</span>
              <span>Conf {slot.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
