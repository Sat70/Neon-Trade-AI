import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PredictionModeToggle, { type PredictionMode } from './PredictionModeToggle'
import StatsCard from './StatsCard'
import BackgroundGraph from './BackgroundGraph'
import { useAuth } from '../context/AuthContext'

const modeStats: Record<
  PredictionMode,
  { expectedReturn: string; risk: 'Low' | 'Medium' | 'High'; horizon: string }
> = {
  Intraday: { expectedReturn: '+1.8%', risk: 'Medium', horizon: '0 – 1 day' },
  'Short Term': { expectedReturn: '+6.4%', risk: 'Medium', horizon: '2 – 14 days' },
  'Long Term': { expectedReturn: '+18.2%', risk: 'Low', horizon: '3+ months' },
}

const Hero = () => {
  const [mode, setMode] = useState<PredictionMode>('Intraday')
  const stats = useMemo(() => modeStats[mode], [mode])
  const { isAuthenticated } = useAuth()

  return (
    <section
      id="overview"
      className="relative flex flex-col items-center justify-center w-full min-h-screen gap-10 px-4 pb-20 text-white shadow-2xl bg-gradient-to-b from-white/5 to-black/60 pt-28 shadow-teal-500/10 backdrop-blur-2xl md:flex-row md:gap-16 md:px-12"
    >
      <BackgroundGraph />

      <div className="relative w-full max-w-3xl space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-black/40 px-4 py-1 text-xs uppercase tracking-[0.3em] text-teal-200">
          REAL-TIME AI FEED
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Predict the market. In real-time.
        </h1>
        <p className="text-lg text-slate-300">
          AI-trained signals distilled for retail traders. We blend market microstructure, macro sentiment, and alternative data to anticipate momentum shifts before they broadcast.
        </p>
        <div className="flex flex-wrap gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-6 py-3 text-sm font-semibold tracking-wide uppercase transition rounded-full shadow-lg bg-gradient-to-r from-teal-400 via-cyan-400 to-lime-300 text-slate-950 shadow-teal-500/40 hover:scale-105"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <button className="px-6 py-3 text-sm font-semibold tracking-wide uppercase transition rounded-full shadow-lg bg-gradient-to-r from-teal-400 via-cyan-400 to-lime-300 text-slate-950 shadow-teal-500/40 hover:scale-105">
                Start Predicting
              </button>
              <button className="px-6 py-3 text-sm font-semibold transition border rounded-full border-white/20 text-white/80 hover:border-teal-300 hover:text-teal-200">
                View Demo
              </button>
            </>
          )}
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Powered by AI models & live market feeds · demo data
        </p>
        <PredictionModeToggle value={mode} onChange={setMode} />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard title="Expected Return" value={stats.expectedReturn} delta="+0.6% vs avg" subtitle="Mode-adjusted CAGR projection" />
          <StatsCard title="Risk Level" value={stats.risk} subtitle="Volatility-adjusted" />
          <StatsCard title="Horizon" value={stats.horizon} subtitle="Signal shelf life" />
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 rounded-[2rem] border border-teal-400/30 opacity-50 blur-xl animate-pulse" />
        <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/20 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-teal-200">Signal Console</p>
          <div className="mt-6 space-y-5">
            {[
              { label: 'BTC · Intraday Drift', value: 2.45, confidence: 82, mood: 'Bullish' },
              { label: 'AAPL · Options Flow', value: 1.12, confidence: 74, mood: 'Bullish' },
              { label: 'NVDA · Momentum', value: 3.78, confidence: 88, mood: 'Bullish' },
            ].map((signal) => (
              <div key={signal.label} className="p-4 border rounded-2xl border-white/10 bg-gradient-to-br from-black/40 to-teal-500/10">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <p>{signal.label}</p>
                  <span className="text-xs text-lime-300">{signal.mood}</span>
                </div>
                <div className="mt-2 text-3xl font-semibold text-white">+{signal.value.toFixed(2)}%</div>
                <p className="text-xs text-slate-400">Confidence {signal.confidence}%</p>
                <div className="h-1 mt-3 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-lime-300" style={{ width: `${signal.confidence}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 mt-6 border rounded-2xl border-white/10 bg-black/50">
            <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Latency</p>
            <p className="mt-2 text-3xl font-semibold text-white">42 ms</p>
            <p className="text-xs text-slate-400">LLM ensemble to execution</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

