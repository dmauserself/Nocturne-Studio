import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'
import { useEffect } from 'react'
import { useFinePointer, usePrefersReducedMotion } from './hooks'

/**
 * Положение курсора относительно центра окна в диапазоне −1…1 (с пружиной).
 * Используется для «глубины»: слои сцены смещаются с разной силой.
 * На тач-устройствах всегда 0 (и при «Уменьшить движение», если это включено в lib/browser.ts).
 */
export function usePointerParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const x = useSpring(rx, { stiffness: 45, damping: 18, mass: 0.8 })
  const y = useSpring(ry, { stiffness: 45, damping: 18, mass: 0.8 })

  useEffect(() => {
    if (!fine || reduced) {
      rx.set(0)
      ry.set(0)
      return
    }
    const onMove = (e: PointerEvent) => {
      rx.set((e.clientX / window.innerWidth - 0.5) * 2)
      ry.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine, reduced, rx, ry])

  return { x, y }
}
