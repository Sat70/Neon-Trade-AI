import { useState } from 'react'
import type { TimeHorizon, AssetType } from '../../data/predictionsMockData'

const timeHorizons: TimeHorizon[] = ['1D', '7D', '30D', '90D']
const assetTypes: AssetType[] = ['Stocks', 'Crypto', 'Indices']

export default function PredictionHeader() {
  const [horizon, setHorizon] = useState<TimeHorizon>('30D')
  const [assetType, setAssetType] = useState<AssetType>('Stocks')

  return (
    <header className="border-b border-white/10 pb-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Predictions</h1>
          <p className="mt-2 text-slate-400">
            AI-powered future price forecasts and optimal investment timing
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex rounded-full border border-white/10 bg-black/40 p-1">
            {timeHorizons.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  horizon === h ? 'bg-teal-500/30 text-white' : 'text-slate-400 hover:text-teal-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <div className="flex rounded-full border border-white/10 bg-black/40 p-1">
            {assetTypes.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAssetType(a)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  assetType === a ? 'bg-teal-500/30 text-white' : 'text-slate-400 hover:text-teal-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
