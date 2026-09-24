/**
 * Определение Safari и переключатель «облегчённых эффектов».
 *
 * Safari (особенно на MacBook) тяжелее переносит часть «живых» эффектов: мерцание звёзд,
 * «дыхание» свечений, анимацию размытия при появлении блоков — от них страница может мигать.
 * Сейчас эффекты включены везде. Если в Safari начнёт мигать — поставьте true:
 * эти анимации отключатся только в Safari, в остальных браузерах всё останется как есть.
 */
export const SAFARI_LITE_EFFECTS = false

export const isSafari =
  typeof navigator !== 'undefined' && /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent)

/** true — «живые» анимации выключены (только Safari и только если включён переключатель выше) */
export const liteEffects = isSafari && SAFARI_LITE_EFFECTS

if (typeof document !== 'undefined') document.documentElement.classList.toggle('lite-effects', liteEffects)

/**
 * Учитывать ли системную настройку «Уменьшить движение» (prefers-reduced-motion).
 * false — сайт всегда полностью анимирован, даже если настройка включена (по желанию владельца).
 * true  — при включённой настройке анимации упрощаются (рекомендуется для реальных клиентских сайтов:
 *         эту настройку включают люди, которым от движения на экране становится плохо).
 */
export const RESPECT_REDUCED_MOTION = false

export const prefersReducedMotion = () =>
  RESPECT_REDUCED_MOTION && typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
