import { AnimatePresence, m as motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowUpRight, Check } from '../components/Icons'
import { Magnetic } from '../components/MagneticButton'
import { Moon } from '../components/Moon'
import { LineReveal, Reveal } from '../components/Reveal'
import { CONTACT, DEMO, DEMO_MODE, FOOTER, A11Y } from '../content'
import { EASE } from '../lib/motion'
import { reachGoal } from '../lib/analytics'
import { submitLead, validateLead, type Lead } from '../lib/submitLead'

const EMPTY: Lead = { name: '', contact: '', task: '', budget: '' }

export function Contact() {
  const [lead, setLead] = useState<Lead>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [sendError, setSendError] = useState(false)
  // Ловушка для спам-ботов: скрытое поле, человек его не видит и не заполняет
  const [honeypot, setHoneypot] = useState('')

  const update = (key: keyof Lead, value: string) => {
    const next = { ...lead, [key]: value }
    setLead(next)
    if (touched) setErrors(validateLead(next))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const errs = validateLead(lead)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`lead-${first}`)?.focus()
      return
    }
    setStatus('sending')
    setSendError(false)
    try {
      await submitLead(lead, honeypot)
      reachGoal('lead')
      setStatus('done')
    } catch {
      setSendError(true)
      setStatus('idle')
    }
  }

  const reset = () => {
    setLead(EMPTY)
    setErrors({})
    setTouched(false)
    setSendError(false)
    setStatus('idle')
  }

  const err = (key: keyof Lead) =>
    errors[key] ? (
      <p id={`lead-${key}-err`} className="mt-2 text-[13px] text-[#ffb3cf]">
        {errors[key]}
      </p>
    ) : null

  return (
    <section id="contact" aria-label={A11Y.contact} className="relative px-2 sm:px-3">
      <div className="window section bg-night-950">
        <div aria-hidden className="window-bg">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(55% 60% at 15% 100%, rgba(124,92,255,0.45), rgba(42,27,94,0.4) 40%, transparent 75%)',
            }}
          />
          <div className="absolute -left-[14%] bottom-[-52%] w-[min(80vw,820px)] opacity-50">
            <Moon textured={false} />
          </div>
        </div>

        <div className="container-site relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6">{CONTACT.eyebrow}</p>
            </Reveal>
            <LineReveal lines={CONTACT.titleLines} className="h-display" />
            <Reveal delay={2} className="mt-8 max-w-md">
              <p className="lead">{CONTACT.text}</p>
            </Reveal>
            <Reveal delay={3} className="mt-10 space-y-2 text-lg">
              <a href={`mailto:${FOOTER.email}`} className="block font-medium text-white transition-colors hover:text-lilac">
                {FOOTER.email}
              </a>
              <a href={`tel:${FOOTER.phoneHref}`} className="block text-moon/80 transition-colors hover:text-white">
                {FOOTER.phone}
              </a>
            </Reveal>
          </div>

          <Reveal delay={1} className="lg:col-span-6 lg:col-start-7">
            <div className="glass relative overflow-hidden p-6 sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                {status === 'done' ? (
                  <motion.div
                    key="done"
                    className="flex min-h-[520px] flex-col items-center justify-center text-center"
                    initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    role="status"
                  >
                    <div className="relative mb-8 grid h-24 w-24 place-items-center">
                      <span className="absolute -inset-4 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.55),transparent)]" aria-hidden />
                      <motion.span
                        className="relative grid h-20 w-20 place-items-center rounded-full bg-moon text-night-950"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
                      >
                        <Check className="h-8 w-8" />
                      </motion.span>
                    </div>
                    <h3 className="text-3xl font-semibold">{DEMO_MODE ? DEMO.successTitle : CONTACT.successTitle}</h3>
                    <p className="lead mt-4 max-w-sm">{DEMO_MODE ? DEMO.successText : CONTACT.successText}</p>
                    <button type="button" onClick={reset} className="btn-ghost mt-10">
                      {CONTACT.successReset}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={onSubmit}
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: 'blur(6px)' }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
                      <label>
                        {A11Y.honeypot}
                        <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" />
                      </label>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="lead-name" className="mb-2 block text-sm text-moon/80">
                          {CONTACT.fields.name}
                        </label>
                        <input
                          id="lead-name"
                          className="field"
                          autoComplete="name"
                          placeholder={CONTACT.placeholders.name}
                          value={lead.name}
                          onChange={(e) => update('name', e.target.value)}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'lead-name-err' : undefined}
                        />
                        {err('name')}
                      </div>
                      <div>
                        <label htmlFor="lead-contact" className="mb-2 block text-sm text-moon/80">
                          {CONTACT.fields.contact}
                        </label>
                        <input
                          id="lead-contact"
                          className="field"
                          autoComplete="email"
                          inputMode="email"
                          placeholder={CONTACT.placeholders.contact}
                          value={lead.contact}
                          onChange={(e) => update('contact', e.target.value)}
                          aria-invalid={!!errors.contact}
                          aria-describedby={errors.contact ? 'lead-contact-err' : undefined}
                        />
                        {err('contact')}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lead-task" className="mb-2 block text-sm text-moon/80">
                        {CONTACT.fields.task}
                      </label>
                      <textarea
                        id="lead-task"
                        rows={4}
                        className="field resize-none"
                        placeholder={CONTACT.placeholders.task}
                        value={lead.task}
                        onChange={(e) => update('task', e.target.value)}
                        aria-invalid={!!errors.task}
                        aria-describedby={errors.task ? 'lead-task-err' : undefined}
                      />
                      {err('task')}
                    </div>

                    <fieldset aria-describedby={errors.budget ? 'lead-budget-err' : undefined}>
                      <legend className="mb-3 text-sm text-moon/80">{CONTACT.fields.budget}</legend>
                      <div className="flex flex-wrap gap-2">
                        {CONTACT.budgets.map((b, i) => {
                          const checked = lead.budget === b
                          return (
                            <label
                              key={b}
                              className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-lilac ${
                                checked
                                  ? 'border-transparent bg-violet text-white shadow-[0_8px_30px_-8px_rgba(124,92,255,0.9)]'
                                  : 'border-white/15 text-moon/80 hover:border-lilac/50 hover:text-white'
                              }`}
                            >
                              <input
                                id={i === 0 ? 'lead-budget' : undefined}
                                type="radio"
                                name="budget"
                                value={b}
                                checked={checked}
                                onChange={() => update('budget', b)}
                                className="sr-only"
                              />
                              {b}
                            </label>
                          )
                        })}
                      </div>
                      {err('budget')}
                    </fieldset>

                    {sendError && (
                      <p role="alert" className="rounded-2xl border border-[#ffb3cf]/30 bg-[#ffb3cf]/10 px-4 py-3 text-sm text-[#ffd6e5]">
                        {CONTACT.error}{' '}
                        <a href={`mailto:${FOOTER.email}`} className="underline">{FOOTER.email}</a>
                      </p>
                    )}

                    <div className="flex flex-col gap-5 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <Magnetic>
                        <button type="submit" className="btn-primary disabled:opacity-70" disabled={status === 'sending'}>
                          {status === 'sending' ? CONTACT.sending : CONTACT.submit}
                          <span className="btn-dot">
                            {status === 'sending' ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
                            ) : (
                              <ArrowUpRight />
                            )}
                          </span>
                        </button>
                      </Magnetic>
                      <p className="max-w-[16rem] text-xs leading-relaxed text-moon/50">
                        {CONTACT.privacy}{' '}
                        <a href="/privacy.html" target="_blank" rel="noopener" className="underline decoration-moon/30 underline-offset-2 hover:text-moon">
                          {CONTACT.privacyLink}
                        </a>
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
