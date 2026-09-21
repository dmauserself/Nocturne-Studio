import { useId } from 'react'

export type PersonVariant = 'bun' | 'beard' | 'longhair' | 'glasses'

/**
 * Силуэты людей в профиле (взгляд вправо) с лунным контровым светом.
 * Нарисованы без SVG-фильтров: свет по контуру — это несколько обводок
 * с радиальным градиентом, поэтому они лёгкие и не мигают в Safari.
 * Заглушки вместо фото — см. src/assets/README.md.
 */

// Общие участки профиля: лоб → нос → губы. Меняются затылок, причёска, подбородок и плечи.
const FACE_UPPER = 'C236 150 238 158 242 166C246 176 254 190 258 200C258 206 250 210 243 211'
const LIPS_CHIN =
  'C246 216 246 221 241 224C239 226 240 228 243 230C245 236 241 240 236 241C238 250 235 259 227 263C216 268 200 268 192 266'

const SHAPES: Record<PersonVariant, { body: string; extra?: string }> = {
  // Женщина с пучком: длинная шея, узкие плечи
  bun: {
    body: `M26 400C40 356 74 332 120 320C126 302 124 288 118 274C102 254 92 228 92 194C92 132 128 86 174 84C214 82 236 110 236 140${FACE_UPPER}${LIPS_CHIN}C192 288 198 306 216 318C246 334 270 352 282 400Z`,
    extra: 'M72 128a34 32 0 1 0 68 0a34 32 0 1 0-68 0Z',
  },
  // Мужчина с бородой и короткой стрижкой
  beard: {
    body: `M0 400C20 350 60 318 112 304C118 290 118 278 114 268C100 250 88 225 88 190C88 126 124 74 176 72C218 70 240 98 238 132C236 142 237 152 242 166C246 176 254 190 258 200C258 206 250 210 243 211C249 222 248 238 242 252C236 266 224 276 208 280C200 282 194 280 190 278C188 294 194 304 208 314C244 328 282 344 300 366L300 400Z`,
  },
  // Женщина с длинными волосами, спадающими на плечи
  longhair: {
    body: `M10 400C26 356 62 330 112 318C120 300 120 288 116 276C102 256 92 230 92 196C92 134 128 86 174 84C214 82 236 110 236 140${FACE_UPPER}${LIPS_CHIN}C192 288 198 306 216 318C246 334 270 352 284 400Z`,
    extra: 'M176 80C122 76 80 120 82 190C84 250 62 310 44 370C40 384 40 400 40 400L150 400C136 360 124 316 124 276C124 244 120 222 112 204C108 150 132 104 176 80Z',
  },
  // Мужчина в очках, стрижка с объёмом
  glasses: {
    body: `M0 400C20 350 60 318 112 304C118 290 118 278 114 268C100 250 90 225 90 190C88 124 122 70 180 70C222 70 242 100 236 138${FACE_UPPER}${LIPS_CHIN}C190 284 194 300 208 310C244 326 282 342 300 364L300 400Z`,
  },
}

type Props = { variant: PersonVariant; className?: string }

export function Person({ variant, className = '' }: Props) {
  const id = useId().replace(/:/g, '')
  const shape = SHAPES[variant]
  const u = (n: string) => `url(#${n}-${id})`

  const outline = (
    <>
      {shape.extra && <path d={shape.extra} />}
      <path d={shape.body} />
    </>
  )

  return (
    <svg viewBox="0 0 300 400" className={className} aria-hidden preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id={`body-${id}`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor="#0E0A1F" />
          <stop offset="0.5" stopColor="#08060F" />
          <stop offset="1" stopColor="#030208" />
        </linearGradient>
        {/* Контровой свет: ярче у головы (там, где луна), гаснет к плечам */}
        <radialGradient id={`rim-${id}`} gradientUnits="userSpaceOnUse" cx="175" cy="165" r="230">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.45" stopColor="#E4DCFF" />
          <stop offset="0.75" stopColor="#9B7CFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`sheen-${id}`} gradientUnits="userSpaceOnUse" cx="230" cy="150" r="120">
          <stop offset="0" stopColor="#B9A6FF" stopOpacity="0.14" />
          <stop offset="1" stopColor="#B9A6FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`metal-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#C9BBFF" />
          <stop offset="1" stopColor="#5B47B8" />
        </linearGradient>
      </defs>

      {/* Мягкое свечение контура: несколько обводок вместо размытия */}
      <g fill="none" stroke={u('rim')} strokeLinejoin="round">
        <g strokeWidth="14" strokeOpacity="0.07">{outline}</g>
        <g strokeWidth="8" strokeOpacity="0.14">{outline}</g>
      </g>

      {/* Световая кромка рисуется ДО заливки и вдвое толще: заливка перекрывает внутреннюю
          половину и места стыка причёски с головой — остаётся только внешний контур */}
      <g fill="none" stroke={u('rim')} strokeWidth="3.6" strokeLinejoin="round">
        {outline}
      </g>

      {/* Сам силуэт */}
      <g fill={u('body')}>{outline}</g>
      <g fill={u('sheen')}>{outline}</g>

      {/* Детали */}
      {variant === 'bun' && (
        <>
          {/* ресницы */}
          <path d="M232 168c4 1 8 0 11-3" fill="none" stroke="#E4DCFF" strokeOpacity="0.7" strokeWidth="1.3" strokeLinecap="round" />
          {/* серьга-кольцо */}
          <ellipse cx="152" cy="222" rx="7" ry="11" fill="none" stroke={u('metal')} strokeWidth="2.4" />
        </>
      )}
      {variant === 'longhair' && (
        <>
          <path d="M232 168c4 1 8 0 11-3" fill="none" stroke="#E4DCFF" strokeOpacity="0.7" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="150" cy="214" r="3.2" fill={u('metal')} />
          {/* пряди волос ловят свет */}
          <path d="M150 96C118 112 102 150 104 200" fill="none" stroke="#B9A6FF" strokeOpacity="0.22" strokeWidth="1.2" />
          <path d="M136 92C104 110 92 150 94 214" fill="none" stroke="#B9A6FF" strokeOpacity="0.14" strokeWidth="1" />
        </>
      )}
      {variant === 'beard' && (
        <path d="M242 214C238 234 226 252 208 262" fill="none" stroke="#B9A6FF" strokeOpacity="0.25" strokeWidth="1.2" />
      )}
      {variant === 'glasses' && (
        <g fill="none" stroke={u('metal')} strokeLinecap="round">
          {/* дужка и линза */}
          <path d="M238 172L158 180" strokeWidth="2.2" />
          <path d="M236 160C250 160 252 184 238 186C232 186 230 162 236 160Z" strokeWidth="2" fill="#B9A6FF" fillOpacity="0.08" />
        </g>
      )}
    </svg>
  )
}
