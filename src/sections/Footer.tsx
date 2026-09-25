import { FitText } from '../components/FitText'
import { ArrowUpRight } from '../components/Icons'
import { Logo } from '../components/Logo'
import { MoonO } from '../components/MoonO'
import { BRAND, DEMO, DEMO_MODE, FOOTER, NAV_LEFT, NAV_RIGHT, A11Y, CONTACT } from '../content'

export function Footer() {
  return (
    <footer className="relative overflow-clip px-2 pb-2 pt-[var(--section-y)] sm:px-3 sm:pb-3">
      <div className="container-site relative z-10">
        <div className="grid gap-12 border-t border-line pt-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo className="scale-110 origin-left" />
            <p className="mt-6 max-w-xs text-sm leading-[1.6] text-body">{BRAND.tagline}.</p>
          </div>

          <nav aria-label={A11Y.navFooter} className="md:col-span-3">
            <p className="mb-5 text-xs uppercase tracking-[0.2em] text-lilac">{FOOTER.headings.nav}</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[...NAV_LEFT, ...NAV_RIGHT].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-moon/80 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="mb-5 text-xs uppercase tracking-[0.2em] text-lilac">{FOOTER.headings.contact}</p>
            <address className="space-y-3 text-sm not-italic">
              <a href={`mailto:${FOOTER.email}`} className="block text-white hover:text-lilac">
                {FOOTER.email}
              </a>
              <a href={`tel:${FOOTER.phoneHref}`} className="block text-moon/80 hover:text-white">
                {FOOTER.phone}
              </a>
              <p className="text-moon/60">{FOOTER.address}</p>
            </address>
          </div>

          <div className="md:col-span-2">
            <p className="mb-5 text-xs uppercase tracking-[0.2em] text-lilac">{FOOTER.headings.social}</p>
            <ul className="space-y-3 text-sm">
              {FOOTER.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-moon/80 hover:text-white">
                    {s.label}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 text-xs text-moon/50 md:flex-row md:justify-between">
          <p>
            {FOOTER.copyright}{" "}
            <a href={CONTACT.privacyHref} className="underline decoration-moon/30 underline-offset-2 hover:text-moon">
              {CONTACT.privacyLink}
            </a>
          </p>
          <div className="max-w-xl space-y-1 md:text-right">
            {DEMO_MODE && <p className="text-lilac/80">{DEMO.footerNote}</p>}
            {FOOTER.disclaimer && <p>{FOOTER.disclaimer}</p>}
          </div>
        </div>
      </div>

      {/* Огромный полупрозрачный NOCTURNE на фоне */}
      <div className="container-site relative mt-10 select-none" aria-hidden>
        <FitText className="font-bold uppercase tracking-[-0.03em]">
          <span
            className="bg-gradient-to-b from-lilac/45 via-violet/20 to-transparent bg-clip-text text-transparent"
          >
            N<MoonO className="mx-[0.02em] text-lilac/35" />CTURNE
          </span>
        </FitText>
      </div>
      <div aria-hidden className="glow bottom-[-20%] left-1/4 h-[30vw] w-[50vw] text-indigo/60" />
    </footer>
  )
}
