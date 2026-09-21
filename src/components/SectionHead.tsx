import { LineReveal, Reveal } from './Reveal'

type Props = {
  eyebrow: string
  title: string
  text?: string
  className?: string
}

/** Стандартная шапка секции: подпись, крупный заголовок, лид */
export function SectionHead({ eyebrow, title, text, className = '' }: Props) {
  return (
    <div className={`grid gap-6 md:grid-cols-12 md:items-end ${className}`}>
      <div className="md:col-span-7">
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-lilac/60" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <LineReveal lines={[title]} className="h-display" as="h2" />
      </div>
      {text && (
        <Reveal className="md:col-span-4 md:col-start-9" delay={2}>
          <p className="lead">{text}</p>
        </Reveal>
      )}
    </div>
  )
}
