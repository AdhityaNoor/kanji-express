// ---------------------------------------------------------------------------
// Course structure.
//
// STARTER is the lightweight onboarding track before JLPT study. N5-N1 keep the
// exam-oriented sections. User progress, completion percentage, and unlock
// state are derived from src/lib/progress.ts.
// ---------------------------------------------------------------------------

import { LESSON_DEFS } from './content'

export type CourseLevelId = 'STARTER' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
export type JlptLevel = CourseLevelId

export type StarterSectionId = 'orientation' | 'kana' | 'phrases' | 'sentences' | 'study'
export type JlptSectionId = 'overview' | 'vocab' | 'kanji' | 'grammar' | 'listening' | 'reading' | 'tests'
export type SectionId = StarterSectionId | JlptSectionId

export interface CourseSection {
  id: SectionId
  name: string
  lessons: number
}

export interface CourseLevel {
  level: CourseLevelId
  title: string
  blurb: string
  accentKana: string
  sections: CourseSection[]
  kind: 'starter' | 'jlpt'
}

export const STARTER_LEVEL: CourseLevelId = 'STARTER'
export const JLPT_LEVELS: CourseLevelId[] = ['N5', 'N4', 'N3', 'N2', 'N1']

export const STARTER_SECTION_ORDER: StarterSectionId[] = ['orientation', 'kana', 'phrases', 'sentences', 'study']
export const JLPT_SECTION_ORDER: JlptSectionId[] = ['overview', 'vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests']
export const SECTION_ORDER: SectionId[] = [...STARTER_SECTION_ORDER, ...JLPT_SECTION_ORDER]

export const SECTION_META: Record<SectionId, { name: string; blurb: string }> = {
  orientation: { name: 'Boarding Pass', blurb: 'How Japanese works and how Kanji Express teaches' },
  kana: { name: 'Kana Sprint', blurb: 'Fast hiragana and katakana recognition before kanji load' },
  phrases: { name: 'Survival Phrases', blurb: 'Useful expressions you can use immediately' },
  sentences: { name: 'Sentence Signals', blurb: 'Tiny patterns that make Japanese grammar less abstract' },
  study: { name: 'Review System', blurb: 'How SRS, mistakes, and daily sessions work' },
  overview: { name: 'Level Overview', blurb: 'Scope, outcomes, study strategy, and handover into this JLPT level' },
  vocab: { name: 'Vocabulary', blurb: 'Core words with audio, pitch accent, and examples' },
  kanji: { name: 'Kanji', blurb: 'Readings, radicals, stroke order, and mnemonics' },
  grammar: { name: 'Grammar', blurb: 'Patterns, nuance, and common mistakes' },
  listening: { name: 'Listening', blurb: 'Dialogues and comprehension drills' },
  reading: { name: 'Reading', blurb: 'Passages with graded difficulty' },
  tests: { name: 'Practice Tests', blurb: 'Timed sections and full mock exams' },
}

export function levelSections(level: CourseLevelId): SectionId[] {
  return level === STARTER_LEVEL ? STARTER_SECTION_ORDER : JLPT_SECTION_ORDER
}

export function lessonCount(level: CourseLevelId, section: SectionId): number {
  return LESSON_DEFS[level][section]?.length ?? 0
}

export function lessonTitle(level: CourseLevelId, section: SectionId, index: number): string {
  return LESSON_DEFS[level][section]?.[index]?.title ?? `Lesson ${index + 1}`
}

export function lessonDescription(level: CourseLevelId, section: SectionId, index: number): string {
  return LESSON_DEFS[level][section]?.[index]?.description ?? ''
}

function sectionsFor(level: CourseLevelId): CourseSection[] {
  return levelSections(level).map((id) => ({ id, name: SECTION_META[id].name, lessons: lessonCount(level, id) }))
}

export const COURSE_LEVELS: CourseLevel[] = [
  {
    level: 'STARTER',
    title: 'Express Starter',
    blurb: 'A lightweight launch track: scripts, survival phrases, sentence signals, and study habits.',
    accentKana: '始',
    sections: sectionsFor('STARTER'),
    kind: 'starter',
  },
  {
    level: 'N5',
    title: 'Survival Foundations',
    blurb: 'Kana, greetings, numbers, time, places, and your first 100 kanji.',
    accentKana: 'ご',
    sections: sectionsFor('N5'),
    kind: 'jlpt',
  },
  {
    level: 'N4',
    title: 'Everyday Autonomy',
    blurb: 'Plans, reasons, routine tasks, and daily-life comprehension.',
    accentKana: 'し',
    sections: sectionsFor('N4'),
    kind: 'jlpt',
  },
  {
    level: 'N3',
    title: 'The Bridge',
    blurb: 'Intermediate nuance, near-natural listening, and practical reading.',
    accentKana: '中',
    sections: sectionsFor('N3'),
    kind: 'jlpt',
  },
  {
    level: 'N2',
    title: 'Independent Fluency',
    blurb: 'Workplace, news, essays, and abstract everyday topics.',
    accentKana: '上',
    sections: sectionsFor('N2'),
    kind: 'jlpt',
  },
  {
    level: 'N1',
    title: 'Advanced Mastery',
    blurb: 'Dense argument, literary forms, register, and native-speed material.',
    accentKana: '達',
    sections: sectionsFor('N1'),
    kind: 'jlpt',
  },
]

export function getLevel(level: string): CourseLevel | undefined {
  return COURSE_LEVELS.find((l) => l.level.toLowerCase() === level.toLowerCase())
}

export type LessonStatus = 'done' | 'current' | 'available'

export interface Lesson {
  id: string
  index: number
  title: string
  description: string
  mission?: string
  canDo?: string
  subtitle: string
  xp: number
  status: LessonStatus
  itemCount: number
  section: SectionId
  href: string
  accuracy?: number
}

export type CompletedLessons = Record<string, { correct: number; total: number; xp: number; at: string }>

export function lessonKey(level: CourseLevelId, section: SectionId, index: number): string {
  return `${level}-${section}-${index}`
}

export function buildLessons(
  level: CourseLevel,
  sectionId: SectionId,
  completed: CompletedLessons,
): Lesson[] {
  const defs = LESSON_DEFS[level.level][sectionId] ?? []
  let currentAssigned = false

  return defs.map((def, i) => {
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
      title: def.title,
      description: def.description,
      mission: def.mission,
      canDo: def.canDo,
      subtitle: SECTION_META[sectionId].name,
      xp: 20 + i * 5,
      status,
      itemCount: def.items.length,
      section: sectionId,
      href: `/courses/${level.level.toLowerCase()}/${sectionId}/${i}`,
      accuracy: record ? Math.round((record.correct / record.total) * 100) : undefined,
    }
  })
}
