import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '../lib/hooks'

/** Мягкое лунное свечение, следующее за курсором (только десктоп) */
export function CursorGlow() {
  const enabled = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(-600)
  const y = useMotionValue(-600)
  const sx = useSpring(x, { stiffness: 90, damping: 20, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 90, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (!enabled || reduced) return
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, reduced, x, y])

  if (!enabled || reduced) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[520px] w-[520px] rounded-full"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(closest-side, rgba(124,92,255,0.16), rgba(42,27,94,0.08) 55%, transparent)',
      }}
    />
  )
}
