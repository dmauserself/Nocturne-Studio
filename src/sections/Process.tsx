import { m as motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef, useState } from 'react'
import { MoonPhase } from '../components/Moon'
import { SectionHead } from '../components/SectionHead'
import { PROCESS } from '../content'

/** Шаги процесса: линия заполняется при скролле, фазы луны растут до полнолуния */
export function Process() {
  const ref = useRef<HTMLOListElement>(null)
  const steps = PROCESS.steps
  const n = steps.length
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 55%'] })
  const [active, setActive] = useState(-1)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(v <= 0.01 ? -1 : Math.min(n - 1, Math.floor(v * n)))
  })

  return (
    <section id="process" aria-label={PROCESS.title} className="section overflow-clip">
      <div aria-hidden className="glow right-[-10%] top-[30%] h-[36vw] w-[36vw] animate-breathe-slow text-violet/25" />
      <div className="container-site relative">
        <SectionHead eyebrow={PROCESS.eyebrow} title={PROCESS.title} text={PROCESS.text} />

        <ol ref={ref} className="relative mt-16 grid gap-10 pl-12 lg:mt-24 lg:grid-cols-5 lg:gap-6 lg:pl-0 lg:pt-16">
          {/* Трек линии */}
          <span aria-hidden className="absolute bottom-2 left-[15px] top-2 w-px bg-white/10 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[15px] lg:h-px lg:w-auto" />
          <motion.span
            aria-hidden
            style={{ scaleY: scrollYProgress }}
            className="absolute bottom-2 left-[15px] top-2 w-px origin-top bg-gradient-to-b from-violet via-lilac to-moon shadow-[0_0_16px_rgba(185,166,255,0.8)] lg:hidden"
          />
          <motion.span
            aria-hidden
            style={{ scaleX: scrollYProgress }}
            className="absolute left-0 right-0 top-[15px] hidden h-px origin-left bg-gradient-to-r from-violet via-lilac to-moon shadow-[0_0_16px_rgba(185,166,255,0.8)] lg:block"
          />

          {steps.map((s, i) => {
            const on = i <= active
            return (
              <li key={s.title} className="relative" aria-current={i === active ? 'step' : undefined}>
                <span
                  className={`absolute -left-12 top-0 grid h-[31px] w-[31px] place-items-center rounded-full border bg-night-950 transition-all duration-700 lg:-top-16 lg:left-0 ${
                    on ? 'border-lilac/70 shadow-[0_0_24px_rgba(185,166,255,0.6)]' : 'border-white/15'
                  }`}
                >
                  <MoonPhase phase={(i + 1) / n} size={17} active={on} />
                </span>
                <div className={`transition-all duration-700 ${on ? 'opacity-100' : 'opacity-45'}`}>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-lilac">
                    {String(i + 1).padStart(2, '0')} · {s.time}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.01em]">{s.title}</h3>
                  <p className="mt-3 max-w-xs text-[15px] leading-[1.6] text-body">{s.text}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
