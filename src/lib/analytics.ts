/**
 * Яндекс Метрика (необязательно).
 * Чтобы включить — задайте номер счётчика в переменной окружения VITE_YM_ID
 * (Vercel → Settings → Environment Variables) и пересоберите сайт.
 * В Метрике создайте JavaScript-цель с идентификатором «lead» — она срабатывает
 * при успешной отправке заявки, так вы увидите конверсию сайта.
 */

type Ym = ((id: number, method: string, ...args: unknown[]) => void) & { a?: unknown[]; l?: number }

declare global {
  interface Window {
    ym?: Ym
  }
}

const YM_ID = Number(import.meta.env.VITE_YM_ID) || 0

export function initAnalytics() {
  if (!YM_ID || typeof window === 'undefined' || window.ym) return
  // Официальный сниппет Метрики, переписанный без eval-строк
  const ym = ((...args: unknown[]) => {
    ;(ym.a = ym.a || []).push(args)
  }) as Ym
  ym.l = Date.now()
  window.ym = ym
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  document.head.appendChild(script)
  ym(YM_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true })
}

export function reachGoal(goal: string) {
  if (YM_ID && window.ym) window.ym(YM_ID, 'reachGoal', goal)
}
