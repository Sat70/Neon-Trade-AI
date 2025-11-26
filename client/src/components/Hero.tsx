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
  Swing: { expectedReturn: '+6.4%', risk: 'Medium', horizon: '2 – 14 days' },
  'Long Term': { expectedReturn: '+18.2%', risk: 'Low', horizon: '3+ months' },
}

const Hero = () => {
  const [mode, setMode] = useState<PredictionMode>('Intraday')
  const stats = useMemo(() => modeStats[mode], [mode])
  const { isAuthenticated } = useAuth()

  // NOTE: This section used to be constrained by a max-w container.
  // We now stretch it edge-to-edge while keeping inner cards readable.
  return (
    <section
      id="overview"
      className="relative flex w-full min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-b from-white/5 to-black/60 px-4 pb-20 pt-28 text-white shadow-2xl shadow-teal-500/10 backdrop-blur-2xl md:flex-row md:gap-16 md:px-12"
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
          <button className="rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-lime-300 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-teal-500/40 transition hover:scale-105">
            Start Predicting
          </button>
          <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-teal-300 hover:text-teal-200">
            View Demo
          </button>
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Powered by AI models & live market feeds · demo data
        </p>
        <PredictionModeToggle value={mode} onChange={setMode} />
        {isAuthenticated ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard title="Expected Return" value={stats.expectedReturn} delta="+0.6% vs avg" subtitle="Mode-adjusted CAGR projection" />
            <StatsCard title="Risk Level" value={stats.risk} subtitle="Volatility-adjusted" />
            <StatsCard title="Horizon" value={stats.horizon} subtitle="Signal shelf life" />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-teal-400/40 bg-black/40 p-6 text-sm text-slate-300">
            <p className="font-semibold text-white">Please log in to access AI predictions.</p>
            <p className="mt-2 text-xs text-slate-400">Authentication required to stream personalized stats and risk metrics.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/auth/login"
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-teal-300 hover:text-teal-200"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full border border-lime-300/30 bg-gradient-to-r from-teal-400 to-lime-400 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-teal-500/40"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full max-w-md">
        {isAuthenticated ? (
          <>
            <div className="absolute inset-0 rounded-[2rem] border border-teal-400/30 opacity-50 blur-xl animate-pulse" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/20 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.4em] text-teal-200">Signal Console</p>
              <div className="mt-6 space-y-5">
                {[
                  { label: 'BTC · Intraday Drift', value: 2.45, confidence: 82, mood: 'Bullish' },
                  { label: 'AAPL · Options Flow', value: 1.12, confidence: 74, mood: 'Bullish' },
                  { label: 'NVDA · Momentum', value: 3.78, confidence: 88, mood: 'Bullish' },
                ].map((signal) => (
                  <div key={signal.label} className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 to-teal-500/10 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <p>{signal.label}</p>
                      <span className="text-xs text-lime-300">{signal.mood}</span>
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-white">+{signal.value.toFixed(2)}%</div>
                    <p className="text-xs text-slate-400">Confidence {signal.confidence}%</p>
                    <div className="mt-3 h-1 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-lime-300" style={{ width: `${signal.confidence}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/50 p-4">
                <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Latency</p>
                <p className="mt-2 text-3xl font-semibold text-white">42 ms</p>
                <p className="text-xs text-slate-400">LLM ensemble to execution</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-black/40 p-8 text-center text-slate-300">
            <p className="text-lg font-semibold text-white">Authenticate to unlock the Signal Console.</p>
            <p className="mt-3 text-sm text-slate-400">
              AI signals, latency monitoring, and live momentum feeds require a verified NeonTrade session.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/auth/login"
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-teal-300 hover:text-teal-200"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full border border-lime-300/30 bg-gradient-to-r from-teal-400 to-lime-400 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-teal-500/40"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero

