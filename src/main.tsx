import { LazyMotion, MotionConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './lib/browser'
import { META } from './content'
import { initAnalytics } from './lib/analytics'

// Язык, заголовок и описание страницы — по выбранному языку (по умолчанию русский, см. i18n/locale.ts)
document.documentElement.lang = META.lang
document.title = META.title
document.querySelector('meta[name="description"]')?.setAttribute('content', META.description)

initAnalytics()

// Всегда открываем страницу с первого экрана: прелоадер и hero-анимации рассчитаны на старт сверху
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Функции анимаций подгружаются отдельным чанком (см. lib/motionFeatures.ts)
const loadMotionFeatures = () => import('./lib/motionFeatures').then((m) => m.default)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={loadMotionFeatures} strict>
      {/* reducedMotion="never": анимации работают даже при «Уменьшить движение» (см. lib/browser.ts) */}
      <MotionConfig reducedMotion="never">
        <App />
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
)
