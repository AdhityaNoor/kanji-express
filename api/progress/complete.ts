import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ObjectId } from 'mongodb'
import { users } from '../_lib/mongodb.js'
import { getUserId } from '../_lib/auth.js'
import { sendJson, methodNotAllowed, readBody, sendApiError } from '../_lib/http.js'
import { applyCompletion, toPublicUser } from '../_lib/user.js'

const LEVELS = ['STARTER', 'N5', 'N4', 'N3', 'N2', 'N1']
const SECTIONS = ['orientation', 'kana', 'phrases', 'sentences', 'study', 'overview', 'vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  const userId = getUserId(req)
  if (!userId) return sendJson(res, 401, { error: 'Not authenticated' })
  if (!ObjectId.isValid(userId)) return sendJson(res, 401, { error: 'Not authenticated' })

  const body = readBody(req)
  const level = String(body.level || '').toUpperCase()
  const section = String(body.section || '')
  const lessonIndex = Number(body.lessonIndex)
  const total = Number(body.total)
  const correct = Number(body.correct)

  if (!LEVELS.includes(level)) return sendJson(res, 400, { error: 'Invalid level.' })
  if (!SECTIONS.includes(section)) return sendJson(res, 400, { error: 'Invalid section.' })
  if (!Number.isInteger(lessonIndex) || lessonIndex < 0)
    return sendJson(res, 400, { error: 'Invalid lesson index.' })
  if (!Number.isFinite(total) || total <= 0 || total > 100)
    return sendJson(res, 400, { error: 'Invalid total.' })
  if (!Number.isFinite(correct) || correct < 0 || correct > total)
    return sendJson(res, 400, { error: 'Invalid correct count.' })

  try {
    const col = await users()
    const _id = new ObjectId(userId)
    const user = await col.findOne({ _id })
    if (!user) return sendJson(res, 404, { error: 'User not found' })

    const key = `${level}-${section}-${lessonIndex}`
    const nextProgress = applyCompletion(user.progress, key, correct, total)

    await col.updateOne({ _id }, { $set: { progress: nextProgress, updatedAt: new Date().toISOString() } })

    return sendJson(res, 200, {
      user: toPublicUser({ ...user, progress: nextProgress }),
      awarded: {
        key,
        xp: nextProgress.xp - user.progress.xp,
        streak: nextProgress.streak,
      },
    })
  } catch (err) {
    return sendApiError(res, 'progress', err)
  }
}
