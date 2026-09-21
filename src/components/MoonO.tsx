import { useId } from 'react'

type Props = {
  className?: string
  /** Вариант буквы: кольцо с полумесяцем внутри или «чистый» полумесяц */
  variant?: 'ring' | 'crescent'
  title?: string
}

/**
 * Фирменный элемент: буква «О», заменённая на контурное кольцо с полумесяцем.
 * Размер задаётся в em — буква автоматически подстраивается под кегль заголовка.
 * Для скринридеров рядом рендерится обычная «О» (см. MoonText).
 */
export function MoonO({ className = '', variant = 'ring', title }: Props) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      viewBox="0 0 100 100"
      className={`inline-block h-[0.74em] w-[0.8em] align-baseline ${className}`}
      style={{ verticalAlign: '-0.02em' }}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      fill="none"
    >
      {title && <title>{title}</title>}
      <defs>
        <mask id={`m-${id}`}>
          <rect width="100" height="100" fill="#fff" />
          <circle cx="64" cy="42" r="30" fill="#000" />
        </mask>
      </defs>
      {variant === 'ring' ? (
        <>
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="11" />
          <circle cx="44" cy="54" r="26" fill="currentColor" mask={`url(#m-${id})`} opacity="0.9" />
        </>
      ) : (
        <circle cx="50" cy="50" r="44" fill="currentColor" mask={`url(#m-${id})`} />
      )}
    </svg>
  )
}

/**
 * Рендерит строку, заменяя букву после «^» на MoonO.
 * Пример: "ЯСНЫЕ БРЕНДЫ ^ОСТАЮТСЯ" → «О» в слове «остаются» станет луной.
 */
export function MoonText({ text, className }: { text: string; className?: string }) {
  const idx = text.indexOf('^')
  if (idx === -1) return <>{text}</>
  // Слово с луной держим неразрывным, чтобы буква не отрывалась при переносе
  const start = text.lastIndexOf(' ', idx) + 1
  const endSpace = text.indexOf(' ', idx)
  const end = endSpace === -1 ? text.length : endSpace
  const letter = text[idx + 1]
  return (
    <>
      {text.slice(0, start)}
      <span className="whitespace-nowrap">
        {text.slice(start, idx)}
        <span className="relative inline-block">
          <span className="sr-only">{letter}</span>
          <MoonO className={className} />
        </span>
        {text.slice(idx + 2, end)}
      </span>
      {text.slice(end)}
    </>
  )
}
