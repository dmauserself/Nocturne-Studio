import { m as motion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { fadeUp, lineReveal, viewportOnce } from '../lib/motion'
import { MoonText } from './MoonO'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'p' | 'span' | 'li'
}

/** Появление: fade + сдвиг + лёгкий blur */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Comp = motion[as]
  return (
    <Comp className={className} variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} custom={delay}>
      {children}
    </Comp>
  )
}

type LinesProps = {
  lines: string[]
  className?: string
  lineClassName?: string
  as?: ElementType
  /** Сдвиг отдельных строк вправо, как в референсе. Индексы строк. */
  indent?: Record<number, string>
  /** Управляемый запуск (например, после прелоадера). Если не задан — по появлению во вьюпорте. */
  play?: boolean
  delay?: number
}

/** Заголовок, который проявляется построчно (line reveal) */
export function LineReveal({
  lines,
  className = '',
  lineClassName = '',
  as: Tag = 'h2',
  indent = {},
  play,
  delay = 0,
}: LinesProps) {
  const trigger =
    play !== undefined
      ? { initial: 'hidden', animate: play ? 'show' : 'hidden' }
    : { initial: 'hidden', whileInView: 'show', viewport: viewportOnce }

  return (
    <Tag className={className}>
      <span className="sr-only">{lines.join(' ').replace(/\^/g, '')}</span>
      <motion.span aria-hidden className="block" {...trigger}>
        {lines.map((line, i) => (
          <span key={i} className={`-mb-[0.1em] block overflow-hidden pb-[0.18em] ${indent[i] ?? ''}`}>
            <motion.span className={`text-moonlit block ${lineClassName}`} variants={lineReveal} custom={i + delay}>
              <MoonText text={line} />
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
