import { useId } from 'react'

type Props = {
  className?: string
  /** Фактура поверхности через feTurbulence. На телефонах лучше отключать. */
  textured?: boolean
  /** Ореол вокруг луны */
  halo?: boolean
}

const CRATERS: [number, number, number][] = [
  [128, 118, 22],
  [182, 92, 11],
  [96, 176, 14],
  [150, 186, 30],
  [214, 150, 16],
  [196, 226, 12],
  [112, 244, 18],
  [244, 208, 9],
  [70, 132, 8],
  [236, 110, 7],
  [168, 262, 9],
  [84, 212, 6],
]

/** Большая светящаяся луна: сфера из градиентов, кратеры и мягкий ореол */
export function Moon({ className = '', textured = true, halo = true }: Props) {
  const id = useId().replace(/:/g, '')
  return (
    <div className={`relative aspect-square ${className}`} aria-hidden>
      {halo && (
        <>
          <div
            className="absolute inset-[-35%] animate-breathe-slow rounded-full"
            style={{
              background:
                'radial-gradient(closest-side, rgba(185,166,255,0.38), rgba(124,92,255,0.16) 45%, rgba(42,27,94,0.08) 70%, transparent)',
            }}
          />
          <div
            className="absolute inset-[-8%] rounded-full"
            style={{
              background: 'radial-gradient(closest-side, rgba(237,233,255,0.3), rgba(185,166,255,0.12) 60%, transparent)',
            }}
          />
        </>
      )}
      <svg viewBox="0 0 320 320" className="relative h-full w-full">
        <defs>
          <radialGradient id={`body-${id}`} cx="38%" cy="34%" r="72%">
            <stop offset="0" stopColor="#FBFAFF" />
            <stop offset="0.35" stopColor="#DCD3FF" />
            <stop offset="0.7" stopColor="#9C88F0" />
            <stop offset="1" stopColor="#3A2A7A" />
          </radialGradient>
          <radialGradient id={`shade-${id}`} cx="85%" cy="88%" r="75%">
            <stop offset="0" stopColor="#05030A" stopOpacity="0.85" />
            <stop offset="0.45" stopColor="#2A1B5E" stopOpacity="0.35" />
            <stop offset="1" stopColor="#2A1B5E" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`crater-${id}`} cx="58%" cy="60%" r="60%">
            <stop offset="0" stopColor="#5A46B3" stopOpacity="0.32" />
            <stop offset="0.75" stopColor="#7C66D9" stopOpacity="0.14" />
            <stop offset="0.92" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`clip-${id}`}>
            <circle cx="160" cy="160" r="150" />
          </clipPath>
          {textured && (
            <filter id={`tex-${id}`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="7" />
              <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.5  0 0 0 1.4 -0.55" />
            </filter>
          )}
        </defs>

        <circle cx="160" cy="160" r="150" fill={`url(#body-${id})`} />
        <g clipPath={`url(#clip-${id})`}>
          {textured && <rect width="320" height="320" filter={`url(#tex-${id})`} opacity="0.55" />}
          {/* «Моря» — крупные тёмные пятна */}
          <ellipse cx="190" cy="130" rx="54" ry="40" fill="#6E5BC9" opacity="0.28" />
          <ellipse cx="120" cy="210" rx="46" ry="34" fill="#6E5BC9" opacity="0.22" />
          <ellipse cx="220" cy="220" rx="36" ry="28" fill="#5A46B3" opacity="0.25" />
          {CRATERS.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#crater-${id})`} />
          ))}
          <circle cx="160" cy="160" r="150" fill={`url(#shade-${id})`} />
        </g>
        {/* Тонкий светящийся край */}
        <circle cx="160" cy="160" r="149.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      </svg>
    </div>
  )
}

/** Фазы луны — декоративная строка из восьми фаз */
export function MoonPhases({ className = '', active = -1 }: { className?: string; active?: number }) {
  const phases = [0, 0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25]
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden>
      {phases.map((p, i) => (
        <MoonPhase key={i} phase={p} waxing={i < 4} active={i === active} />
      ))}
    </div>
  )
}

export function MoonPhase({
  phase,
  waxing = true,
  active = false,
  size = 18,
}: {
  phase: number
  waxing?: boolean
  active?: boolean
  size?: number
}) {
  // phase: 0 — новолуние, 1 — полнолуние
  const shift = (1 - phase) * 24 * (waxing ? -1 : 1)
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <mask id={`p-${id}`}>
          <circle cx="12" cy="12" r="10" fill="#fff" />
          {phase < 1 && <circle cx={12 + shift} cy="12" r="10" fill="#000" />}
        </mask>
      </defs>
      <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(237,233,255,0.25)" strokeWidth="1" />
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={active ? '#EDE9FF' : '#B9A6FF'}
        opacity={active ? 1 : 0.7}
        mask={`url(#p-${id})`}
      />
    </svg>
  )
}
