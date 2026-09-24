import { useEffect, useState } from 'react'
import { RESPECT_REDUCED_MOTION } from './browser'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** Десктоп с точным указателем: курсорные эффекты включаются только здесь */
export function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
}

/** Учитывает «Уменьшить движение» только если это включено в lib/browser.ts (RESPECT_REDUCED_MOTION) */
export function usePrefersReducedMotion() {
  const matches = useMediaQuery('(prefers-reduced-motion: reduce)')
  return RESPECT_REDUCED_MOTION && matches
}
