import type { Variants } from 'framer-motion'

// Появление блоков — только сдвиг и прозрачность (дёшево для GPU).
// Анимация размытия (blur) заставляла браузер перерисовывать блоки на каждом кадре прокрутки.

export const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
  }),
}

export const lineReveal: Variants = {
  hidden: { y: '110%' },
  show: (i: number = 0) => ({
    y: '0%',
    transition: { duration: 1.05, ease: EASE, delay: i * 0.09 },
  }),
}

export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const
