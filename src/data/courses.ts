// ---------------------------------------------------------------------------
// Course structure for the JLPT modules (N5–N1). This file is now pure
// curriculum metadata — how many lessons each section has and what they're
// called. All *progress* (what's done, %, unlock state) is derived from the
// signed-in user's saved data in src/lib/progress.ts. Nothing here is
// per-user or hardcoded to look "completed".
// ---------------------------------------------------------------------------

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

export type SectionId = 'vocab' | 'kanji' | 'grammar' | 'listening' | 'reading' | 'tests'

export interface CourseSection {
  id: SectionId
  name: string
  /** total lessons available in this section */
  lessons: number
}

export interface CourseLevel {
  level: JlptLevel
  title: string
  blurb: string
  accentKana: string
  sections: CourseSection[]
}

export const SECTION_ORDER: SectionId[] = ['vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests']

export const SECTION_META: Record<SectionId, { name: string; blurb: string }> = {
  vocab: { name: 'Vocabulary', blurb: 'Core words with audio, pitch accent & examples' },
  kanji: { name: 'Kanji', blurb: 'Readings, radicals, stroke order & mnemonics' },
  grammar: { name: 'Grammar', blurb: 'Patterns, nuance, and common mistakes' },
  listening: { name: 'Listening', blurb: 'Dialogues and comprehension drills' },
  reading: { name: 'Reading', blurb: 'Passages with graded difficulty' },
  tests: { name: 'Practice Tests', blurb: 'Timed sections & full mock exams' },
}

const LESSON_TITLES: Record<SectionId, string[]> = {
  vocab: ['Daily life', 'Time & dates', 'Around town', 'Feelings', 'Work & study', 'Travel', 'Food & cooking', 'Nature'],
  kanji: ['People & family', 'Numbers & counters', 'Nature radicals', 'Movement verbs', 'Body & health', 'City & places', 'Time kanji', 'Abstract concepts'],
  grammar: ['Particles review', 'Te-form patterns', 'Conditionals', 'Passive & causative', 'Keigo basics', 'Comparisons', 'Expressing intent', 'Nuance & tone'],
  listening: ['Short dialogues', 'Announcements', 'Phone calls', 'Directions', 'Interviews', 'Fast speech', 'Note-taking', 'Mock listening'],
  reading: ['Signs & notices', 'Short emails', 'Blog posts', 'News headlines', 'Instructions', 'Opinion pieces', 'Charts & tables', 'Long passage'],
  tests: ['Vocab section', 'Grammar section', 'Reading section', 'Listening section', 'Half mock', 'Full mock A', 'Full mock B', 'Weakness retest'],
}

/** Number of lessons available in each section (kept in sync with LESSON_TITLES). */
export const SECTION_LESSON_COUNTS: Record<SectionId, number> = Object.fromEntries(
  SECTION_ORDER.map((id) => [id, LESSON_TITLES[id].length]),
) as Record<SectionId, number>

export function lessonTitle(section: SectionId, index: number): string {
  return LESSON_TITLES[section][index] ?? `Lesson ${index + 1}`
}

function sectionsFor(): CourseSection[] {
  return SECTION_ORDER.map((id) => ({ id, name: SECTION_META[id].name, lessons: SECTION_LESSON_COUNTS[id] }))
}

export const COURSE_LEVELS: CourseLevel[] = [
  { level: 'N5', title: 'Foundations', blurb: 'Hiragana, katakana, and your first 100 kanji.', accentKana: 'ご', sections: sectionsFor() },
  { level: 'N4', title: 'Everyday Japanese', blurb: 'Casual speech, more verbs, and 300 kanji.', accentKana: 'し', sections: sectionsFor() },
  { level: 'N3', title: 'The Bridge', blurb: 'The jump to intermediate — nuance and speed.', accentKana: 'ちゅう', sections: sectionsFor() },
  { level: 'N2', title: 'Fluency', blurb: 'Newspapers, workplace Japanese, and abstract topics.', accentKana: 'じょう', sections: sectionsFor() },
  { level: 'N1', title: 'Mastery', blurb: 'Literary, technical, and native-level material.', accentKana: 'たつ', sections: sectionsFor() },
]

export function getLevel(level: string): CourseLevel | undefined {
  return COURSE_LEVELS.find((l) => l.level.toLowerCase() === level.toLowerCase())
}

// --- Lessons -----------------------------------------------------------------

export type LessonStatus = 'done' | 'current' | 'available'

export interface Lesson {
  id: string
  index: number
  title: string
  subtitle: string
  xp: number
  status: LessonStatus
  itemCount: number
  section: SectionId
  /** route to the lesson player */
  href: string
  /** best accuracy recorded (0-100), if completed */
  accuracy?: number
}

export type CompletedLessons = Record<string, { correct: number; total: number; xp: number; at: string }>

export function lessonKey(level: JlptLevel, section: SectionId, index: number): string {
  return `${level}-${section}-${index}`
}

/**
 * Build a lesson list for a section with statuses derived from the user's
 * completed-lessons map. The first not-yet-completed lesson is "current";
 * later lessons are "available" (nothing is artificially locked inside a
 * section the user can already reach).
 */
export function buildLessons(
  level: CourseLevel,
  sectionId: SectionId,
  completed: CompletedLessons,
): Lesson[] {
  const titles = LESSON_TITLES[sectionId]
  let currentAssigned = false

  return titles.map((title, i) => {
    const key = lessonKey(level.level, sectionId, i)
    const record = completed[key]
    let status: LessonStatus
    if (record) {
      status = 'done'
    } else if (!currentAssigned) {
      status = 'current'
      currentAssigned = true
    } else {
      status = 'available'
    }

    return {
      id: key,
      index: i + 1,
      title,
      subtitle: SECTION_META[sectionId].name,
      xp: 20 + i * 5,
      status,
      itemCount: 8 + ((i * 3) % 10),
      section: sectionId,
      href: `/courses/${level.level.toLowerCase()}/${sectionId}/${i}`,
      accuracy: record ? Math.round((record.correct / record.total) * 100) : undefined,
    }
  })
}
