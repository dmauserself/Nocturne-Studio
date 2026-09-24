import Lenis from 'lenis'
import { isSafari, prefersReducedMotion } from './browser'

let lenis: Lenis | null = null


export function initLenis(): () => void {
  const reduced = prefersReducedMotion()
  // Safari: родная инерционная прокрутка вместо JS-скролла (см. lib/browser.ts)
  if (reduced || isSafari) {
    document.documentElement.classList.add('native-scroll')
    return () => {}
  }

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    anchors: { offset: -90 },
  })

  let raf = 0
  const loop = (time: number) => {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function stopScroll() {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function startScroll() {
  lenis?.start()
  document.documentElement.style.overflow = ''
}

/** Плавный переход к якорю с учётом высоты шапки */
export function scrollToHash(hash: string) {
  const target = hash === '#top' ? 0 : document.querySelector<HTMLElement>(hash)
  if (target === null) return
  if (lenis) {
    lenis.scrollTo(target, { offset: -90, duration: 1.4 })
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
