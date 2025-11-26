type StatsCardProps = {
  title: string
  value: string
  delta?: string
  subtitle?: string
}

const StatsCard = ({ title, value, delta, subtitle }: StatsCardProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-3xl font-semibold text-white">{value}</p>
        {delta && <span className="text-xs text-lime-300">{delta}</span>}
      </div>
      {subtitle && <p className="mt-2 text-xs text-slate-400">{subtitle}</p>}
    </div>
  )
}

export default StatsCard

