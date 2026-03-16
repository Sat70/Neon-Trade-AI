import { useState } from 'react'
import type { TimeFilter, MarketType } from '../../data/overviewMockData'

const timeFilters: TimeFilter[] = ['Intraday', 'Short Term', 'Long Term']
const marketTypes: MarketType[] = ['Stocks', 'Crypto', 'Indices']

const OverviewHeader = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Short Term')
  const [marketType, setMarketType] = useState<MarketType>('Stocks')

  return (
    <header className="border-b border-white/10 pb-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Market Overview</h1>
          <p className="mt-2 text-slate-400">
            AI-curated high-confidence investment opportunities
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex rounded-full border border-white/10 bg-black/40 p-1">
            {timeFilters.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeFilter(t)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  timeFilter === t
                    ? 'bg-teal-500/30 text-white'
                    : 'text-slate-400 hover:text-teal-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex rounded-full border border-white/10 bg-black/40 p-1">
            {marketTypes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMarketType(m)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  marketType === m
                    ? 'bg-teal-500/30 text-white'
                    : 'text-slate-400 hover:text-teal-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default OverviewHeader
