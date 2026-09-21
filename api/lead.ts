/**
 * Vercel: /api/lead — принимает заявку и пересылает её в Telegram (логика в _lead-core.ts).
 * Переменные окружения задаются в Vercel → Project → Settings → Environment Variables.
 */
import { processLead } from './_lead-core'

declare const process: { env: Record<string, string | undefined> }

type Req = { method?: string; body?: unknown }
type Res = {
  status: (code: number) => Res
  json: (data: unknown) => void
  setHeader: (name: string, value: string) => void
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }
  const result = await processLead(req.body, process.env)
  return res.status(result.status).json(result.data)
}
