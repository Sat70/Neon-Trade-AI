import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CompareHeader from '../components/compare/CompareHeader'
import AssetMultiSelector from '../components/compare/AssetMultiSelector'
import ComparisonSummaryStrip from '../components/compare/ComparisonSummaryStrip'
import MultiAssetForecastChart from '../components/compare/MultiAssetForecastChart'
import ComparisonMatrix from '../components/compare/ComparisonMatrix'
import RiskRewardScatter from '../components/compare/RiskRewardScatter'
import TimelineComparison from '../components/compare/TimelineComparison'
import AIVerdictPanel from '../components/compare/AIVerdictPanel'
import {
  assetPool,
  comparisonSummaries,
  trajectoryComparisonData,
  comparisonMatrixRows,
  riskRewardData,
  timelineComparisonData,
  aiVerdictText,
} from '../data/compareMockData'
import type { CompareAssetOption } from '../data/compareMockData'

const COMPARE_TICKERS = ['AAPL', 'NVDA', 'MSFT']

export default function ComparePage() {
  const [selected, setSelected] = useState<CompareAssetOption[]>([])
  const [hasRun, setHasRun] = useState(false)

  const runComparison = () => {
    if (selected.length >= 2) setHasRun(true)
  }

  const showComparison = hasRun && selected.length >= 2
  const tickers = showComparison ? COMPARE_TICKERS : []

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-60">
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-10 top-1/2 h-80 w-80 rounded-full bg-purple-600/30 blur-[220px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[length:80px_80px]" />
      </div>

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-8">
        <CompareHeader
          onRunComparison={runComparison}
          hasSelection={selected.length >= 2}
        />

        <section className="mt-8">
          <AssetMultiSelector
            pool={assetPool}
            selected={selected}
            onChange={setSelected}
          />
        </section>

        {!showComparison && (
          <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-lg">
            <p className="text-slate-400">
              Select 2–4 assets above and click <strong className="text-teal-300">Run Comparison</strong> to see side-by-side AI analysis, risk vs reward, and timing advantage.
            </p>
            {selected.length === 1 && (
              <p className="mt-2 text-sm text-amber-300/90">Add at least one more asset to compare.</p>
            )}
          </section>
        )}

        {showComparison && (
          <>
            <section className="mt-10">
              <ComparisonSummaryStrip summaries={comparisonSummaries} />
            </section>

            <section className="mt-14">
              <MultiAssetForecastChart data={trajectoryComparisonData} tickers={tickers} />
            </section>

            <section className="mt-14">
              <ComparisonMatrix rows={comparisonMatrixRows} tickers={tickers} />
            </section>

            <section className="mt-14">
              <RiskRewardScatter data={riskRewardData} />
            </section>

            <section className="mt-14">
              <TimelineComparison timelines={timelineComparisonData} />
            </section>

            <section className="mt-14">
              <AIVerdictPanel text={aiVerdictText} />
            </section>

            <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-teal-500/10 backdrop-blur-lg">
              <h2 className="text-xl font-semibold text-white">Take action</h2>
              <p className="mt-2 text-sm text-slate-400">
                Add best pick to watchlist, send to dashboard, or compare another set.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  type="button"
                  className="rounded-full border border-teal-400/40 bg-teal-500/20 px-6 py-3 text-sm font-semibold text-teal-200 transition hover:border-teal-400/60 hover:bg-teal-500/30"
                >
                  Add Best Pick to Watchlist
                </button>
                <Link
                  to="/dashboard"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-teal-300 hover:text-teal-200"
                >
                  Send to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => setHasRun(false)}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-teal-300 hover:text-teal-200"
                >
                  Compare Another Set
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-teal-400 to-lime-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/40 transition hover:scale-[1.02]"
                >
                  Upgrade to Pro
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
