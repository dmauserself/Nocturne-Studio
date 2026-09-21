import { useEffect, useRef } from 'react'
import { liteEffects } from '../lib/browser'

/**
 * Деликатное звёздное небо на canvas.
 * Звёзды мягко мерцают (в режиме облегчённых эффектов, см. lib/browser.ts, небо рисуется один раз).
 * Во время прокрутки мерцание замирает, чтобы не отнимать ресурсы у скролла.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const twinkle = !liteEffects && !reduced
    const tints = ['237,233,255', '185,166,255', '143,180,255']
    let stars: { x: number; y: number; r: number; a: number; s: number; p: number; tint: string }[] = []
    let w = 0
    let h = 0

    const setup = () => {
      // На мобильных высота окна меняется при скролле (панель браузера) — пересоздаём только по ширине
      if (window.innerWidth === w && canvas.width) return false
      w = window.innerWidth
      h = Math.max(window.innerHeight, window.screen.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(170, (w * h) / 8500))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.2,
        a: Math.random() * 0.55 + 0.12,
        s: Math.random() * 0.0015 + 0.0004,
        p: Math.random() * Math.PI * 2,
        tint: tints[Math.random() < 0.8 ? 0 : Math.random() < 0.6 ? 1 : 2],
      }))
      return true
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const tw = twinkle ? 0.55 + 0.45 * Math.sin(t * s.s + s.p) : 1
        ctx.fillStyle = `rgba(${s.tint},${s.a * tw})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let scrolling = false
    let scrollTimer = 0
    const onScroll = () => {
      scrolling = true
      clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => (scrolling = false), 180)
    }

    let raf = 0
    let last = 0
    const loop = (t: number) => {
      if (!scrolling && !document.hidden && t - last > 33) {
        draw(t)
        last = t
      }
      raf = requestAnimationFrame(loop)
    }

    const onResize = () => {
      if (setup()) draw(performance.now())
    }

    setup()
    draw(0)
    window.addEventListener('resize', onResize)
    if (twinkle) {
      window.addEventListener('scroll', onScroll, { passive: true })
      raf = requestAnimationFrame(loop)
    }
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(scrollTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas ref={ref} className="pointer-events-none fixed left-0 top-0 z-0 opacity-80" aria-hidden />
}
