import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ObjectId } from 'mongodb'
import { users } from '../_lib/mongodb'
import { getUserId } from '../_lib/auth'
import { sendJson, methodNotAllowed } from '../_lib/http'
import { toPublicUser } from '../_lib/user'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  const userId = getUserId(req)
  if (!userId) return sendJson(res, 401, { error: 'Not authenticated' })

  try {
    const col = await users()
    const user = await col.findOne({ _id: new ObjectId(userId) })
    if (!user) return sendJson(res, 401, { error: 'Not authenticated' })
    return sendJson(res, 200, { user: toPublicUser(user) })
  } catch (err) {
    console.error('me error', err)
    return sendJson(res, 500, { error: 'Something went wrong.' })
  }
}
