import { motion } from 'framer-motion'
import { ArrowUpRight } from '../components/Icons'
import { SectionHead } from '../components/SectionHead'
import { SERVICES } from '../content'
import { scrollToHash } from '../lib/lenis'
import { fadeUp, viewportOnce } from '../lib/motion'

/** Карточка с лунным свечением, которое следует за курсором внутри неё */
function ServiceCard({ index, title, text }: { index: number; title: string; text: string }) {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <motion.li variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} custom={index % 3}>
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault()
          scrollToHash('#contact')
        }}
        onPointerMove={onMove}
        className="group glass relative flex h-full min-h-[300px] flex-col overflow-hidden p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-lilac/30 sm:min-h-[340px] sm:p-9"
        aria-label={`${title}: обсудить услугу`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(380px circle at var(--x, 50%) var(--y, 50%), rgba(185,166,255,0.22), rgba(124,92,255,0.1) 40%, transparent 70%)',
          }}
        />
        <div className="relative flex items-start justify-between">
          <span className="text-sm font-medium tracking-[0.2em] text-lilac">{String(index + 1).padStart(2, '0')}</span>
          <span className="btn-round h-12 w-12 border border-white/15 text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-violet group-hover:shadow-[0_10px_40px_-6px_rgba(124,92,255,0.8)]">
            <ArrowUpRight />
          </span>
        </div>
        <div className="relative mt-auto pt-16">
          <h3 className="text-[clamp(1.4rem,2vw,1.9rem)] font-semibold leading-tight tracking-[-0.01em]">{title}</h3>
          <p className="mt-4 max-w-sm text-[15px] leading-[1.6] text-body">{text}</p>
        </div>
      </a>
    </motion.li>
  )
}

export function Services() {
  return (
    <section id="services" aria-label={SERVICES.title} className="section">
      <div aria-hidden className="glow left-[-10%] top-[20%] h-[40vw] w-[40vw] animate-breathe-slow text-indigo/60" />
      <div className="container-site relative">
        <SectionHead eyebrow={SERVICES.eyebrow} title={SERVICES.title} text={SERVICES.text} />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {SERVICES.items.map((s, i) => (
            <ServiceCard key={s.title} index={i} title={s.title} text={s.text} />
          ))}
        </ul>
      </div>
    </section>
  )
}
