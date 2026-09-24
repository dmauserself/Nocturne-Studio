import { m as motion } from 'framer-motion'
import { Portrait } from '../components/Portrait'
import { SectionHead } from '../components/SectionHead'
import { TEAM, A11Y } from '../content'
import { fadeUp, viewportOnce } from '../lib/motion'

const TONES = ['violet', 'indigo', 'purple', 'ice'] as const
const ARTS = ['crescent', 'eclipse', 'crescent', 'eclipse'] as const
const PEOPLE = ['bun', 'beard', 'longhair', 'glasses'] as const

export function Team() {
  return (
    <section id="team" aria-label={TEAM.title} className="section">
      <div className="container-site relative">
        <SectionHead eyebrow={TEAM.eyebrow} title={TEAM.title} text={TEAM.text} />
        <ul className="mt-14 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {TEAM.members.map((m, i) => (
            <motion.li
              key={m.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              custom={i}
              className={`group ${i % 2 === 1 ? 'lg:mt-16' : ''}`}
            >
              <figure className="relative overflow-hidden rounded-[28px] border border-line">
                {/* ЗАМЕНА НА ФОТО: <Portrait src="/images/team/имя.jpg" alt={m.name} ... /> */}
                <Portrait
                  tone={TONES[i % 4]}
                  art={ARTS[i % 4]}
                  person={PEOPLE[i % 4]}
                  alt={A11Y.portrait(m.name)}
                  className="aspect-[3/4] w-full transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                />
                <figcaption className="absolute inset-x-3 bottom-3 rounded-[20px] border border-white/10 bg-night-950/80 p-4">
                  <p className="text-lg font-semibold text-white">{m.name}</p>
                  <p className="mt-1 text-sm text-body">{m.role}</p>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
