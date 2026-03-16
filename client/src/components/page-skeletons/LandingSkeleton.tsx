import SkeletonBlock from './SkeletonBlock'

/**
 * Skeleton that mirrors LandingPage layout: navbar, hero area, section cards.
 */
const LandingSkeleton = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-60">
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-10 top-1/2 h-80 w-80 rounded-full bg-purple-600/30 blur-[220px]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-white/10 bg-slate-950/70 backdrop-blur-lg md:h-20">
        <div className="flex h-full items-center justify-between px-4 md:px-12">
          <SkeletonBlock className="h-6 w-32" rounded="md" />
          <div className="hidden gap-6 md:flex">
            <SkeletonBlock className="h-4 w-16" rounded="full" />
            <SkeletonBlock className="h-4 w-20" rounded="full" />
            <SkeletonBlock className="h-4 w-16" rounded="full" />
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-screen flex-col gap-10 pb-24 pt-20">
        <section className="flex flex-col items-center justify-center gap-6 px-4 md:flex-row md:gap-16 md:px-12">
          <div className="w-full max-w-3xl space-y-4">
            <SkeletonBlock className="h-4 w-40" rounded="full" />
            <SkeletonBlock className="h-12 w-full max-w-md" rounded="xl" />
            <SkeletonBlock className="h-6 w-full max-w-lg" rounded="md" />
            <div className="flex gap-4">
              <SkeletonBlock className="h-12 w-36" rounded="full" />
              <SkeletonBlock className="h-12 w-28" rounded="full" />
            </div>
          </div>
          <SkeletonBlock className="h-80 w-full max-w-md" />
        </section>
        <section className="w-full px-4 md:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="h-40" />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default LandingSkeleton
