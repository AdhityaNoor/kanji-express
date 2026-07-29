// ---------------------------------------------------------------------------
// Mock data layer. Everything the Dashboard renders comes from here so the UI
// can be built and reviewed before real APIs / persistence exist. Swap these
// exports for API calls or a store later without touching the components.
// ---------------------------------------------------------------------------

export interface User {
  name: string
  avatar: string
  level: number
  xp: number
  xpToNext: number
  coins: number
  streak: number
  longestStreak: number
  jlptTarget: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
}

export const user: User = {
  name: 'Adhitya',
  avatar:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%233355ff"/><stop offset="1" stop-color="%23ff6b9d"/></linearGradient></defs><rect width="64" height="64" fill="url(%23a)"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-size="28" font-weight="700" fill="white">A</text></svg>`,
    ),
  level: 12,
  xp: 640,
  xpToNext: 1000,
  coins: 1840,
  streak: 23,
  longestStreak: 41,
  jlptTarget: 'N3',
}

export interface DailyGoal {
  targetXp: number
  earnedXp: number
  targetMinutes: number
  studiedMinutes: number
  reviewsTarget: number
  reviewsDone: number
}

export const dailyGoal: DailyGoal = {
  targetXp: 120,
  earnedXp: 78,
  targetMinutes: 30,
  studiedMinutes: 19,
  reviewsTarget: 60,
  reviewsDone: 41,
}

export interface JlptProgress {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  vocab: number
  kanji: number
  grammar: number
  listening: number
  reading: number
  overall: number
  active?: boolean
}

export const jlptProgress: JlptProgress[] = [
  { level: 'N5', vocab: 100, kanji: 100, grammar: 100, listening: 92, reading: 95, overall: 97 },
  { level: 'N4', vocab: 88, kanji: 84, grammar: 90, listening: 71, reading: 76, overall: 82 },
  { level: 'N3', vocab: 62, kanji: 55, grammar: 58, listening: 44, reading: 49, overall: 54, active: true },
  { level: 'N2', vocab: 18, kanji: 12, grammar: 15, listening: 8, reading: 10, overall: 13 },
  { level: 'N1', vocab: 4, kanji: 2, grammar: 3, listening: 1, reading: 2, overall: 2 },
]

export interface LearnedStat {
  label: string
  learned: number
  total: number
  tone: 'brand' | 'matcha' | 'amber' | 'sakura'
}

export const learnedStats: LearnedStat[] = [
  { label: 'Kanji', learned: 412, total: 650, tone: 'brand' },
  { label: 'Vocabulary', learned: 1680, total: 3750, tone: 'matcha' },
  { label: 'Grammar', learned: 96, total: 168, tone: 'amber' },
]

export interface ReviewItem {
  id: string
  kanji: string
  reading: string
  meaning: string
  due: string // human label
  type: 'kanji' | 'vocab' | 'grammar'
  overdue?: boolean
}

export const dueReviews: ReviewItem[] = [
  { id: '1', kanji: '経験', reading: 'けいけん', meaning: 'experience', due: 'now', type: 'vocab', overdue: true },
  { id: '2', kanji: '認める', reading: 'みとめる', meaning: 'to recognize', due: 'now', type: 'vocab', overdue: true },
  { id: '3', kanji: 'horizontal', reading: 'よこ', meaning: '横 — side', due: 'now', type: 'kanji' },
  { id: '4', kanji: '〜ばかり', reading: '', meaning: 'just / only', due: 'now', type: 'grammar' },
  { id: '5', kanji: '確認', reading: 'かくにん', meaning: 'confirmation', due: 'now', type: 'vocab' },
]

export interface UpcomingReview {
  when: string
  count: number
}

export const upcomingReviews: UpcomingReview[] = [
  { when: 'In 1h', count: 12 },
  { when: 'In 3h', count: 8 },
  { when: 'Tonight', count: 24 },
  { when: 'Tomorrow', count: 47 },
]

export interface WeakTopic {
  topic: string
  level: string
  accuracy: number
  attempts: number
}

export const weakTopics: WeakTopic[] = [
  { topic: 'Transitive vs. intransitive verbs', level: 'N3', accuracy: 41, attempts: 88 },
  { topic: 'Counters (助数詞)', level: 'N4', accuracy: 52, attempts: 63 },
  { topic: '〜ように / 〜ような', level: 'N3', accuracy: 58, attempts: 54 },
  { topic: 'Kanji: 識 vs. 織 vs. 職', level: 'N2', accuracy: 60, attempts: 40 },
]

// --- Heatmap: 52 weeks of study intensity (0-4) ------------------------------
// Deterministic pseudo-random so the layout is stable across reloads.
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export interface HeatDay {
  date: Date
  level: 0 | 1 | 2 | 3 | 4
  count: number
}

export function buildHeatmap(weeks = 27): HeatDay[] {
  const days: HeatDay[] = []
  const today = new Date()
  const total = weeks * 7
  // align so the last column ends on today
  const start = new Date(today)
  start.setDate(today.getDate() - (total - 1))
  for (let i = 0; i < total; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const r = seeded(i + 3)
    const recentBoost = i > total - 30 ? 0.25 : 0
    const v = r + recentBoost
    let level: HeatDay['level'] = 0
    if (v > 0.9) level = 4
    else if (v > 0.72) level = 3
    else if (v > 0.5) level = 2
    else if (v > 0.32) level = 1
    // a few rest days
    if (seeded(i + 99) > 0.86) level = 0
    days.push({ date: d, level, count: level === 0 ? 0 : level * 11 + Math.round(seeded(i) * 9) })
  }
  return days
}

export const studySummary = {
  studyDaysThisYear: 168,
  studyHoursThisYear: 121,
  retention: 91,
  reviewAccuracy: 87,
  examReadiness: 64, // % toward passing N3
}
