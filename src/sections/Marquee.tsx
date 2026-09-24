import { MoonO } from '../components/MoonO'
import { MARQUEE, A11Y } from '../content'

/** Бегущая строка с контурными буквами */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {MARQUEE.map((word, i) => (
        <li key={`${word}-${i}`} className="flex items-center">
          <span className="text-outline px-6 text-[clamp(2.4rem,7vw,6.5rem)] font-semibold uppercase leading-none tracking-[-0.02em] transition-colors duration-500 hover:text-moon sm:px-10">
            {word}
          </span>
          <MoonO variant="crescent" className="h-[clamp(1.2rem,2.6vw,2.4rem)] w-[clamp(1.2rem,2.6vw,2.4rem)] text-lilac/80" />
        </li>
      ))}
    </ul>
  )

  return (
    <section aria-label={A11Y.marquee} className="relative overflow-clip border-y border-line py-10 sm:py-14">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
      {/* Плавные края — статичные градиенты вместо mask-image (маска на анимации дорогая в Safari) */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[12%] bg-gradient-to-r from-night-950 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[12%] bg-gradient-to-l from-night-950 to-transparent" />
    </section>
  )
}
