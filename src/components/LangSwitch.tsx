import { LANG, LOCALE } from '../content'
import { switchLocale, type Locale } from '../i18n/locale'

const LOCALES: Locale[] = ['ru', 'en']

/** Переключатель языка RU | EN. Выбор запоминается, страница перезагружается на выбранном языке. */
export function LangSwitch({ className = '' }: { className?: string }) {
  return (
    <div
      role="group"
      aria-label="Язык / Language"
      className={`flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 text-[11px] font-semibold tracking-[0.12em] ${className}`}
    >
      {LOCALES.map((l) => {
        const active = l === LOCALE
        return (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={active}
            aria-label={active ? undefined : LANG.switchLabel}
            onClick={() => !active && switchLocale(l)}
            className={`rounded-full px-2.5 py-1.5 leading-none transition-colors duration-300 ${
              active ? 'bg-moon text-night-950' : 'text-moon/70 hover:text-white'
            }`}
          >
            {l.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
