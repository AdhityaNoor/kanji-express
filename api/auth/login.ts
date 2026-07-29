import type { VercelRequest, VercelResponse } from '@vercel/node'
import { users } from '../_lib/mongodb.js'
import { verifyPassword, signToken, setAuthCookie } from '../_lib/auth.js'
import { sendJson, methodNotAllowed, readBody, validateEmail, sendApiError } from '../_lib/http.js'
import { toPublicUser } from '../_lib/user.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  const body = readBody(req)
  const email = validateEmail(body.email)
  const password = typeof body.password === 'string' ? body.password : ''

  // Generic message so we don't reveal whether the email exists.
  const invalid = () => sendJson(res, 401, { error: 'Invalid email or password.' })

  if (!email || !password) return invalid()

  try {
    const col = await users()
    const user = await col.findOne({ email })
    if (!user) return invalid()

    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) return invalid()

    setAuthCookie(res, signToken(String(user._id)))
    return sendJson(res, 200, { user: toPublicUser(user) })
  } catch (err) {
    return sendApiError(res, 'login', err)
  }
}
