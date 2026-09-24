import { AnimatePresence, m as motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Logo } from '../components/Logo'
import { Moon } from '../components/Moon'
import { CONTACT, FOOTER, NAV_LEFT, NAV_RIGHT, A11Y } from '../content'
import { scrollToHash, startScroll, stopScroll } from '../lib/lenis'
import { EASE } from '../lib/motion'

const ALL = [...NAV_LEFT, ...NAV_RIGHT]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) stopScroll()
    else startScroll()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setOpen(false)
    // ждём закрытия меню, чтобы скролл не был заблокирован
    setTimeout(() => scrollToHash(href), open ? 350 : 0)
  }

  const linkCls =
    'relative text-[13px] font-medium uppercase tracking-[0.08em] text-moon/80 transition-colors hover:text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-lilac after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100'

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div
          className={`mx-auto flex h-16 max-w-site items-center justify-between rounded-full border px-5 transition-all duration-500 sm:h-[72px] sm:px-8 ${
            scrolled
              ? 'border-white/10 bg-night-900/95 shadow-[0_20px_60px_-30px_rgba(124,92,255,0.5)]'
              : 'border-transparent bg-transparent'
          }`}
        >
          <nav aria-label={A11Y.navLeft} className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-8 xl:gap-12">
              {NAV_LEFT.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => go(e, l.href)} className={linkCls}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a href="#top" onClick={(e) => go(e, '#top')} className="shrink-0 rounded-md" aria-label={A11Y.home}>
            <Logo />
          </a>

          <nav aria-label={A11Y.navRight} className="hidden flex-1 lg:block">
            <ul className="flex items-center justify-end gap-8 xl:gap-12">
              {NAV_RIGHT.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => go(e, l.href)} className={linkCls}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 lg:hidden"
            aria-label={open ? A11Y.menuClose : A11Y.menuOpen}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{A11Y.menu}</span>
            <span
              className={`absolute h-px w-5 bg-white transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-[4px]'}`}
            />
            <span
              className={`absolute h-px w-5 bg-white transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-[4px]'}`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={A11Y.menu}
            className="fixed inset-0 z-40 overflow-y-auto bg-night-950/[0.97] lg:hidden"
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)', transition: { duration: 0.8, ease: EASE } }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)', transition: { duration: 0.5, ease: EASE } }}
          >
            <div className="pointer-events-none absolute -right-24 top-10 w-72 opacity-70" aria-hidden>
              <Moon textured={false} />
            </div>
            <div className="glow left-[-20%] top-[40%] h-80 w-80 text-indigo" aria-hidden />
            <nav aria-label={A11Y.navMobile} className="relative flex min-h-full flex-col justify-between px-6 pb-10 pt-28">
              <ul className="space-y-1">
                {ALL.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.05, duration: 0.7, ease: EASE } }}
                  >
                    <a
                      href={l.href}
                      onClick={(e) => go(e, l.href)}
                      className="flex items-baseline gap-4 py-2 text-[clamp(2rem,9vw,3.2rem)] font-semibold uppercase leading-none tracking-tight text-white"
                    >
                      <span className="text-xs font-medium text-lilac">0{i + 1}</span>
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="mt-12 space-y-2 text-sm text-moon/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.6 } }}
              >
                <a href={`mailto:${FOOTER.email}`} className="block text-white">
                  {FOOTER.email}
                </a>
                <a href={`tel:${FOOTER.phoneHref}`} className="block">
                  {FOOTER.phone}
                </a>
                <p className="pt-4 text-xs text-moon/50">{CONTACT.text}</p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
