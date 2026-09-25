/**
 * Язык сайта. Основной — русский.
 * Английский включается переключателем в шапке или ссылкой с ?lang=en; выбор запоминается в браузере.
 */
export type Locale = 'ru' | 'en'

export const DEFAULT_LOCALE: Locale = 'ru'
const KEY = 'nocturne-lang'

const isLocale = (v: unknown): v is Locale => v === 'ru' || v === 'en'

function readStored(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null // приватный режим / запрет хранилища
  }
}

function store(locale: Locale) {
  try {
    localStorage.setItem(KEY, locale)
  } catch {
    /* не критично: язык просто не запомнится */
  }
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(fromUrl)) {
    store(fromUrl)
    return fromUrl
  }
  const stored = readStored()
  return isLocale(stored) ? stored : DEFAULT_LOCALE
}

/** Переключает язык: запоминает выбор и перезагружает страницу с нужным параметром в адресе */
export function switchLocale(locale: Locale) {
  store(locale)
  const url = new URL(window.location.href)
  if (locale === DEFAULT_LOCALE) url.searchParams.delete('lang')
  else url.searchParams.set('lang', locale)
  url.hash = ''
  window.location.assign(url.toString())
}
