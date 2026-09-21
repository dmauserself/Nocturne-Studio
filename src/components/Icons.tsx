type P = { className?: string }

export const ArrowUpRight = ({ className = 'h-4 w-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const ArrowLeft = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 12H5m6-6-6 6 6 6" />
  </svg>
)

export const ArrowRight = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
)

export const Plus = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Check = ({ className = 'h-6 w-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const QuoteMark = ({ className = 'h-10 w-10' }: P) => (
  <svg viewBox="0 0 48 48" className={className} fill="currentColor" aria-hidden>
    <path d="M8 36V24c0-8 4-13 12-15l1.6 3.4C17 14 15.6 17 15.6 21H21v15H8Zm19 0V24c0-8 4-13 12-15l1.6 3.4C36 14 34.6 17 34.6 21H40v15H27Z" />
  </svg>
)
