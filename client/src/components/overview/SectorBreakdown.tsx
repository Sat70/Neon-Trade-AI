import type { SectorAllocation } from '../../data/overviewMockData'

type SectorBreakdownProps = {
  sectors: SectorAllocation[]
}

const SectorBreakdown = ({ sectors }: SectorBreakdownProps) => {
  const maxPercent = Math.max(...sectors.map((s) => s.percent), 1)
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
      <h3 className="text-lg font-semibold text-white">Sector Allocation</h3>
      <p className="mt-1 text-sm text-slate-400">Top sectors recommended by AI</p>
      <div className="mt-6 space-y-4">
        {sectors.map((sector) => (
          <div key={sector.sector}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">{sector.sector}</span>
              <span className="font-medium text-teal-300">{sector.percent}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-lime-400 transition-all duration-700"
                style={{ width: `${(sector.percent / maxPercent) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectorBreakdown
