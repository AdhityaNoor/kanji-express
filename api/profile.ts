import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ObjectId } from 'mongodb'
import { users } from './_lib/mongodb'
import { getUserId } from './_lib/auth'
import { sendJson, methodNotAllowed, readBody, validateName, JLPT_LEVELS } from './_lib/http'
import { toPublicUser } from './_lib/user'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req)
  if (!userId) return sendJson(res, 401, { error: 'Not authenticated' })

  const col = await users()
  const _id = new ObjectId(userId)

  if (req.method === 'GET') {
    const user = await col.findOne({ _id })
    if (!user) return sendJson(res, 404, { error: 'User not found' })
    return sendJson(res, 200, { user: toPublicUser(user) })
  }

  if (req.method === 'PATCH') {
    const body = readBody(req)
    const update: Record<string, unknown> = { updatedAt: new Date().toISOString() }

    if ('name' in body) {
      const name = validateName(body.name)
      if (!name) return sendJson(res, 400, { error: 'Please enter a valid name.' })
      update.name = name
    }
    if ('jlptTarget' in body) {
      const t = body.jlptTarget
      if (typeof t !== 'string' || !JLPT_LEVELS.includes(t as (typeof JLPT_LEVELS)[number])) {
        return sendJson(res, 400, { error: 'Invalid JLPT target.' })
      }
      update.jlptTarget = t
    }

    const result = await col.findOneAndUpdate({ _id }, { $set: update }, { returnDocument: 'after' })
    const user = result as unknown as import('./_lib/user').UserDoc | null
    if (!user) return sendJson(res, 404, { error: 'User not found' })
    return sendJson(res, 200, { user: toPublicUser(user) })
  }

  return methodNotAllowed(res, ['GET', 'PATCH'])
}
