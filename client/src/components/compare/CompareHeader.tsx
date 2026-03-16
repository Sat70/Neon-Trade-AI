import { useState } from 'react'
import type { TimeHorizonCompare } from '../../data/compareMockData'

const timeHorizons: TimeHorizonCompare[] = ['Short Term', 'Medium Term', 'Long Term']

type CompareHeaderProps = {
  onRunComparison?: () => void
  hasSelection?: boolean
}

export default function CompareHeader({ onRunComparison, hasSelection }: CompareHeaderProps) {
  const [horizon, setHorizon] = useState<TimeHorizonCompare>('Medium Term')

  return (
    <header className="border-b border-white/10 pb-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Compare Assets</h1>
          <p className="mt-2 text-slate-400">
            Side-by-side AI comparison of predicted stocks
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex rounded-full border border-white/10 bg-black/40 p-1">
            {timeHorizons.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={`rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 ${
                  horizon === h ? 'bg-teal-500/30 text-white' : 'text-slate-400 hover:text-teal-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onRunComparison}
            disabled={!hasSelection}
            className="rounded-full bg-gradient-to-r from-teal-400 to-lime-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-teal-500/40 transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            Run Comparison
          </button>
        </div>
      </div>
    </header>
  )
}
