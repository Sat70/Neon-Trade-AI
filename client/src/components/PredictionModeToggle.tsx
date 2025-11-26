export type PredictionMode = 'Intraday' | 'Swing' | 'Long Term'

type PredictionModeToggleProps = {
  value: PredictionMode
  onChange: (mode: PredictionMode) => void
}

const options: PredictionMode[] = ['Intraday', 'Swing', 'Long Term']

const PredictionModeToggle = ({ value, onChange }: PredictionModeToggleProps) => {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 shadow-inner shadow-black/30">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <p>Prediction Mode</p>
        <p className="text-xs uppercase tracking-wide text-teal-200">{value}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {options.map((option) => {
          const isActive = option === value
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'border-teal-300/70 bg-gradient-to-br from-teal-400/30 to-lime-300/30 text-white shadow-lg shadow-teal-500/30'
                  : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PredictionModeToggle

