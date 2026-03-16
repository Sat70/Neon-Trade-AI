import SkeletonBlock from './SkeletonBlock'

/**
 * Skeleton that mirrors OverviewPage layout: header, snapshot cards, picks grid, charts, sector, CTA.
 */
const OverviewSkeleton = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-60">
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-10 top-1/2 h-80 w-80 rounded-full bg-purple-600/30 blur-[220px]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-white/10 bg-slate-950/70 backdrop-blur-lg md:h-20">
        <div className="flex h-full items-center justify-between px-4 md:px-12">
          <SkeletonBlock className="h-6 w-32" rounded="md" />
          <div className="hidden gap-4 md:flex">
            <SkeletonBlock className="h-8 w-24" rounded="full" />
            <SkeletonBlock className="h-8 w-20" rounded="full" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SkeletonBlock className="h-10 w-56" rounded="xl" />
            <SkeletonBlock className="mt-2 h-5 w-72" rounded="md" />
          </div>
          <div className="flex gap-2">
            <SkeletonBlock className="h-10 w-28" rounded="full" />
            <SkeletonBlock className="h-10 w-24" rounded="full" />
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} className="h-32" />
          ))}
        </div>

        <div className="mt-14">
          <SkeletonBlock className="h-8 w-40" rounded="xl" />
          <SkeletonBlock className="mt-2 h-4 w-52" rounded="md" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonBlock key={i} className="h-56" />
            ))}
          </div>
        </div>

        <div className="mt-14">
          <SkeletonBlock className="h-8 w-44" rounded="xl" />
          <SkeletonBlock className="mt-2 h-4 w-64" rounded="md" />
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <SkeletonBlock className="h-64" />
            <SkeletonBlock className="h-64" />
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <SkeletonBlock className="h-64" />
          <SkeletonBlock className="h-64" />
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <SkeletonBlock className="h-6 w-28" rounded="md" />
          <SkeletonBlock className="mt-2 h-4 w-64" rounded="md" />
          <div className="mt-6 flex flex-wrap gap-4">
            <SkeletonBlock className="h-12 w-40" rounded="full" />
            <SkeletonBlock className="h-12 w-44" rounded="full" />
            <SkeletonBlock className="h-12 w-32" rounded="full" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default OverviewSkeleton
