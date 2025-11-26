import Hero from '../components/Hero'
import Navbar from '../components/Navbar'

const secondarySections = [
  {
    id: 'predictions',
    title: 'AI Predictions',
    description: 'Transformer ensembles tracking price action, macro tone, and on-chain flows to project momentum in real-time.',
  },
  {
    id: 'backtesting',
    title: 'Backtesting',
    description: 'Regime-aware playback with configurable risk overlays, synthetic data augmentation, and sandboxed automation.',
  },
  {
    id: 'api',
    title: 'API',
    description: 'REST + WebSocket APIs streaming signals, attribution, and diagnostics for custom trading stacks.',
  },
]

const LandingPage = () => {
  // NOTE: The page previously used max-w containers, which boxed the experience.
  // Now the neon grid, hero, and dashboard sections all span the full viewport.
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-60">
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-10 top-1/2 h-80 w-80 rounded-full bg-purple-600/30 blur-[220px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[length:120px_120px]" />
      </div>
      <div className="relative z-10 flex min-h-screen w-full flex-col gap-10 pb-24 pt-20">
        <Navbar />
        <Hero />
        <section className="w-full px-4 md:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            {secondarySections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-xl shadow-black/40 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-teal-200">{section.title}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{section.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{section.description}</p>
                <div className="mt-5 h-px bg-gradient-to-r from-teal-500/30 to-transparent" />
                <p className="mt-4 text-xs text-slate-400">Protected content · requires login</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default LandingPage

