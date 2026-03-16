import { useCallback, useEffect, useRef, useState } from 'react'
import './cursor.css'

const LERP_DOT = 1
const LERP_RING = 0.18
const HOVER_SELECTOR = '[data-cursor="hover"], [data-cursor="button"], [data-cursor="link"], a, button, [role="button"], [role="link"]'

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function isInteractiveElement(el: Element | null): boolean {
  if (!el || el === document.body) return false
  if (el.closest(HOVER_SELECTOR)) return true
  const tag = el.tagName.toLowerCase()
  const role = el.getAttribute('role')
  const dataCursor = el.getAttribute('data-cursor')
  return tag === 'a' || tag === 'button' || role === 'button' || role === 'link' || dataCursor === 'hover' || dataCursor === 'button' || dataCursor === 'link'
}

function shouldHideCursor(el: Element | null): boolean {
  if (!el) return false
  const target = el.closest('input, textarea, [contenteditable="true"], select')
  return Boolean(target)
}

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const pos = useRef({ x: 0, y: 0 })
  const dot = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)
  const wasHidden = useRef(true)

  const updateEnabled = useCallback(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const isNarrow = window.matchMedia('(max-width: 768px)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(!isTouch && !isNarrow && !reducedMotion)
  }, [])

  useEffect(() => {
    updateEnabled()
    const mq = window.matchMedia('(max-width: 768px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = () => updateEnabled()
    mq.addEventListener('change', listener)
    mqMotion.addEventListener('change', listener)
    return () => {
      mq.removeEventListener('change', listener)
      mqMotion.removeEventListener('change', listener)
    }
  }, [updateEnabled])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (wasHidden.current) {
        dot.current = { x: e.clientX, y: e.clientY }
        ring.current = { x: e.clientX, y: e.clientY }
        wasHidden.current = false
        setVisible(true)
      }
      const el = document.elementFromPoint(e.clientX, e.clientY)
      setIsHover(isInteractiveElement(el))
      if (shouldHideCursor(el)) {
        setVisible(false)
      }
    }

    const onDown = () => setIsClicking(true)
    const onUp = () => setIsClicking(false)

    const onEnter = () => {
      wasHidden.current = true
      setVisible(true)
    }
    const onLeave = () => {
      wasHidden.current = true
      setVisible(false)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled, visible])

  useEffect(() => {
    if (!enabled) return

    const tick = () => {
      const { x: tx, y: ty } = pos.current
      dot.current.x = lerp(dot.current.x, tx, LERP_DOT)
      dot.current.y = lerp(dot.current.y, ty, LERP_DOT)
      ring.current.x = lerp(ring.current.x, tx, LERP_RING)
      ring.current.y = lerp(ring.current.y, ty, LERP_RING)

      const dotEl = document.getElementById('cursor-dot')
      const ringEl = document.getElementById('cursor-ring')
      if (dotEl) {
        dotEl.style.left = `${dot.current.x}px`
        dotEl.style.top = `${dot.current.y}px`
      }
      if (ringEl) {
        ringEl.style.left = `${ring.current.x}px`
        ringEl.style.top = `${ring.current.y}px`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [enabled])

  useEffect(() => {
    if (enabled && visible) {
      document.body.classList.add('cursor-custom')
    } else {
      document.body.classList.remove('cursor-custom')
    }
    return () => document.body.classList.remove('cursor-custom')
  }, [enabled, visible])

  if (!enabled) return null

  return (
    <div
      className="cursor-wrapper"
      aria-hidden
      style={{
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        transition: 'opacity 0.15s ease',
      }}
    >
      <div
        id="cursor-ring"
        className={`cursor-ring pulse ${isHover ? 'hover' : ''}`}
        style={{ left: 0, top: 0 }}
      />
      <div
        id="cursor-dot"
        className={`cursor-dot ${isHover ? 'hover' : ''} ${isClicking ? 'click' : ''}`}
        style={{ left: 0, top: 0 }}
      />
    </div>
  )
}
