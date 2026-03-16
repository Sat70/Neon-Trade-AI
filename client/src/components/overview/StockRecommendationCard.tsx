import { Link } from 'react-router-dom'
import type { StockRecommendation } from '../../data/overviewMockData'
import TrendBadge from './TrendBadge'
import ConfidenceProgressBar from './ConfidenceProgressBar'

type StockRecommendationCardProps = {
  stock: StockRecommendation
}

const riskColors: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-rose-400',
}

const StockRecommendationCard = ({ stock }: StockRecommendationCardProps) => {
  return (
    <div data-cursor="hover" className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-teal-500/10 backdrop-blur-lg transition hover:border-teal-400/30 hover:shadow-teal-500/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-bold text-white">{stock.ticker}</p>
          <p className="mt-1 text-sm text-slate-400">{stock.name}</p>
        </div>
        <TrendBadge signal={stock.signal} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-400">Price</p>
          <p className="font-semibold text-white">${stock.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-400">Predicted upside</p>
          <p className="font-semibold text-lime-400">+{stock.predictedUpside}%</p>
        </div>
        <div>
          <p className="text-slate-400">Horizon</p>
          <p className="text-white">{stock.horizon}</p>
        </div>
        <div>
          <p className="text-slate-400">Risk</p>
          <p className={riskColors[stock.risk] ?? 'text-slate-300'}>{stock.risk}</p>
        </div>
      </div>
      <div className="mt-4">
        <ConfidenceProgressBar value={stock.confidence} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to="/dashboard"
          className="rounded-full border border-teal-400/50 bg-teal-500/20 px-4 py-2 text-xs font-semibold text-teal-200 transition hover:bg-teal-500/30"
        >
          View Details
        </Link>
        <button
          type="button"
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-teal-300 hover:text-teal-200"
        >
          Compare
        </button>
      </div>
    </div>
  )
}

export default StockRecommendationCard
