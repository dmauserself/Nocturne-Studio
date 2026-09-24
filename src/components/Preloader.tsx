import { AnimatePresence, m as motion } from 'framer-motion'
import { EASE } from '../lib/motion'
import { A11Y } from '../content'
import { Logo } from './Logo'
import { Moon } from './Moon'

export function Preloader({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] grid place-items-center bg-night-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8, ease: EASE } }}
          role="status"
          aria-label={A11Y.loading}
        >
          <div className="flex flex-col items-center gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <Moon className="w-28 sm:w-36" textured={false} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            >
              <Logo className="scale-125" />
            </motion.div>
            <motion.span
              className="h-px w-40 origin-left bg-gradient-to-r from-violet via-lilac to-moon"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
