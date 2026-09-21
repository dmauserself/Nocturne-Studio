import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FitText } from '../components/FitText'
import { ArrowLeft, ArrowRight, ArrowUpRight } from '../components/Icons'
import { Magnetic } from '../components/MagneticButton'
import { MoonGL } from '../components/MoonGL'
import { MoonO } from '../components/MoonO'
import { Portrait } from '../components/Portrait'
import { LineReveal } from '../components/Reveal'
import { BRAND, HERO } from '../content'
import { usePrefersReducedMotion } from '../lib/hooks'
import { scrollToHash } from '../lib/lenis'
import { usePointerParallax } from '../lib/parallax'
import { EASE, fadeUp } from '../lib/motion'

const SLIDE_MS = 5500

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const k = reduced ? 0 : 1
  const moonY = useTransform(scrollYProgress, [0, 1], [0, 60 * k])
  const wordY = useTransform(scrollYProgress, [0, 1], [0, 30 * k])
  const show = ready ? 'show' : 'hidden'

  // Глубина сцены за курсором: надпись (дальний план) и луна (ближний) смещаются в разные стороны
  const pointer = usePointerParallax()
  const moonPX = useTransform(pointer.x, (v) => v * 22)
  const moonPY = useTransform(pointer.y, (v) => v * 12)
  const wordPX = useTransform(pointer.x, (v) => v * -8)

  return (
    <section ref={ref} id="top" aria-label="Первый экран" className="relative px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="window flex min-h-[100svh] flex-col bg-night-950">
        {/* Лунные свечения: индиго → сиреневый → серебро (вместо оранжевого из референса) */}
        <div aria-hidden className="window-bg">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 60% at 0% 0%, rgba(124,92,255,0.55), rgba(42,27,94,0.45) 35%, transparent 70%), radial-gradient(40% 35% at 8% 4%, rgba(237,233,255,0.35), transparent 70%)',
            }}
          />
          <div className="glow left-[30%] top-[35%] h-[45vw] w-[45vw] animate-breathe text-indigo/70" />
          <div className="glow right-[-10%] top-[-10%] h-[30vw] w-[30vw] text-purple/20" />
        </div>

        {/* Контент */}
        <div className="container-site relative z-30 grid flex-1 gap-10 pt-28 sm:pt-32 lg:grid-cols-12 lg:pt-36">
          <div className="lg:col-span-7 xl:col-span-6">
            <motion.p className="eyebrow mb-6 normal-case tracking-[0.08em] text-moon/80" variants={fadeUp} initial="hidden" animate={show}>
              {HERO.eyebrow}
            </motion.p>
            <LineReveal
              as="h1"
              lines={HERO.titleLines}
              play={ready}
              className="font-medium text-white"
              lineClassName="text-[clamp(2.5rem,4.6vw,6rem)] leading-[1] tracking-[-0.035em] lg:whitespace-nowrap"
            />
            <motion.p
              className="lead mt-7 max-w-md"
              variants={fadeUp}
              initial="hidden"
              animate={show}
              custom={4}
            >
              {HERO.subtitle}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-3"
              variants={fadeUp}
              initial="hidden"
              animate={show}
              custom={5}
            >
              <Magnetic>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToHash('#contact') }} className="btn-primary">
                  {HERO.ctaPrimary}
                  <span className="btn-dot">
                    <ArrowUpRight />
                  </span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToHash('#projects') }} className="btn-ghost">
                  {HERO.ctaSecondary}
                </a>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9"
            variants={fadeUp}
            initial="hidden"
            animate={show}
            custom={6}
          >
            <HeroCarousel />
            <div className="grid grid-cols-2 gap-6 sm:gap-10">
              {HERO.stats.map((s) => (
                <div key={s.value}>
                  <p className="text-[clamp(3rem,5.6vw,6rem)] font-light leading-none tracking-[-0.05em] text-white">
                    {s.value}
                  </p>
                  <p className="mt-4 max-w-[15rem] text-[13px] leading-[1.5] text-body sm:text-sm">{s.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Сцена: гигантская надпись и 3D-луна поверх неё (эффект глубины, как в референсе) */}
        <div className="relative mt-10 pt-[70vw] sm:pt-[48vw] lg:mt-0 lg:pt-0">
          <motion.div style={{ y: wordY }} className="container-site relative z-10 pb-6 sm:pb-10">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1.4, ease: EASE, delay: 0.25 }}
            >
              <motion.div style={{ x: wordPX }}>
                <FitText className="font-semibold uppercase tracking-[-0.03em] text-white">
                  <span aria-hidden>
                    N<MoonO className="mx-[0.02em]" />CTURNE
                  </span>
                  <span className="sr-only">{BRAND.name}</span>
                </FitText>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: moonY, x: '-50%' }}
            className="pointer-events-none absolute bottom-[5vw] left-1/2 z-20 w-[78vw] sm:w-[54vw] lg:bottom-[4.5vw] lg:w-[min(31vw,60vh)]"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={ready ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1.8, ease: EASE, delay: 0.1 }}
          >
            <motion.div style={{ x: moonPX, y: moonPY }}>
              {/* Тень под луной на буквах — усиливает ощущение, что луна висит перед надписью */}
              <div
                aria-hidden
                className="absolute inset-x-[8%] bottom-[-6%] h-[30%] rounded-full"
                style={{ background: 'radial-gradient(closest-side, rgba(5,3,10,0.85), transparent)' }}
              />
              <MoonGL />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/**
 * Карусель без пересоздания элементов: все слайды всегда в DOM и лежат друг на друге.
 * Новый слайд плавно проявляется ПОВЕРХ предыдущего (тот остаётся непрозрачным под ним),
 * поэтому нет провала яркости и «возврата» старой картинки на долю секунды.
 * Анимируются только opacity/transform — это дёшево даже для Safari.
 */
