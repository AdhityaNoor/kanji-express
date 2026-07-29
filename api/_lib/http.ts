import type { VercelRequest, VercelResponse } from '@vercel/node'

type ErrorLike = {
  name?: unknown
  message?: unknown
}

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

function errorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return ''
  const message = (err as ErrorLike).message
  return typeof message === 'string' ? message : ''
}

function errorName(err: unknown): string {
  if (!err || typeof err !== 'object') return ''
  const name = (err as ErrorLike).name
  return typeof name === 'string' ? name : ''
}

export function sendApiError(res: VercelResponse, context: string, err: unknown): void {
  console.error(`${context} error`, err)

  const message = errorMessage(err)
  const name = errorName(err)

  if (message === 'MONGODB_URI is not set') {
    sendJson(res, 503, { error: 'Database is not configured.' })
    return
  }

  if (message === 'JWT_SECRET is not set') {
    sendJson(res, 503, { error: 'Authentication is not configured.' })
    return
  }

  if (name === 'MongoServerSelectionError' || name === 'MongoNetworkError') {
    sendJson(res, 503, { error: 'Database is unavailable.' })
    return
  }

  sendJson(res, 500, { error: 'Something went wrong. Please try again.' })
}
