import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '../lib/hooks'

type Props = {
  children: ReactNode
  className?: string
  strength?: number
}

/** Обёртка, которая слегка притягивает кнопку к курсору (только десктоп) */
export function Magnetic({ children, className = '', strength = 0.3 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 })

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
