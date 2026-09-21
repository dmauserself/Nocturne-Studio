import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './lib/browser'
import { initAnalytics } from './lib/analytics'

initAnalytics()

// Всегда открываем страницу с первого экрана: прелоадер и hero-анимации рассчитаны на старт сверху
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
