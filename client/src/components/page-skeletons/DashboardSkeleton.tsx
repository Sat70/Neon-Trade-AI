import SkeletonBlock from './SkeletonBlock'

/**
 * Skeleton that mirrors DashboardPage layout: navbar, title, account card, predictions section.
 */
const DashboardSkeleton = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-60">
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-10 top-1/2 h-80 w-80 rounded-full bg-purple-600/30 blur-[220px]" />
      </div>

      {/* Navbar placeholder */}
      <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-white/10 bg-slate-950/70 backdrop-blur-lg md:h-20">
        <div className="flex h-full items-center justify-between px-4 md:px-12">
          <SkeletonBlock className="h-6 w-32" rounded="md" />
          <div className="hidden gap-6 md:flex">
            <SkeletonBlock className="h-4 w-20" rounded="full" />
            <SkeletonBlock className="h-4 w-20" rounded="full" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-28">
        <SkeletonBlock className="h-9 w-48" rounded="xl" />
        <SkeletonBlock className="mt-2 h-5 w-64" rounded="md" />
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <SkeletonBlock className="h-5 w-28" rounded="md" />
          <div className="mt-4 space-y-3">
            <SkeletonBlock className="h-4 w-full" rounded="md" />
            <SkeletonBlock className="h-4 w-3/4" rounded="md" />
            <SkeletonBlock className="h-4 w-full" rounded="md" />
            <SkeletonBlock className="h-4 w-1/2" rounded="md" />
          </div>
          <SkeletonBlock className="mt-6 h-10 w-24" rounded="full" />
        </div>
        <section className="mt-10">
          <SkeletonBlock className="h-6 w-32" rounded="md" />
          <SkeletonBlock className="mt-2 h-4 w-72" rounded="md" />
        </section>
      </main>
    </div>
  )
}

export default DashboardSkeleton
