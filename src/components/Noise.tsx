import { useEffect, useRef } from 'react'

/**
 * Зернистость поверх сайта. Текстура шума рисуется один раз на canvas и
 * используется как обычная картинка — это в разы дешевле SVG-фильтра feTurbulence,
 * который Safari пересчитывал при каждой прокрутке.
 */
export function Noise() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const size = 160
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx || !ref.current) return
    const img = ctx.createImageData(size, size)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255
      img.data[i] = v
      img.data[i + 1] = v
      img.data[i + 2] = v
      img.data[i + 3] = Math.random() * 230
    }
    ctx.putImageData(img, 0, 0)
    ref.current.style.setProperty('--noise-url', `url(${canvas.toDataURL('image/png')})`)
  }, [])

  return <div ref={ref} className="noise" aria-hidden />
}
