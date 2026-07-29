import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ObjectId } from 'mongodb'
import { users } from '../_lib/mongodb.js'
import { getUserId } from '../_lib/auth.js'
import { sendJson, methodNotAllowed, sendApiError } from '../_lib/http.js'
import { toPublicUser } from '../_lib/user.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  const userId = getUserId(req)
  if (!userId) return sendJson(res, 401, { error: 'Not authenticated' })
  if (!ObjectId.isValid(userId)) return sendJson(res, 401, { error: 'Not authenticated' })

  try {
    const col = await users()
    const user = await col.findOne({ _id: new ObjectId(userId) })
    if (!user) return sendJson(res, 401, { error: 'Not authenticated' })
    return sendJson(res, 200, { user: toPublicUser(user) })
  } catch (err) {
    return sendApiError(res, 'me', err)
  }
}
