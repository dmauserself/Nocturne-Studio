import { MeshGradient } from './MeshGradient'
import { Orb, type OrbVariant } from './Orb'
import { Person, type PersonVariant } from './Person'

type Tone = 'violet' | 'indigo' | 'ice' | 'purple'

const TONES: Record<Tone, [string, string, string]> = {
  violet: ['#7C5CFF', '#2A1B5E', '#B9A6FF'],
  indigo: ['#2A1B5E', '#0F0A1E', '#7C5CFF'],
  ice: ['#8FB4FF', '#2A1B5E', '#7C5CFF'],
  purple: ['#9B5CFF', '#2A1B5E', '#B9A6FF'],
}

type Props = {
  /**
   * ЗАМЕНА НА ФОТО: передайте путь к изображению, например
   *   <Portrait src="/images/team/alisa.jpg" alt="Алиса Воронцова" />
   * Файлы кладите в public/images/. Лучше всего подходят тёмные портреты
   * с фиолетовым контровым светом, вертикальные, от 900×1200 px.
   */
  src?: string
  alt?: string
  tone?: Tone
  /** Небесный объект, который показывается, пока нет фото */
  art?: OrbVariant
  /** Силуэт человека перед небесным объектом (для карточек команды) */
  person?: PersonVariant
  className?: string
}

export function Portrait({ src, alt = '', tone = 'violet', art = 'crescent', person, className = '' }: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
    )
  }

  // Пока нет фото: градиентный фон + небесный объект (без тяжёлых фильтров)
  return (
    <div className={`relative overflow-hidden ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
      <MeshGradient colors={TONES[tone]} />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(70% 55% at 50% 40%, rgba(237,233,255,0.16), transparent 70%)' }}
        aria-hidden
      />
      {person ? (
        <>
          {/* Луна точно за головой силуэта */}
          <Orb variant={art} className="absolute left-[-12%] top-[-4%] w-[134%] max-w-none" />
          <Person variant={person} className="absolute inset-x-0 bottom-0 h-auto w-full" />
        </>
      ) : (
        <Orb variant={art} className="absolute left-1/2 top-1/2 w-[82%] -translate-x-1/2 -translate-y-1/2" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden />
    </div>
  )
}
