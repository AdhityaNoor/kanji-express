// ---------------------------------------------------------------------------
// Pure helpers that derive everything the UI shows from the user's saved
// progress (the `completedLessons` map from the API). No hardcoded values —
// a brand-new account computes to all zeros.
// ---------------------------------------------------------------------------

import {
  COURSE_LEVELS,
  SECTION_LESSON_COUNTS,
  SECTION_ORDER,
  SECTION_META,
  lessonKey,
  lessonTitle,
  type CourseLevel,
  type JlptLevel,
  type SectionId,
} from '@/data/courses'
import type { Progress } from './types'

export type Completed = Progress['completedLessons']

/** % of the previous level required to unlock the next one. */
export const UNLOCK_THRESHOLD = 60

/** Approx. distinct items studied per completed lesson, per section. */
const ITEMS_PER_LESSON: Record<SectionId, number> = {
  vocab: 8,
  kanji: 6,
  grammar: 5,
  listening: 5,
  reading: 5,
  tests: 5,
}

export function sectionDone(level: JlptLevel, section: SectionId, c: Completed): number {
  const n = SECTION_LESSON_COUNTS[section]
  let done = 0
  for (let i = 0; i < n; i++) if (c[lessonKey(level, section, i)]) done++
  return done
}

export function sectionPct(level: JlptLevel, section: SectionId, c: Completed): number {
  const total = SECTION_LESSON_COUNTS[section]
  return total === 0 ? 0 : Math.round((sectionDone(level, section, c) / total) * 100)
}

export function levelTotals(level: CourseLevel, c: Completed): { done: number; total: number } {
  let done = 0
  let total = 0
  for (const s of level.sections) {
    total += SECTION_LESSON_COUNTS[s.id]
    done += sectionDone(level.level, s.id, c)
  }
  return { done, total }
}

export function levelOverall(level: CourseLevel, c: Completed): number {
  const { done, total } = levelTotals(level, c)
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

/** N5 is always open; each later level unlocks at UNLOCK_THRESHOLD of the previous. */
export function isLevelUnlocked(level: JlptLevel, c: Completed): boolean {
  const idx = COURSE_LEVELS.findIndex((l) => l.level === level)
  if (idx <= 0) return true
  const prev = COURSE_LEVELS[idx - 1]
  return levelOverall(prev, c) >= UNLOCK_THRESHOLD
}

export function unlockHint(level: JlptLevel): string | undefined {
  const idx = COURSE_LEVELS.findIndex((l) => l.level === level)
  if (idx <= 0) return undefined
  return `Reach ${UNLOCK_THRESHOLD}% of ${COURSE_LEVELS[idx - 1].level} to unlock`
}

/** The active level = the first unlocked level that isn't finished. */
export function activeLevel(c: Completed): CourseLevel | undefined {
  return COURSE_LEVELS.find((l) => isLevelUnlocked(l.level, c) && levelOverall(l, c) < 100)
}

// --- Dashboard-oriented aggregates ------------------------------------------

/** Lessons completed per section, summed across all levels. */
export function sectionDoneAllLevels(section: SectionId, c: Completed): number {
  return COURSE_LEVELS.reduce((sum, l) => sum + sectionDone(l.level, section, c), 0)
}

export function totalLessonsForSection(section: SectionId): number {
  return SECTION_LESSON_COUNTS[section] * COURSE_LEVELS.length
}

/** Estimated distinct items "learned" in a section (completed lessons × items). */
export function itemsLearned(section: SectionId, c: Completed): { learned: number; total: number } {
  const per = ITEMS_PER_LESSON[section]
  return {
    learned: sectionDoneAllLevels(section, c) * per,
    total: totalLessonsForSection(section) * per,
  }
}

function localDay(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10)
}

const today = () => new Date().toISOString().slice(0, 10)

/** Map of 'YYYY-MM-DD' → number of lessons completed that day. */
export function studyCountsByDay(c: Completed): Record<string, number> {
  const out: Record<string, number> = {}
  for (const rec of Object.values(c)) {
    const day = localDay(rec.at)
    out[day] = (out[day] || 0) + 1
  }
  return out
}

export function lessonsCompletedToday(c: Completed): number {
  return studyCountsByDay(c)[today()] || 0
}

export function xpEarnedToday(c: Completed): number {
  const t = today()
  let xp = 0
  for (const rec of Object.values(c)) if (localDay(rec.at) === t) xp += rec.xp
  return xp
}

export interface WeakLesson {
  key: string
  label: string
  level: JlptLevel
  section: SectionId
  accuracy: number
}

/** Completed lessons with the lowest accuracy — real "weakest topics". */
export function weakLessons(c: Completed, limit = 4): WeakLesson[] {
  const rows: WeakLesson[] = []
  for (const [key, rec] of Object.entries(c)) {
    const [level, section, idxStr] = key.split('-') as [JlptLevel, SectionId, string]
    if (!SECTION_ORDER.includes(section)) continue
    const accuracy = Math.round((rec.correct / rec.total) * 100)
    rows.push({
      key,
      level,
      section,
      accuracy,
      label: `${SECTION_META[section].name}: ${lessonTitle(section, Number(idxStr))}`,
    })
  }
  return rows.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit)
}

/** Overall accuracy across all completed lessons (0-100), or null if none. */
export function overallAccuracy(c: Completed): number | null {
  let correct = 0
  let total = 0
  for (const rec of Object.values(c)) {
    correct += rec.correct
    total += rec.total
  }
  return total === 0 ? null : Math.round((correct / total) * 100)
}

/** Exam readiness = overall progress of the user's target level. */
export function examReadiness(target: JlptLevel, c: Completed): number {
  const level = COURSE_LEVELS.find((l) => l.level === target)
  return level ? levelOverall(level, c) : 0
}
