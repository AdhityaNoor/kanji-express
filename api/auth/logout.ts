import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clearAuthCookie } from '../_lib/auth'
import { sendJson, methodNotAllowed } from '../_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  clearAuthCookie(res)
  return sendJson(res, 200, { ok: true })
}
