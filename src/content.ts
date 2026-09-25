/**
 * Тексты сайта. Основной язык — русский (i18n/ru.ts), английский — i18n/en.ts.
 * Язык выбирается при загрузке страницы (см. i18n/locale.ts), компоненты просто импортируют нужные блоки.
 * Меняйте формулировки, цифры и контакты в файлах i18n/ru.ts и i18n/en.ts.
 */
import { en, type Content } from './i18n/en'
import { detectLocale } from './i18n/locale'
import { ru } from './i18n/ru'

/**
 * ДЕМО-РЕЖИМ (сайт для портфолио).
 * true  — форма не отправляет заявки и честно сообщает об этом, в футере пометка «концепт-проект».
 * false — боевой режим: заявки уходят в Telegram (см. DEPLOY.md), пометка скрыта.
 */
export const DEMO_MODE = true

export const LOCALE = detectLocale()

const C: Content = LOCALE === 'en' ? en : ru

export const {
  META,
  LANG,
  DEMO,
  BRAND,
  NAV_LEFT,
  NAV_RIGHT,
  HERO,
  MARQUEE,
  PRESENCE,
  SERVICES,
  PHILOSOPHY,
  PROJECTS,
  PROCESS,
  TEAM,
  TESTIMONIALS,
  FAQ,
  CONTACT,
  FOOTER,
  A11Y,
} = C
