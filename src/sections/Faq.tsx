import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState } from 'react'
import { Plus } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { FAQ } from '../content'
import { EASE } from '../lib/motion'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()

  return (
    <section id="faq" aria-label={FAQ.title} className="section">
      <div className="container-site relative">
        <SectionHead eyebrow={FAQ.eyebrow} title={FAQ.title} />
        <ul className="mt-14 border-t border-line lg:mt-20">
          {FAQ.items.map((item, i) => {
            const isOpen = open === i
            const btnId = `${uid}-q-${i}`
            const panelId = `${uid}-a-${i}`
            return (
              <Reveal as="li" key={item.q} delay={i % 3} className="border-b border-line">
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center gap-5 py-7 text-left sm:gap-10 sm:py-9"
                  >
                    <span className="w-8 shrink-0 text-sm font-medium text-lilac">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`flex-1 text-[clamp(1.1rem,2.2vw,1.9rem)] font-medium leading-snug tracking-[-0.01em] transition-colors ${
                        isOpen ? 'text-white' : 'text-moon/85 group-hover:text-white'
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      className={`btn-round h-11 w-11 border transition-all duration-500 sm:h-14 sm:w-14 ${
                        isOpen ? 'rotate-45 border-transparent bg-violet text-white shadow-[0_10px_40px_-6px_rgba(124,92,255,0.8)]' : 'border-white/15 text-white'
                      }`}
                      aria-hidden
                    >
                      <Plus />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-9 pl-[52px] text-[15px] leading-[1.7] text-body sm:pl-[72px] sm:text-base">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
