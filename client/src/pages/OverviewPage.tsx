import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import OverviewHeader from '../components/overview/OverviewHeader'
import MarketSnapshotCard from '../components/overview/MarketSnapshotCard'
import StockRecommendationCard from '../components/overview/StockRecommendationCard'
import AnalyticsCharts from '../components/overview/AnalyticsCharts'
import SectorBreakdown from '../components/overview/SectorBreakdown'
import AIInsightCard from '../components/overview/AIInsightCard'
import {
  marketSnapshotCards,
  topPicks,
  sectorBreakdown,
  chartDataPredictedVsCurrent,
  confidenceComparisonData,
  aiInsightText,
} from '../data/overviewMockData'

export default function OverviewPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-slate-100">
      {/*Background effects – match landing/dashboard*/}
      <div className="absolute inset-0 pointer-events-none -z-20 opacity-60">
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-10 top-1/2 h-80 w-80 rounded-full bg-purple-600/30 blur-[220px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[length:80px_80px]" />
      </div>

      <Navbar />

      <main className="px-4 pb-24 mx-auto max-w-7xl pt-28 md:px-8">
        <OverviewHeader />

        {/*1. Market Snapshot Cards */}
        <section className="mt-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {marketSnapshotCards.map((metric) => (
              <MarketSnapshotCard key={metric.title} metric={metric} />
            ))}
          </div>
        </section>

        {/*2. Top AI Picks */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-white">Top AI Picks</h2>
          <p className="mt-1 text-sm text-slate-400">High-confidence recommendations</p>
          <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {topPicks.map((stock) => (
              <StockRecommendationCard key={stock.ticker} stock={stock} />
            ))}
          </div>
        </section>

        {/*3. Analytics Charts */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-white">Visual Analytics</h2>
          <p className="mt-1 text-sm text-slate-400">Predicted vs current and confidence comparison</p>
          <div className="mt-6">
            <AnalyticsCharts
              lineData={chartDataPredictedVsCurrent}
              barData={confidenceComparisonData}
            />
          </div>
        </section>

        {/*4. Sector + AI Insight side by side */}
        <section className="grid gap-8 mt-14 lg:grid-cols-2">
          <SectorBreakdown sectors={sectorBreakdown} />
          <AIInsightCard text={aiInsightText} />
        </section>

        {/*5. CTA Section */}
        <section className="p-8 border shadow-xl mt-14 rounded-2xl border-white/10 bg-white/5 shadow-teal-500/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold text-white">Next steps</h2>
          <p className="mt-2 text-sm text-slate-400">Explore your dashboard or upgrade for more signals.</p>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              to="/dashboard"
              className="rounded-full bg-gradient-to-r from-teal-400 to-lime-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/40 transition hover:scale-[1.02]"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 text-sm font-semibold text-teal-200 transition border rounded-full border-teal-400/50 hover:bg-teal-500/20"
            >
              View Today&apos;s Suggestions
            </Link>
            <button
              type="button"
              className="px-6 py-3 text-sm font-medium transition border rounded-full border-white/20 text-slate-300 hover:border-teal-300 hover:text-teal-200"
            >
              Upgrade to Pro
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
