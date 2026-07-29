import type { VercelRequest, VercelResponse } from '@vercel/node'

export function sendJson(res: VercelResponse, status: number, body: unknown): void {
  res.status(status).json(body)
}

export function methodNotAllowed(res: VercelResponse, allow: string[]): void {
  res.setHeader('Allow', allow.join(', '))
  sendJson(res, 405, { error: 'Method not allowed' })
}

/** Vercel parses JSON bodies automatically; fall back to manual parse if not. */
export function readBody(req: VercelRequest): Record<string, unknown> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>
  if (typeof req.body === 'string' && req.body.length) {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return {}
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null
  const e = email.trim().toLowerCase()
  return EMAIL_RE.test(e) ? e : null
}

export function validatePassword(pw: unknown): string | null {
  if (typeof pw !== 'string' || pw.length < 8 || pw.length > 200) return null
  return pw
}

export function validateName(name: unknown): string | null {
  if (typeof name !== 'string') return null
  const n = name.trim()
  return n.length >= 1 && n.length <= 60 ? n : null
}

export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const
