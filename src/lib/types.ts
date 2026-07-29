// Client-side mirror of the API's public shapes.

export interface Progress {
  xp: number
  coins: number
  streak: number
  longestStreak: number
  lastStudyDate: string | null
  studyDays: string[]
  completedLessons: Record<string, { correct: number; total: number; xp: number; at: string }>
  level: number
  completedLessonCount: number
}

export interface PublicUser {
  id: string
  name: string
  email: string
  avatar: string
  jlptTarget: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  createdAt: string
  progress: Progress
}
