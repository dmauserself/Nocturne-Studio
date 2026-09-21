/**
 * Netlify: /api/lead — принимает заявку и пересылает её в Telegram (логика в api/_lead-core.ts).
 * Переменные окружения задаются в Netlify → Site configuration → Environment variables.
 */
import { processLead } from '../../api/_lead-core'

declare const process: { env: Record<string, string | undefined> }

export default async (req: Request) => {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
      status: 405,
      headers: { ...headers, Allow: 'POST' },
    })
  }
  const result = await processLead(await req.text(), process.env)
  return new Response(JSON.stringify(result.data), { status: result.status, headers })
}

// Функция отвечает по тому же адресу, что и на Vercel, — сайту не нужно знать, где он размещён
export const config = { path: '/api/lead' }
