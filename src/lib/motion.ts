import type { Variants } from 'framer-motion'
import { liteEffects } from './browser'

// Лёгкое размытие при появлении (отключается переключателем в lib/browser.ts)
const BLUR_IN = liteEffects ? {} : { filter: 'blur(8px)' }
const BLUR_OUT = liteEffects ? {} : { filter: 'blur(0px)' }

export const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, ...BLUR_IN },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    ...BLUR_OUT,
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
