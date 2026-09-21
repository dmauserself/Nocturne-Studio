import { useId } from 'react'

export type OrbVariant = 'crescent' | 'eclipse' | 'ringed' | 'star' | 'full'

type Props = {
  variant?: OrbVariant
  className?: string
}

/**
 * Небесные объекты в стиле «лунной ночи»: полумесяц, затмение с короной,
 * планета с наклонным кольцом, путеводная звезда, полная луна.
 * Нарисованы только градиентами — без SVG-фильтров, поэтому легко отрисовываются
 * даже в Safari и на телефонах и не мигают при анимации.
 */
export function Orb({ variant = 'crescent', className = '' }: Props) {
  const id = useId().replace(/:/g, '')
  const u = (n: string) => `url(#${n}-${id})`

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        {/* Объём сферы: блик сверху-справа, глубокая тень к краю */}
        <radialGradient id={`sphere-${id}`} cx="62%" cy="32%" r="78%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.22" stopColor="#E4DCFF" />
          <stop offset="0.55" stopColor="#9A84F4" />
          <stop offset="0.85" stopColor="#3B2A86" />
          <stop offset="1" stopColor="#1C1244" />
        </radialGradient>
        {/* Пятна «морей» */}
        <radialGradient id={`mare-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#5A46B3" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5A46B3" stopOpacity="0" />
        </radialGradient>
        {/* Кратер: тень у ближней стенки, свет на дальней */}
        <radialGradient id={`crater-${id}`} cx="40%" cy="62%" r="60%">
          <stop offset="0" stopColor="#4B3A9E" stopOpacity="0.5" />
          <stop offset="0.7" stopColor="#6E58C8" stopOpacity="0.2" />
          <stop offset="0.9" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`halo-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0.5" stopColor="#B9A6FF" stopOpacity="0.55" />
          <stop offset="0.62" stopColor="#7C5CFF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
        </radialGradient>
        {/* Корона затмения: яркое кольцо ровно по краю диска */}
        <radialGradient id={`corona-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0.54" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.575" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.62" stopColor="#D5C9FF" stopOpacity="0.75" />
          <stop offset="0.75" stopColor="#7C5CFF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`dark-${id}`} cx="35%" cy="35%" r="75%">
          <stop offset="0" stopColor="#1E1540" />
          <stop offset="1" stopColor="#06040D" />
        </radialGradient>
        <linearGradient id={`ring-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7C5CFF" stopOpacity="0.15" />
          <stop offset="0.35" stopColor="#EDE9FF" stopOpacity="0.95" />
          <stop offset="0.7" stopColor="#B9A6FF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#7C5CFF" stopOpacity="0.15" />
        </linearGradient>
        <mask id={`cres-${id}`}>
          <rect width="200" height="200" fill="#fff" />
          <circle cx="76" cy="88" r="58" fill="#000" />
        </mask>
        <clipPath id={`back-${id}`}>
          <rect x="0" y="0" width="200" height="100" />
        </clipPath>
        <clipPath id={`front-${id}`}>
          <rect x="0" y="100" width="200" height="100" />
        </clipPath>
        <clipPath id={`ball-${id}`}>
          <circle cx="100" cy="100" r="62" />
        </clipPath>
      </defs>

      {variant === 'crescent' && (
        <>
          <circle cx="100" cy="100" r="96" fill={u('halo')} />
          {/* Пепельный свет ночной стороны */}
          <circle cx="100" cy="100" r="62" fill={u('dark')} />
          <g mask={u('cres')}>
            <Surface u={u} />
          </g>
          <circle cx="100" cy="100" r="61.5" fill="none" stroke="#B9A6FF" strokeOpacity="0.35" />
        </>
      )}

      {variant === 'eclipse' && (
        <>
          <circle cx="100" cy="100" r="100" fill={u('corona')} />
          <circle cx="100" cy="100" r="57" fill={u('dark')} />
          <circle cx="100" cy="100" r="57" fill="none" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="1.2" />
          {/* «Алмазное кольцо» — вспышка на краю */}
          <circle cx="140" cy="60" r="5" fill="#fff" />
          <circle cx="140" cy="60" r="14" fill={u('halo')} />
        </>
      )}

      {variant === 'ringed' && (
        <g transform="rotate(-16 100 100)">
          {/* Задняя половина кольца — за сферой */}
          <g clipPath={u('back')}>
            <ellipse cx="100" cy="100" rx="94" ry="22" fill="none" stroke={u('ring')} strokeWidth="5" />
            <ellipse cx="100" cy="100" rx="80" ry="17" fill="none" stroke={u('ring')} strokeOpacity="0.5" strokeWidth="2" />
          </g>
          <g transform="rotate(16 100 100)">
            <circle cx="100" cy="100" r="80" fill={u('halo')} />
            <Surface u={u} r={50} />
          </g>
          {/* Передняя половина кольца — перед сферой */}
          <g clipPath={u('front')}>
            <ellipse cx="100" cy="100" rx="94" ry="22" fill="none" stroke={u('ring')} strokeWidth="5" />
            <ellipse cx="100" cy="100" rx="80" ry="17" fill="none" stroke={u('ring')} strokeOpacity="0.5" strokeWidth="2" />
          </g>
        </g>
      )}

      {variant === 'full' && (
        <>
          <circle cx="100" cy="100" r="98" fill={u('halo')} />
          <Surface u={u} />
          <circle cx="100" cy="100" r="61.5" fill="none" stroke="#EDE9FF" strokeOpacity="0.4" />
        </>
      )}

      {variant === 'star' && (
        <>
          <circle cx="100" cy="100" r="92" fill={u('halo')} opacity="0.75" />
          {/* Орбиты */}
          <ellipse cx="100" cy="100" rx="78" ry="78" fill="none" stroke={u('ring')} strokeOpacity="0.45" strokeWidth="1" />
          <ellipse cx="100" cy="100" rx="88" ry="30" fill="none" stroke={u('ring')} strokeWidth="1.6" transform="rotate(-24 100 100)" />
          <circle cx="176" cy="72" r="4" fill="#EDE9FF" />
          <circle cx="176" cy="72" r="12" fill={u('halo')} />
          {/* Путеводная звезда: четыре длинных луча и мягкое ядро */}
          <circle cx="100" cy="100" r="34" fill={u('halo')} />
          <path d="M100 26C103 78 108 92 160 100C108 108 103 122 100 174C97 122 92 108 40 100C92 92 97 78 100 26Z" fill={u('sphere')} />
          <path d="M100 64C101 90 104 96 126 100C104 104 101 110 100 136C99 110 96 104 74 100C96 96 99 90 100 64Z" fill="#FFFFFF" transform="rotate(45 100 100)" opacity="0.7" />
          <circle cx="100" cy="100" r="5" fill="#FFFFFF" />
          {/* Малые звёзды */}
          <path d="M52 50C53 58 54 59 62 60C54 61 53 62 52 70C51 62 50 61 42 60C50 59 51 58 52 50Z" fill="#EDE9FF" opacity="0.8" />
          <path d="M150 142C151 148 152 149 158 150C152 151 151 152 150 158C149 152 148 151 142 150C148 149 149 148 150 142Z" fill="#EDE9FF" opacity="0.65" />
        </>
      )}
    </svg>
  )
}

/** Освещённая поверхность луны: сфера, моря и кратеры */
function Surface({ u, r = 62 }: { u: (n: string) => string; r?: number }) {
  const k = r / 62
  const craters: [number, number, number][] = [
    [122, 72, 9],
    [140, 104, 12],
    [112, 130, 7],
    [150, 136, 6],
    [96, 96, 5],
    [130, 150, 8],
  ]
  return (
    <g clipPath={u('ball')} transform={k !== 1 ? `translate(${100 - 100 * k} ${100 - 100 * k}) scale(${k})` : undefined}>
      <circle cx="100" cy="100" r="62" fill={u('sphere')} />
      <ellipse cx="128" cy="96" rx="22" ry="16" fill={u('mare')} />
      <ellipse cx="110" cy="138" rx="18" ry="12" fill={u('mare')} />
      {craters.map(([x, y, cr], i) => (
        <circle key={i} cx={x} cy={y} r={cr} fill={u('crater')} />
      ))}
    </g>
  )
}
