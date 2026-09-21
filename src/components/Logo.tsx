import { BRAND } from '../content'
import { MoonO } from './MoonO'

/** Логотип: две строки, «О» в названии — фирменная луна */
export function Logo({ className = '' }: { className?: string }) {
  const name = BRAND.name
  const oIndex = name.search(/[OО]/)
  const suffixO = BRAND.suffix.search(/[OО]/)

  const renderWord = (word: string, i: number) =>
    i === -1 ? (
      word
    ) : (
      <>
        {word.slice(0, i)}
        <MoonO className="mx-[0.02em] h-[0.72em] w-[0.78em]" />
        {word.slice(i + 1)}
      </>
    )

  return (
    <span
      className={`inline-flex select-none flex-col text-[15px] font-bold uppercase leading-[0.9] tracking-[0.04em] text-white sm:text-[17px] ${className}`}
      aria-label={BRAND.full}
      role="img"
    >
      <span aria-hidden>{renderWord(name, oIndex)}</span>
      <span aria-hidden className="tracking-[0.18em]">
        {renderWord(BRAND.suffix, suffixO)}
      </span>
    </span>
  )
}
