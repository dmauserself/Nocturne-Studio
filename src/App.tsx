import { lazy, Suspense, useEffect, useState } from 'react'
import { CursorGlow } from './components/CursorGlow'
import { Noise } from './components/Noise'
import { Preloader } from './components/Preloader'
import { Starfield } from './components/Starfield'
import { initLenis, startScroll, stopScroll } from './lib/lenis'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Marquee } from './sections/Marquee'

// Секции ниже первого экрана — отдельный чанк. Загрузку запускаем сразу,
// чтобы к концу прелоадера он был готов и страница не «прыгала» при скролле.
const belowFold = import('./sections/BelowFold')
const BelowFold = lazy(() => belowFold)

const PRELOAD_MS = 1300

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const destroy = initLenis()
    stopScroll()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false
    // Прелоадер держим, пока не загрузятся шрифты и нижние секции (но не дольше 3 с)
    const minDelay = new Promise((r) => setTimeout(r, reduced ? 300 : PRELOAD_MS))
    const assets = Promise.race([
      Promise.all([document.fonts?.ready, belowFold]),
      new Promise((r) => setTimeout(r, 3000)),
    ])
    Promise.all([minDelay, assets]).then(() => {
      if (cancelled) return
      setLoading(false)
      startScroll()
      window.scrollTo(0, 0)
    })
    return () => {
      cancelled = true
      destroy()
    }
  }, [])

  return (
    <>
      <Preloader visible={loading} />
      <a
        href="#main"
        className="sr-only z-[110] rounded-full bg-moon px-5 py-3 text-night-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Перейти к содержимому
      </a>
      <Starfield />
      <CursorGlow />
      <Header />
      <main id="main" className="relative z-10">
        <Hero ready={!loading} />
        <Marquee />
        <Suspense fallback={<div className="min-h-screen" />}>
          <BelowFold />
        </Suspense>
      </main>
      <Noise />
    </>
  )
}
