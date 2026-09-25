/**
 * Общая логика приёма заявки: проверка, защита от спама и отправка в Telegram.
 * Используется и на Netlify (netlify/functions/lead.ts), и на Vercel (api/lead.ts).
 * Файл начинается с «_», поэтому Vercel не публикует его как отдельную функцию.
 *
 * Переменные окружения:
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   — id чата/группы для заявок (можно несколько через запятую)
 */

export type Env = Record<string, string | undefined>
export type LeadResult = { status: number; data: { ok: boolean; error?: string } }

const LIMITS = { name: 80, contact: 80, task: 2000, budget: 60 }

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function field(body: Record<string, unknown>, key: keyof typeof LIMITS) {
  const v = body[key]
  return typeof v === 'string' ? v.trim().slice(0, LIMITS[key]) : ''
}

export async function processLead(rawBody: unknown, env: Env): Promise<LeadResult> {
  const token = env.TELEGRAM_BOT_TOKEN
  const chats = (env.TELEGRAM_CHAT_ID ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!token || chats.length === 0) {
    console.error('[lead] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы')
    return { status: 500, data: { ok: false, error: 'not_configured' } }
  }

  let body: Record<string, unknown>
  try {
    body = typeof rawBody === 'string' ? JSON.parse(rawBody) : ((rawBody as Record<string, unknown>) ?? {})
  } catch {
    return { status: 400, data: { ok: false, error: 'bad_json' } }
  }
  if (!body || typeof body !== 'object') return { status: 400, data: { ok: false, error: 'bad_json' } }

  // Ловушка для ботов: скрытое поле, которое человек не заполняет. Боту отвечаем «успехом» и ничего не шлём.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return { status: 200, data: { ok: true } }
  }

  const lead = {
    name: field(body, 'name'),
    contact: field(body, 'contact'),
    task: field(body, 'task'),
    budget: field(body, 'budget'),
  }
  if (lead.name.length < 2 || lead.contact.length < 5 || lead.task.length < 10) {
    return { status: 422, data: { ok: false, error: 'invalid' } }
  }

  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : ''
  const text = [
    '🌙 <b>Новая заявка с сайта</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Контакт:</b> ${escapeHtml(lead.contact)}`,
    `<b>Бюджет:</b> ${escapeHtml(lead.budget || '—')}`,
    '',
    `<b>Задача:</b>\n${escapeHtml(lead.task)}`,
    page ? `\n<i>${escapeHtml(page)}</i>` : '',
  ].join('\n')

  try {
    const results = await Promise.all(
      chats.map((chat_id) =>
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true }),
        }),
      ),
    )
    if (results.some((r) => !r.ok)) {
      console.error('[lead] Telegram ответил ошибкой', await Promise.all(results.map((r) => r.text())))
      return { status: 502, data: { ok: false, error: 'telegram_failed' } }
    }
    return { status: 200, data: { ok: true } }
  } catch (err) {
    console.error('[lead] не удалось отправить в Telegram', err)
    return { status: 502, data: { ok: false, error: 'telegram_unreachable' } }
  }
}
