import SkeletonBlock from './SkeletonBlock'

/**
 * Skeleton that mirrors SignUp/Login page: centered glass card with form placeholders.
 */
const AuthSkeleton = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),transparent_60%)]" />
        <div className="absolute left-1/3 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-6 bottom-0 h-80 w-80 rounded-full bg-purple-600/30 blur-[200px]" />
      </div>
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/20 backdrop-blur-2xl">
          <SkeletonBlock className="h-4 w-24" rounded="md" />
          <SkeletonBlock className="mt-3 h-9 w-40" rounded="xl" />
          <SkeletonBlock className="mt-2 h-4 w-64" rounded="md" />
          <div className="mt-8 space-y-5">
            <div>
              <SkeletonBlock className="h-4 w-16" rounded="md" />
              <SkeletonBlock className="mt-2 h-12 w-full" rounded="2xl" />
            </div>
            <div>
              <SkeletonBlock className="h-4 w-20" rounded="md" />
              <SkeletonBlock className="mt-2 h-12 w-full" rounded="2xl" />
            </div>
            <div>
              <SkeletonBlock className="h-4 w-12" rounded="md" />
              <SkeletonBlock className="mt-2 h-12 w-full" rounded="2xl" />
            </div>
          </div>
          <SkeletonBlock className="mt-6 h-12 w-full" rounded="2xl" />
          <SkeletonBlock className="mt-6 h-4 w-48" rounded="md" />
        </div>
      </div>
    </div>
  )
}

export default AuthSkeleton
