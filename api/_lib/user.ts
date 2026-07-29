import type { ObjectId } from 'mongodb'

export interface LessonRecord {
  correct: number
  total: number
  xp: number
  at: string // ISO date
}

export interface Progress {
  xp: number
  coins: number
  streak: number
  longestStreak: number
  lastStudyDate: string | null // 'YYYY-MM-DD' (UTC)
  studyDays: string[] // unique 'YYYY-MM-DD'
  completedLessons: Record<string, LessonRecord> // key: `${level}-${section}-${index}`
}

export interface UserDoc {
  _id?: ObjectId
  name: string
  email: string
  passwordHash: string
  avatar?: string
  jlptTarget: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  progress: Progress
  createdAt: string
  updatedAt: string
}

/** Public shape returned to the client — never includes the password hash. */
export interface PublicUser {
  id: string
  name: string
  email: string
  avatar: string
  jlptTarget: UserDoc['jlptTarget']
  createdAt: string
  progress: Progress & { level: number; completedLessonCount: number }
}

export function defaultProgress(): Progress {
  return {
    xp: 0,
    coins: 0,
    streak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    studyDays: [],
    completedLessons: {},
  }
}

/** Level curve: every 500 XP is a level. Cheap and monotonic; tune later. */
export function levelForXp(xp: number): number {
  return Math.floor(xp / 500) + 1
}

export function defaultAvatar(name: string): string {
  const letter = (name.trim()[0] || 'A').toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3355ff"/><stop offset="1" stop-color="#ff6b9d"/></linearGradient></defs><rect width="64" height="64" fill="url(#a)"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-size="28" font-weight="700" fill="white">${letter}</text></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

export function toPublicUser(doc: UserDoc): PublicUser {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    avatar: doc.avatar || defaultAvatar(doc.name),
    jlptTarget: doc.jlptTarget,
    createdAt: doc.createdAt,
    progress: {
      ...doc.progress,
      level: levelForXp(doc.progress.xp),
      completedLessonCount: Object.keys(doc.progress.completedLessons || {}).length,
    },
  }
}

function utcDay(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

function daysBetween(a: string, b: string): number {
  const da = Date.parse(a + 'T00:00:00Z')
  const db = Date.parse(b + 'T00:00:00Z')
  return Math.round((db - da) / 86_400_000)
}

/**
 * Apply a completed lesson to a progress object (mutates a copy) and return it.
 * Idempotent-ish: re-completing a lesson updates its record and re-awards the
 * delta of XP only if the new score is higher, so replays don't inflate XP.
 */
export function applyCompletion(
  progress: Progress,
  key: string,
  correct: number,
  total: number,
): Progress {
  const p: Progress = {
    ...progress,
    studyDays: [...(progress.studyDays || [])],
    completedLessons: { ...(progress.completedLessons || {}) },
  }

  const earnedXp = 20 + correct * 8
  const prev = p.completedLessons[key]
  const xpDelta = prev ? Math.max(0, earnedXp - prev.xp) : earnedXp

  p.completedLessons[key] = { correct, total, xp: Math.max(earnedXp, prev?.xp ?? 0), at: new Date().toISOString() }
  p.xp += xpDelta
  p.coins += Math.round(xpDelta / 2)

  // Streak + study day accounting (UTC).
  const today = utcDay()
  if (!p.studyDays.includes(today)) p.studyDays.push(today)

  if (p.lastStudyDate === today) {
    // already counted today
  } else if (p.lastStudyDate && daysBetween(p.lastStudyDate, today) === 1) {
    p.streak += 1
  } else {
    p.streak = 1
  }
  p.lastStudyDate = today
  p.longestStreak = Math.max(p.longestStreak, p.streak)

  return p
}
