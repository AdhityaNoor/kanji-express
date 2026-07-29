// ---------------------------------------------------------------------------
// Pure helpers that derive everything the UI shows from saved user progress.
// A brand-new account starts at Express Starter; JLPT levels unlock after the
// short onboarding track and then by previous-level progress.
// ---------------------------------------------------------------------------

import {
  COURSE_LEVELS,
  JLPT_LEVELS,
  STARTER_LEVEL,
  SECTION_ORDER,
  SECTION_META,
  lessonCount,
  lessonKey,
  lessonTitle,
  type CourseLevel,
  type CourseLevelId,
  type SectionId,
} from '@/data/courses'
import type { Progress } from './types'

export type Completed = Progress['completedLessons']

export const STARTER_UNLOCK_THRESHOLD = 100
export const JLPT_UNLOCK_THRESHOLD = 60

const ITEMS_PER_LESSON: Record<SectionId, number> = {
  orientation: 3,
  kana: 6,
  phrases: 6,
  sentences: 5,
  study: 3,
  vocab: 8,
  kanji: 6,
  grammar: 5,
  listening: 5,
  reading: 5,
  tests: 5,
}

export function sectionDone(level: CourseLevelId, section: SectionId, c: Completed): number {
  const n = lessonCount(level, section)
  let done = 0
  for (let i = 0; i < n; i++) if (c[lessonKey(level, section, i)]) done++
  return done
}

export function sectionPct(level: CourseLevelId, section: SectionId, c: Completed): number {
  const total = lessonCount(level, section)
  return total === 0 ? 0 : Math.round((sectionDone(level, section, c) / total) * 100)
}

export function levelTotals(level: CourseLevel, c: Completed): { done: number; total: number } {
  let done = 0
  let total = 0
  for (const s of level.sections) {
    total += lessonCount(level.level, s.id)
    done += sectionDone(level.level, s.id, c)
  }
  return { done, total }
}

export function levelOverall(level: CourseLevel, c: Completed): number {
  const { done, total } = levelTotals(level, c)
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

export function isLevelUnlocked(level: CourseLevelId, c: Completed): boolean {
  if (level === STARTER_LEVEL) return true

  const starter = COURSE_LEVELS.find((l) => l.level === STARTER_LEVEL)
  if (!starter || levelOverall(starter, c) < STARTER_UNLOCK_THRESHOLD) return false

  const idx = JLPT_LEVELS.findIndex((l) => l === level)
  if (idx <= 0) return true
  const prev = COURSE_LEVELS.find((l) => l.level === JLPT_LEVELS[idx - 1])
  return prev ? levelOverall(prev, c) >= JLPT_UNLOCK_THRESHOLD : false
}

export function unlockHint(level: CourseLevelId): string | undefined {
  return unlockHintForLevel(level)
}

export function unlockHintForLevel(level: CourseLevelId, c?: Completed): string | undefined {
  if (level === STARTER_LEVEL) return undefined

  const starter = COURSE_LEVELS.find((l) => l.level === STARTER_LEVEL)
  if (starter && c && levelOverall(starter, c) < STARTER_UNLOCK_THRESHOLD) {
    return 'Complete Express Starter to unlock JLPT courses'
  }
  if (level === 'N5') return 'Complete Express Starter to unlock'

  const idx = JLPT_LEVELS.findIndex((l) => l === level)
  if (idx <= 0) return undefined
  return `Reach ${JLPT_UNLOCK_THRESHOLD}% of ${JLPT_LEVELS[idx - 1]} to unlock`
}

export function activeLevel(c: Completed): CourseLevel | undefined {
  return COURSE_LEVELS.find((l) => isLevelUnlocked(l.level, c) && levelOverall(l, c) < 100)
}

export function sectionDoneAllLevels(section: SectionId, c: Completed): number {
  return COURSE_LEVELS.reduce((sum, l) => sum + sectionDone(l.level, section, c), 0)
}

export function totalLessonsForSection(section: SectionId): number {
  return COURSE_LEVELS.reduce((sum, l) => sum + lessonCount(l.level, section), 0)
}

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
  level: CourseLevelId
  section: SectionId
  accuracy: number
}

export function weakLessons(c: Completed, limit = 4): WeakLesson[] {
  const rows: WeakLesson[] = []
  for (const [key, rec] of Object.entries(c)) {
    const [level, section, idxStr] = key.split('-') as [CourseLevelId, SectionId, string]
    if (!COURSE_LEVELS.some((l) => l.level === level) || !SECTION_ORDER.includes(section)) continue
    const accuracy = Math.round((rec.correct / rec.total) * 100)
    rows.push({
      key,
      level,
      section,
      accuracy,
      label: `${SECTION_META[section].name}: ${lessonTitle(level, section, Number(idxStr))}`,
    })
  }
  return rows.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit)
}

export function overallAccuracy(c: Completed): number | null {
  let correct = 0
  let total = 0
  for (const rec of Object.values(c)) {
    correct += rec.correct
    total += rec.total
  }
  return total === 0 ? null : Math.round((correct / total) * 100)
}

export function examReadiness(target: CourseLevelId, c: Completed): number {
  const level = COURSE_LEVELS.find((l) => l.level === target)
  return level && level.kind === 'jlpt' ? levelOverall(level, c) : 0
}
