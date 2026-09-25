import { CONTACT, DEMO_MODE } from '../content'

export type Lead = {
  name: string
  contact: string
  task: string
  budget: string
}

/**
 * Отправка заявки на серверную функцию /api/lead (файл api/lead.ts),
 * которая пересылает её в Telegram. Работает после публикации на Vercel.
 *
 * При локальной разработке (npm run dev) функции нет — заявка только выводится в консоль,
 * чтобы можно было проверить форму без публикации.
 */
export async function submitLead(lead: Lead, honeypot = ''): Promise<void> {
  // Демо-режим и локальная разработка: заявка никуда не уходит
  if (DEMO_MODE || import.meta.env.DEV) {
    await new Promise((r) => setTimeout(r, 800))
    if (import.meta.env.DEV) console.info('[submitLead] demo/dev mode, request not sent:', lead)
    return
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, website: honeypot, page: document.title }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`lead_failed_${res.status}`)
  } finally {
    clearTimeout(timer)
  }
}

export function validateLead(lead: Lead) {
  const errors: Partial<Record<keyof Lead, string>> = {}
  if (lead.name.trim().length < 2) errors.name = CONTACT.errors.name

  const c = lead.contact.trim()
  const digits = c.replace(/\D/g, '')
  const isPhone = /^[+\d\s().-]+$/.test(c) && digits.length >= 7 && digits.length <= 15
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c)
  const isTelegram = /^@[a-zA-Z0-9_]{5,32}$/.test(c) || /^(https?:\/\/)?t\.me\/[a-zA-Z0-9_]{5,32}$/.test(c)
  if (!isPhone && !isEmail && !isTelegram) errors.contact = CONTACT.errors.contact

  if (lead.task.trim().length < 10) errors.task = CONTACT.errors.task
  if (!lead.budget) errors.budget = CONTACT.errors.budget
  return errors
}
