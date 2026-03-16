import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardSkeleton from './page-skeletons/DashboardSkeleton'
import OverviewSkeleton from './page-skeletons/OverviewSkeleton'
import LandingSkeleton from './page-skeletons/LandingSkeleton'
import AuthSkeleton from './page-skeletons/AuthSkeleton'
import PredictionsSkeleton from './page-skeletons/PredictionsSkeleton'
import CompareSkeleton from './page-skeletons/CompareSkeleton'

const MIN_VISIBLE_MS = 300
const FADE_OUT_MS = 200

function getSkeletonForPathname(pathname: string) {
  if (pathname === '/dashboard') return <DashboardSkeleton />
  if (pathname === '/overview') return <OverviewSkeleton />
  if (pathname === '/predictions') return <PredictionsSkeleton />
  if (pathname === '/compare') return <CompareSkeleton />
  if (pathname === '/login' || pathname === '/signup') return <AuthSkeleton />
  if (pathname === '/') return <LandingSkeleton />
  return <LandingSkeleton />
}

type PageTransitionLoaderProps = {
  children: ReactNode
}

export default function PageTransitionLoader({ children }: PageTransitionLoaderProps) {
  const location = useLocation()
  const [overlay, setOverlay] = useState<{ pathname: string; exiting: boolean } | null>(null)
  const prevPathname = useRef(location.pathname)
  const minVisibleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeOutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useLayoutEffect(() => {
    const pathname = location.pathname

    if (pathname === prevPathname.current) return
    prevPathname.current = pathname

    //Clear any pending timers from previous transition ;)
    if (minVisibleTimer.current) {
      clearTimeout(minVisibleTimer.current)
      minVisibleTimer.current = null
    }
    if (fadeOutTimer.current) {
      clearTimeout(fadeOutTimer.current)
      fadeOutTimer.current = null
    }

    setOverlay({ pathname, exiting: false })

    minVisibleTimer.current = setTimeout(() => {
      minVisibleTimer.current = null
      setOverlay((prev) => (prev ? { ...prev, exiting: true } : null))

      fadeOutTimer.current = setTimeout(() => {
        fadeOutTimer.current = null
        setOverlay(null)
      }, FADE_OUT_MS)
    }, MIN_VISIBLE_MS)

    return () => {
      if (minVisibleTimer.current) clearTimeout(minVisibleTimer.current)
      if (fadeOutTimer.current) clearTimeout(fadeOutTimer.current)
    }
  }, [location.pathname])

  //Lock body scroll while overlay is visible.......................
  useEffect(() => {
    if (overlay) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [overlay])

  return (
    <>
      {children}
      {overlay && (
        <div
          className="fixed inset-0 z-[100] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] transition-opacity duration-200"
          style={{
            opacity: overlay.exiting ? 0 : 1,
            pointerEvents: overlay.exiting ? 'none' : 'auto',
          }}
          aria-hidden
        >
          {getSkeletonForPathname(overlay.pathname)}
        </div>
      )}
    </>
  )
}
