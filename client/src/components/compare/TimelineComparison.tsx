import type { AssetTimeline, TimelinePhase } from '../../data/compareMockData'

const phaseStyles: Record<TimelinePhase['type'], string> = {
  entry: 'bg-teal-500/50 border-teal-400/60',
  peak: 'bg-emerald-500/50 border-emerald-400/60',
  risk: 'bg-rose-500/40 border-rose-400/50',
  neutral: 'bg-slate-500/30 border-slate-400/40',
}

type TimelineComparisonProps = {
  timelines: AssetTimeline[]
}

export default function TimelineComparison({ timelines }: TimelineComparisonProps) {
  if (timelines.length === 0) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <h2 className="text-lg font-semibold text-white">Timing Advantage Comparison</h2>
      <p className="mt-1 text-sm text-slate-400">
        Entry window, peak expectation window, and risk increase period per asset
      </p>
      <div className="mt-6 space-y-6">
        {timelines.map(({ ticker, phases }) => (
          <div key={ticker} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white">{ticker}</span>
            </div>
            <div className="relative h-10 w-full overflow-hidden rounded-lg bg-black/40">
              {phases.map((phase, i) => (
                <div
                  key={`${ticker}-${phase.label}-${i}`}
                  className={`absolute top-1 bottom-1 rounded border ${phaseStyles[phase.type]}`}
                  style={{
                    left: `${phase.startPct}%`,
                    width: `${phase.endPct - phase.startPct}%`,
                  }}
                  title={`${phase.label}: ${phase.startPct}%–${phase.endPct}%`}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/90">
                    {phase.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded bg-teal-500/50" /> Entry
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded bg-emerald-500/50" /> Peak
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded bg-rose-500/40" /> Risk up
        </span>
      </div>
    </div>
  )
}
