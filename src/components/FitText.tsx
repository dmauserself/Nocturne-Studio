import type { ReactNode } from 'react'
import { useLayoutEffect, useRef } from 'react'

/**
 * Растягивает однострочный текст на всю ширину контейнера.
 * Используется для гигантских надписей NOCTURNE / STUDIOS.
 */
export function FitText({ children, className = '' }: { children: ReactNode; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const w = wrap.current
    const t = inner.current
    if (!w || !t) return
    const fit = () => {
      t.style.fontSize = '100px'
      const ratio = w.clientWidth / t.scrollWidth
      t.style.fontSize = `${Math.floor(100 * ratio * 100) / 100}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(w)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrap} className={`w-full ${className}`}>
      <span ref={inner} className="inline-block whitespace-nowrap leading-[0.8]">
        {children}
      </span>
    </div>
  )
}
