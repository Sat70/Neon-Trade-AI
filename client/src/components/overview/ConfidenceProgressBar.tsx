type ConfidenceProgressBarProps = {
  value: number
  showLabel?: boolean
  className?: string
}

const ConfidenceProgressBar = ({ value, showLabel = true, className = '' }: ConfidenceProgressBarProps) => {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={className}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-lime-400 transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-slate-400">
          <span className="font-medium text-teal-300">{clamped}%</span> confidence
        </p>
      )}
    </div>
  )
}

export default ConfidenceProgressBar
