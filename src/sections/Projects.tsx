import { m as motion } from 'framer-motion'
import { ArrowUpRight } from '../components/Icons'
import { MeshGradient } from '../components/MeshGradient'
import { MoonPhase } from '../components/Moon'
import { SectionHead } from '../components/SectionHead'
import { PROJECTS, A11Y } from '../content'
import { fadeUp, viewportOnce } from '../lib/motion'

// Асимметричная сетка: первые два кейса крупнее
const LAYOUT = [
  'md:col-span-7 aspect-[4/3] md:aspect-auto md:h-[min(62vw,640px)]',
  'md:col-span-5 aspect-[4/3] md:aspect-auto md:h-[min(62vw,640px)]',
  'md:col-span-4 aspect-[4/3]',
  'md:col-span-4 aspect-[4/3]',
  'md:col-span-4 aspect-[4/3]',
  'md:col-span-12 lg:col-span-12 aspect-[16/9] md:aspect-[21/8]',
]

export function Projects() {
  return (
    <section id="projects" aria-label={PROJECTS.title} className="section">
      <div className="container-site relative">
        <SectionHead eyebrow={PROJECTS.eyebrow} title={PROJECTS.title} text={PROJECTS.text} />

        <ul className="mt-14 grid gap-4 md:grid-cols-12 lg:mt-20">
          {PROJECTS.items.map((p, i) => (
            <motion.li
              key={p.name}
              className={LAYOUT[i]}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              custom={i % 3}
            >
              <a
                href="#contact"
                className="group relative block h-full overflow-hidden rounded-[28px] border border-line"
                aria-label={A11Y.viewCase(p.name, p.category, p.year)}
              >
                {/* ЗАМЕНА НА ФОТО: обложка кейса, например <img src="/images/projects/polaris.jpg" /> */}
                <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]">
                  <MeshGradient colors={p.palette as [string, string, string]} />
                  <CaseArt index={i} name={p.name} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/90 via-night-950/10 to-transparent" aria-hidden />

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-night-950/70 px-3 py-1.5 text-xs text-moon/85 sm:left-7 sm:top-7">
                  <MoonPhase phase={(i + 1) / 6} size={14} />
                  {p.year}
                </div>

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-lilac">{p.category}</p>
                    <h3 className="mt-2 text-[clamp(1.4rem,2.6vw,2.4rem)] font-semibold leading-tight">{p.name}</h3>
                  </div>
                  <span className="flex shrink-0 translate-y-3 items-center gap-2 rounded-full bg-moon py-1.5 pl-4 pr-1.5 text-sm font-medium text-night-950 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-md:translate-y-0 max-md:opacity-100">
                    <span className="hidden sm:inline">{PROJECTS.cta}</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-night-950 text-white">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Абстрактная «обложка» кейса — разные геометрические мотивы бренда */
function CaseArt({ index, name }: { index: number; name: string }) {
  const letter = name.replace(/[«»"]/g, '').charAt(0)
  const motif = index % 3
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      {motif === 0 && (
        <div className="relative aspect-square w-[42%] max-w-[280px] rounded-full border border-white/30">
          <div className="absolute inset-[14%] rounded-full bg-gradient-to-br from-moon/90 to-lilac/20 shadow-[0_0_120px_rgba(185,166,255,0.6)]" />
          <div className="absolute inset-[14%] translate-x-[18%] rounded-full bg-night-950/80" />
        </div>
      )}
      {motif === 1 && (
        <span className="text-[min(34vw,300px)] font-bold leading-none text-white/10 [-webkit-text-stroke:1px_rgba(237,233,255,0.5)]">
          {letter}
        </span>
      )}
      {motif === 2 && (
        <div className="grid w-[46%] max-w-[300px] grid-cols-3 gap-3">
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              className="aspect-square rounded-2xl border border-white/20"
              style={{ background: i % 4 === 0 ? 'rgba(237,233,255,0.75)' : 'rgba(255,255,255,0.05)' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
