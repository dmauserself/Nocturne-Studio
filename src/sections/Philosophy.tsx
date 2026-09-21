import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FitText } from '../components/FitText'
import { ArrowUpRight } from '../components/Icons'
import { Magnetic } from '../components/MagneticButton'
import { MoonO } from '../components/MoonO'
import { LineReveal, Reveal } from '../components/Reveal'
import { MoonGL } from '../components/MoonGL'
import { PHILOSOPHY } from '../content'
import { usePrefersReducedMotion } from '../lib/hooks'
import { scrollToHash } from '../lib/lenis'
import { EASE, fadeUp, viewportOnce } from '../lib/motion'

// Детерминированные высоты столбцов мини-графика (0–1)
const CHART = [0.45, 0.62, 0.3, 0.72, 0.9, 0.36, 0.68, 0.55, 0.6, 0.48, 0.2, 0.8, 0.52, 0.66, 0.84, 0.93, 0.7, 0.4, 0.58, 0.75, 0.46, 0.88, 0.5, 0.96]

export function Philosophy() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const k = reduced ? 0 : 1
  const figY = useTransform(scrollYProgress, [0, 1], [60 * k, -30 * k])
  const wordX = useTransform(scrollYProgress, [0, 1], [28 * k, -28 * k])

  const { identity, campaign } = PHILOSOPHY
  const bars = 40
  const filled = Math.round((bars * identity.progress) / 100)

  return (
    <section ref={ref} id="philosophy" aria-label={PHILOSOPHY.eyebrow} className="relative px-2 sm:px-3">
      <div className="window bg-night-950 pt-[var(--section-y)]">
        <div aria-hidden className="window-bg">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(40% 45% at 50% 88%, rgba(185,166,255,0.5), rgba(124,92,255,0.35) 30%, rgba(42,27,94,0.4) 55%, transparent 78%)',
            }}
          />
          <div className="glow bottom-[5%] left-[37%] h-[26vw] w-[26vw] animate-breathe text-lilac/30" />
        </div>

        <div className="container-site relative z-30 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6 lg:hidden">{PHILOSOPHY.eyebrow}</p>
            <LineReveal lines={PHILOSOPHY.titleLines} indent={{ 1: 'pl-[8%]', 2: 'pl-[18%]' }} className="h-display" lineClassName="sm:whitespace-nowrap" />

            <div className="mt-12 grid max-w-xl grid-cols-1 gap-4 min-[420px]:grid-cols-2">
              <Reveal className="glass p-5 sm:p-6" delay={1}>
                <p className="text-sm text-body">{identity.label}:</p>
                <p className="mt-1 whitespace-nowrap text-[clamp(1.2rem,1.7vw,1.6rem)] font-medium text-white">{identity.price}</p>
                <div className="mt-10 flex items-center justify-between text-xs text-body">
                  <span>{identity.progressLabel}</span>
                  <span>{identity.progress}%</span>
                </div>
                <div
                  className="mt-2 flex h-9 items-end gap-[3px]"
                  role="progressbar"
                  aria-valuenow={identity.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={identity.progressLabel}
                >
                  {Array.from({ length: bars }, (_, i) => (
                    <motion.span
                      key={i}
                      className={`h-full flex-1 origin-bottom rounded-full ${i < filled ? 'bg-violet' : 'bg-moon/60'}`}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.6, ease: EASE, delay: i * 0.015 }}
                    />
                  ))}
                </div>
              </Reveal>

              <Reveal className="glass p-5 sm:p-6" delay={2}>
                <p className="text-sm text-body">{campaign.label}:</p>
                <p className="mt-1 whitespace-nowrap text-[clamp(1.2rem,1.7vw,1.6rem)] font-medium text-white">{campaign.price}</p>
                <div className="mt-6 flex h-[88px] items-end gap-[3px]" aria-hidden>
                  {CHART.map((h, i) => (
                    <motion.span
                      key={i}
                      className={`flex-1 origin-bottom rounded-full ${i < 16 ? 'bg-violet' : 'bg-moon/60'}`}
                      style={{ height: `${h * 100}%` }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.03 }}
                    />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="mb-16 hidden text-right text-sm text-moon/80 lg:block">{PHILOSOPHY.eyebrow}</p>
            <div className="space-y-6">
              {PHILOSOPHY.paragraphs.map((p, i) => (
                <motion.p key={i} className="text-[15px] leading-[1.65] text-body" variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} custom={i}>
                  {p}
                </motion.p>
              ))}
            </div>
            <Reveal className="mt-10" delay={3}>
              <Magnetic>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToHash('#contact') }} className="btn-primary">
                  {PHILOSOPHY.cta}
                  <span className="btn-dot">
                    <ArrowUpRight />
                  </span>
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        {/* Надпись STUDIOS и «затмение» — 3D-луна в контровом свете поверх неё */}
        <div className="relative mt-16 pt-[56vw] sm:pt-[38vw] lg:-mt-[14vw] lg:pt-[18vw]">
          <motion.div style={{ x: wordX }} className="container-site relative z-10">
            <FitText className="font-semibold uppercase tracking-[-0.03em] text-white">
              <span aria-hidden>
                STUDI<MoonO className="mx-[0.02em]" />S
              </span>
            </FitText>
          </motion.div>
          <motion.div
            style={{ y: figY, x: '-50%' }}
            className="pointer-events-none absolute bottom-[3vw] left-1/2 z-20 w-[68vw] sm:w-[44vw] lg:bottom-[2vw] lg:w-[min(25vw,50vh)]"
          >
            <MoonGL light={[0.95, 0.3, -0.4]} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
