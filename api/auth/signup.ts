import type { VercelRequest, VercelResponse } from '@vercel/node'
import { users } from '../_lib/mongodb.js'
import { hashPassword, signToken, setAuthCookie } from '../_lib/auth.js'
import {
  sendJson,
  methodNotAllowed,
  readBody,
  validateEmail,
  validatePassword,
  validateName,
  sendApiError,
} from '../_lib/http.js'
import { defaultProgress, defaultAvatar, toPublicUser, type UserDoc } from '../_lib/user.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  const body = readBody(req)
  const name = validateName(body.name)
  const email = validateEmail(body.email)
  const password = validatePassword(body.password)

  if (!name) return sendJson(res, 400, { error: 'Please enter your name.' })
  if (!email) return sendJson(res, 400, { error: 'Please enter a valid email address.' })
  if (!password) return sendJson(res, 400, { error: 'Password must be at least 8 characters.' })

  try {
    const col = await users()
    const existing = await col.findOne({ email })
    if (existing) return sendJson(res, 409, { error: 'An account with that email already exists.' })

    const now = new Date().toISOString()
    const doc: UserDoc = {
      name,
      email,
      passwordHash: await hashPassword(password),
      avatar: defaultAvatar(name),
      jlptTarget: 'N5',
      progress: defaultProgress(),
      createdAt: now,
      updatedAt: now,
    }

    const result = await col.insertOne(doc)
    doc._id = result.insertedId

    setAuthCookie(res, signToken(String(result.insertedId)))
    return sendJson(res, 201, { user: toPublicUser(doc) })
  } catch (err) {
    // Unique-index race → duplicate email
    if (err && typeof err === 'object' && 'code' in err && (err as { code?: number }).code === 11000) {
      return sendJson(res, 409, { error: 'An account with that email already exists.' })
    }
    return sendApiError(res, 'signup', err)
  }
}
