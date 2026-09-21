import { motion } from 'framer-motion'
import { useRef } from 'react'
import { Counter } from '../components/Counter'
import { ArrowLeft, ArrowRight } from '../components/Icons'
import { Logo } from '../components/Logo'
import { MeshGradient } from '../components/MeshGradient'
import { Orb } from '../components/Orb'
import { LineReveal, Reveal } from '../components/Reveal'
import { PRESENCE } from '../content'
import { fadeUp, viewportOnce } from '../lib/motion'

export function Presence() {
  const track = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    const el = track.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: 'smooth' })
  }

  return (
    <section id="about" aria-label="О студии" className="relative px-2 sm:px-3">
      <div className="window section bg-night-950">
        <div aria-hidden className="window-bg">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(45% 60% at 92% 30%, rgba(185,166,255,0.45), rgba(124,92,255,0.3) 30%, rgba(42,27,94,0.35) 55%, transparent 75%)',
            }}
          />
          <div className="glow right-[5%] top-[10%] h-[28vw] w-[28vw] animate-breathe text-lilac/25" />
        </div>

        <div className="container-site relative">
          <div className="relative grid gap-8 lg:grid-cols-12">
            <div className="hidden lg:col-span-2 lg:block">
              <Logo />
            </div>
            <div className="lg:col-span-10">
              <LineReveal
                lines={PRESENCE.titleLines}
                indent={{ 2: 'lg:pl-[14%]', 3: 'lg:pl-[14%]' }}
                lineClassName="lg:whitespace-nowrap"
                className="h-display !text-[clamp(1.75rem,3.7vw,4.6rem)]"
              />
              <Reveal delay={3} className="mt-8 max-w-md lg:ml-[14%]">
                <p className="lead">{PRESENCE.text}</p>
              </Reveal>
            </div>
            <p className="absolute right-0 top-0 hidden text-right text-sm text-moon/80 lg:block">{PRESENCE.side}</p>
          </div>

          <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-12">
            <div className="flex items-end justify-between lg:col-span-3 lg:flex-col lg:items-start">
              <p className="text-sm text-moon/80">{PRESENCE.eyebrow}</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => scrollBy(-1)} className="btn-round btn-round--light h-14 w-14 sm:h-[72px] sm:w-[72px]" aria-label="Предыдущая карточка">
                  <ArrowLeft />
                </button>
                <button type="button" onClick={() => scrollBy(1)} className="btn-round btn-round--accent h-14 w-14 sm:h-[72px] sm:w-[72px]" aria-label="Следующая карточка">
                  <ArrowRight />
                </button>
              </div>
            </div>

            <div
              ref={track}
              className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] lg:col-span-9 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
              data-lenis-prevent-wheel
            >
              {PRESENCE.cards.map((c, i) => {
                const light = c.variant === 'light'
                return (
                  <motion.article
                    key={c.title}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewportOnce}
                    custom={i}
                    className={`relative flex aspect-[4/5] w-[82%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[24px] p-6 sm:w-[46%] sm:p-8 lg:w-[calc((100%-2rem)/3)] ${
                      light ? 'bg-moon text-night-950' : 'border border-line text-white'
                    }`}
                  >
                    {c.variant === 'mesh' && <MeshGradient colors={['#7C5CFF', '#2A1B5E', '#9B5CFF']} animated />}
                    {c.variant === 'portrait' && (
                      <>
                        <MeshGradient colors={['#9B5CFF', '#2A1B5E', '#B9A6FF']} />
                        <Orb variant="ringed" className="absolute -right-[16%] bottom-[10%] w-[92%]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent" />
                      </>
                    )}
                    <p className={`relative text-[clamp(3.2rem,5.4vw,5.6rem)] font-light leading-none tracking-[-0.05em] ${light ? 'text-night-950' : 'text-white'}`}>
                      <Counter to={c.value} suffix={c.suffix} />
                    </p>
                    <div className="relative">
                      <h3 className={`text-lg font-semibold sm:text-xl ${light ? 'text-night-950' : 'text-white'}`}>{c.title}</h3>
                      <p className={`mt-3 text-sm leading-[1.55] ${light ? 'text-night-950/70' : 'text-moon/75'}`}>{c.text}</p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
