import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PredictionHeader from '../components/predictions/PredictionHeader'
import PriceForecastChart from '../components/predictions/PriceForecastChart'
import ScenarioCard from '../components/predictions/ScenarioCard'
import TimingHeatmap from '../components/predictions/TimingHeatmap'
import PredictionComparisonChart from '../components/predictions/PredictionComparisonChart'
import VolatilityForecast from '../components/predictions/VolatilityForecast'
import AIReasoningPanel from '../components/predictions/AIReasoningPanel'
import {
  priceTrajectoryData,
  scenarios,
  timingSlots,
  comparisonAssets,
  volatilityForecastData,
  aiReasoningText,
  nextHighProbabilityEntry,
} from '../data/predictionsMockData'

export default function PredictionsPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-slate-100">
      {/*Background effects – same as Overview */}
      <div className="absolute inset-0 pointer-events-none -z-20 opacity-60">
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-10 top-1/2 h-80 w-80 rounded-full bg-purple-600/30 blur-[220px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[length:80px_80px]" />
      </div>

      <Navbar />

      <main className="px-4 pb-24 mx-auto max-w-7xl pt-28 md:px-8">
        <PredictionHeader />

        {/*1. AI Price Trajectory (hero) */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-white">AI Price Trajectory Forecast</h2>
          <p className="mt-1 text-sm text-slate-400">
            Current price, predicted future path, and confidence bands
          </p>
          <div className="p-6 mt-6 border shadow-xl rounded-2xl border-white/10 bg-white/5 shadow-teal-500/10 backdrop-blur-lg">
            <PriceForecastChart data={priceTrajectoryData} />
          </div>
        </section>

        {/*2. Scenario Analysis */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-white">Prediction Scenario Analysis</h2>
          <p className="mt-1 text-sm text-slate-400">
            Probabilistic outcomes: Bull, Base, and Bear cases
          </p>
          <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <ScenarioCard key={scenario.name} scenario={scenario} />
            ))}
          </div>
        </section>

        {/*3. Best Time to Invest (Timing Intelligence) */}
        <section className="mt-14">
          <TimingHeatmap slots={timingSlots} nextEntry={nextHighProbabilityEntry} />
        </section>

        {/*4. Prediction Comparison */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-white">Prediction Comparison</h2>
          <p className="mt-1 text-sm text-slate-400">
            Side-by-side: expected upside, drawdown risk, time to target, confidence
          </p>
          <div className="p-6 mt-6 border shadow-xl rounded-2xl border-white/10 bg-white/5 shadow-teal-500/10 backdrop-blur-lg">
            <PredictionComparisonChart assets={comparisonAssets} />
          </div>
        </section>

        {/*5. Volatility & Risk Forecast */}
        <section className="mt-14">
          <VolatilityForecast data={volatilityForecastData} />
        </section>

        {/*6. AI Reasoning Panel */}
        <section className="mt-14">
          <AIReasoningPanel text={aiReasoningText} />
        </section>

        {/*7. Action Zone */}
        <section className="p-8 border shadow-xl mt-14 rounded-2xl border-white/10 bg-white/5 shadow-teal-500/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold text-white">Take action</h2>
          <p className="mt-2 text-sm text-slate-400">
            Add to watchlist, compare assets, or upgrade for more predictions.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              type="button"
              className="px-6 py-3 text-sm font-semibold text-teal-200 transition border rounded-full border-teal-400/40 bg-teal-500/20 hover:border-teal-400/60 hover:bg-teal-500/30"
            >
              Add Prediction to Watchlist
            </button>
            <Link
              to="/overview"
              className="px-6 py-3 text-sm font-semibold transition border rounded-full border-white/20 text-slate-200 hover:border-teal-300 hover:text-teal-200"
            >
              Compare with Another Asset
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 text-sm font-semibold transition border rounded-full border-white/20 text-slate-200 hover:border-teal-300 hover:text-teal-200"
            >
              Go to Dashboard
            </Link>
            <button
              type="button"
              className="rounded-full bg-gradient-to-r from-teal-400 to-lime-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/40 transition hover:scale-[1.02]"
            >
              Upgrade to Pro
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