function HeroCarousel() {
  const reduced = usePrefersReducedMotion()
  const slides = HERO.slides
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)

  const goTo = (next: number) => {
    if (next === index) return
    setPrev(index)
    setIndex(next)
  }
  const go = (d: number) => goTo((index + d + slides.length) % slides.length)

  // Предыдущий слайд убираем, когда новый полностью проявился
  useEffect(() => {
    if (prev === null) return
    const t = setTimeout(() => setPrev(null), 800)
    return () => clearTimeout(t)
  }, [prev, index])

  useEffect(() => {
    if (paused || reduced) return
    const t = setTimeout(() => goTo((index + 1) % slides.length), SLIDE_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, reduced])

  return (
    <div
      className="glass flex gap-5 p-3 pr-5 sm:p-3.5 sm:pr-6"
      role="region"
      aria-roledescription="карусель"
      aria-label="Наши принципы"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] w-[42%] shrink-0 overflow-hidden rounded-[20px] bg-night-900">
        {slides.map((s, i) => {
          const active = i === index
          const under = i === prev
          return (
            <div
              key={s.title}
              aria-hidden
              className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{
                opacity: active || under ? 1 : 0,
                transform: active ? 'scale(1)' : 'scale(1.06)',
                zIndex: active ? 2 : under ? 1 : 0,
                // уходящий слайд под новым не анимируем — он просто остаётся видимым
                transitionDuration: active ? undefined : '0ms',
              }}
            >
              {/* ЗАМЕНА НА ФОТО: <Portrait src="/images/hero/slide-1.jpg" alt="..." /> */}
              <Portrait tone={s.tone} art={s.art} className="h-full w-full" />
            </div>
          )
        })}
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex justify-end">
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault()
              scrollToHash('#services')
            }}
            className="btn-round btn-round--light h-9 w-9"
            aria-label="Перейти к услугам"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Все тексты в одной ячейке сетки: без перемонтирования и скачков высоты */}
        <div className="mt-auto grid">
          <p className="sr-only" aria-live="polite">
            {slides[index].title}. {slides[index].text}
          </p>
          {slides.map((s, i) => {
            const active = i === index
            return (
              <div
                key={s.title}
                aria-hidden
                className="[grid-area:1/1] transition-[opacity,transform] ease-[cubic-bezier(.22,1,.36,1)]"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateY(0)' : 'translateY(10px)',
                  transitionDuration: active ? '550ms' : '200ms',
                  transitionDelay: active ? '120ms' : '0ms',
                }}
              >
                <h2 className="text-lg font-semibold text-white sm:text-xl">{s.title}</h2>
                <p className="mt-2 text-[13px] leading-[1.5] text-body">{s.text}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex flex-1 gap-1.5" aria-hidden>
            {slides.map((_, i) => (
              <span key={i} className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/15">
                {i < index && <span className="absolute inset-0 bg-lilac/60" />}
                {i === index && (
                  <span
                    key={index}
                    className="absolute inset-0 origin-left bg-lilac"
                    style={{
                      animation: reduced ? undefined : `slide-progress ${SLIDE_MS}ms linear forwards`,
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                  />
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} className="btn-round btn-round--light h-9 w-9" aria-label="Предыдущий слайд">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(1)} className="btn-round btn-round--accent h-9 w-9" aria-label="Следующий слайд">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
