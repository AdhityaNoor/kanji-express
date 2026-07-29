import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const secret = process.env.JWT_SECRET
const COOKIE = 'ke_token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret(): string {
  if (!secret) throw new Error('JWT_SECRET is not set')
  return secret
}

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 12)
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash)
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, getSecret(), { expiresIn: MAX_AGE })
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, getSecret()) as { sub?: string }
    return decoded.sub ?? null
  } catch {
    return null
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const k = part.slice(0, idx).trim()
    const v = part.slice(idx + 1).trim()
    if (k) out[k] = decodeURIComponent(v)
  }
  return out
}

/** Read and verify the auth cookie; returns the userId or null. */
export function getUserId(req: VercelRequest): string | null {
  const cookies = parseCookies(req.headers.cookie)
  const token = cookies[COOKIE]
  if (!token) return null
  return verifyToken(token)
}

export function setAuthCookie(res: VercelResponse, token: string): void {
  const prod = process.env.NODE_ENV === 'production'
  const parts = [
    `${COOKIE}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE}`,
  ]
  if (prod) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}

export function clearAuthCookie(res: VercelResponse): void {
  const prod = process.env.NODE_ENV === 'production'
  const parts = [`${COOKIE}=`, 'HttpOnly', 'Path=/', 'SameSite=Lax', 'Max-Age=0']
  if (prod) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}
