import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'

// Плавное замедление к концу (как у cubic-bezier(0.16, 1, 0.3, 1))
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

/** Число, которое анимированно «досчитывает» до значения при появлении */
export function Counter({ to, suffix = '', duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setValue(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      setValue(Math.round(easeOutExpo(t) * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, to, duration])

  return (
    <span ref={ref} className="tabular" aria-label={`${to}${suffix}`}>
      <span aria-hidden>
        {value}
        {suffix}
      </span>
    </span>
  )
}
