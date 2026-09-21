import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, QuoteMark } from '../components/Icons'
import { Moon } from '../components/Moon'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { TESTIMONIALS } from '../content'
import { EASE } from '../lib/motion'

const AUTOPLAY_MS = 7000

export function Testimonials() {
  const items = TESTIMONIALS.items
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)

  const go = (d: number) => setState(([i]) => [(i + d + items.length) % items.length, d])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => go(1), AUTOPLAY_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused])

  const item = items[index]

  return (
    <section id="testimonials" aria-label={TESTIMONIALS.title} className="relative px-2 sm:px-3">
      <div className="window section bg-night-900">
        <div aria-hidden className="window-bg">
          <div className="absolute -right-[12%] -top-[18%] w-[min(60vw,720px)] opacity-60">
            <Moon textured={false} />
          </div>
        </div>
        <div className="container-site relative">
          <SectionHead eyebrow={TESTIMONIALS.eyebrow} title={TESTIMONIALS.title} />

          <Reveal className="mt-14 lg:mt-20">
            <div
              className="glass relative p-7 sm:p-12 lg:p-16"
              role="region"
              aria-roledescription="слайдер"
              aria-label="Отзывы клиентов"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <QuoteMark className="h-10 w-10 text-violet sm:h-14 sm:w-14" />
              <div className="relative mt-8 min-h-[260px] sm:min-h-[220px] lg:min-h-[200px]" aria-live="polite">
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.figure
                    key={index}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 40, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: dir * -40, filter: 'blur(6px)' }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <blockquote className="max-w-5xl text-[clamp(1.25rem,2.6vw,2.4rem)] font-medium leading-[1.3] tracking-[-0.01em] text-white">
                      «{item.quote}»
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-lilac to-violet text-base font-semibold text-night-950" aria-hidden>
                        {item.name.charAt(0)}
                      </span>
                      <span>
                        <span className="block font-semibold text-white">{item.name}</span>
                        <span className="block text-sm text-body">{item.role}</span>
                      </span>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              <div className="mt-10 flex items-center justify-between gap-6 border-t border-line pt-8">
                <div className="flex items-center gap-2" role="tablist" aria-label="Выбор отзыва">
                  {items.map((t, i) => (
                    <button
                      key={t.name}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Отзыв ${i + 1}: ${t.name}`}
                      onClick={() => setState([i, i > index ? 1 : -1])}
                      className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-lilac' : 'w-2 bg-white/25 hover:bg-white/50'}`}
                    />
                  ))}
                  <span className="ml-4 text-sm tabular-nums text-body">
                    {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => go(-1)} className="btn-round btn-round--light h-12 w-12 sm:h-14 sm:w-14" aria-label="Предыдущий отзыв">
                    <ArrowLeft />
                  </button>
                  <button type="button" onClick={() => go(1)} className="btn-round btn-round--accent h-12 w-12 sm:h-14 sm:w-14" aria-label="Следующий отзыв">
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
