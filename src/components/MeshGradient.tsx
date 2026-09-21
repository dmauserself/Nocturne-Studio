type Props = {
  colors?: [string, string, string]
  className?: string
  /** Медленное «дыхание» пятен (в Safari выключено) */
  animated?: boolean
}

/** Абстрактный «меш»-градиент для карточек и кейсов */
export function MeshGradient({
  colors = ['#7C5CFF', '#2A1B5E', '#B9A6FF'],
  className = '',
  animated = false,
}: Props) {
  const [a, b, c] = colors
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0" style={{ background: '#0A0714' }} />
      <div
        className={`absolute inset-[-20%] ${animated ? 'animate-breathe-slow' : ''}`}
        style={{
          background: `
            radial-gradient(40% 45% at 22% 28%, ${a} 0%, transparent 70%),
            radial-gradient(45% 50% at 78% 72%, ${c}cc 0%, transparent 70%),
            radial-gradient(60% 60% at 60% 20%, ${b} 0%, transparent 75%),
            radial-gradient(35% 35% at 30% 85%, ${a}99 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}
