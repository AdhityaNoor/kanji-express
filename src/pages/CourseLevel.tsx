import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Check, Play, ChevronRight, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RingProgress } from '@/components/ui/RingProgress'
import { SECTION_ICON } from '@/components/courses/sectionIcons'
import {
  getLevel,
  buildLessons,
  SECTION_META,
  SECTION_LESSON_COUNTS,
  type SectionId,
  type Lesson,
} from '@/data/courses'
import { levelOverall, isLevelUnlocked, unlockHint, sectionDone, sectionPct, type Completed } from '@/lib/progress'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/cn'

export default function CourseLevel() {
  const { level = '' } = useParams()
  const { user } = useAuth()
  const completed: Completed = user?.progress.completedLessons ?? {}
  const course = getLevel(level)

  const firstOpen = course?.sections[0]?.id
  const [selected, setSelected] = useState<SectionId | undefined>(firstOpen)

  if (!course) {
    return (
      <div className="animate-fade-up">
        <Card className="p-10 text-center">
          <p className="text-sm text-fg-muted">That level doesn&apos;t exist.</p>
          <Link to="/courses" className="mt-3 inline-block text-sm font-semibold text-accent-fg">
            ← Back to courses
          </Link>
        </Card>
      </div>
    )
  }

  const unlocked = isLevelUnlocked(course.level, completed)
  const overall = levelOverall(course, completed)

  if (!unlocked) {
    return (
      <div className="animate-fade-up space-y-6">
        <BackLink />
        <Card className="grid place-items-center gap-3 p-10 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-bg-hover text-fg-faint">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-fg-strong">{course.level} is locked</h1>
          <p className="max-w-sm text-sm text-fg-muted">{unlockHint(course.level)}</p>
          <Link to="/courses" className="mt-1 text-sm font-semibold text-accent-fg">
            ← Back to courses
          </Link>
        </Card>
      </div>
    )
  }

  const activeSection = selected
  const lessons: Lesson[] = activeSection ? buildLessons(course, activeSection, completed) : []

  return (
    <div className="animate-fade-up space-y-6">
      <BackLink />

      {/* Header */}
      <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-accent text-2xl font-extrabold text-accent-on">
            {course.level}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-fg-strong">{course.title}</h1>
            <p className="text-sm text-fg-muted">{course.blurb}</p>
          </div>
        </div>
        <div className="sm:ml-auto">
          <RingProgress value={overall} size={84} stroke={9}>
            <div className="text-center">
              <p className="text-lg font-extrabold text-fg-strong">{overall}%</p>
              <p className="text-[10px] text-fg-faint">complete</p>
            </div>
          </RingProgress>
        </div>
      </Card>

      {/* Section selector */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {course.sections.map((s) => {
          const Icon = SECTION_ICON[s.id]
          const done = sectionDone(course.level, s.id, completed)
          const p = sectionPct(course.level, s.id, completed)
          const isActive = s.id === selected
          const finished = p >= 100
          return (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all',
                isActive
                  ? 'border-accent/40 bg-accent/[0.06] ring-1 ring-inset ring-accent/25'
                  : 'border-line bg-bg-card hover:bg-bg-hover',
              )}
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'grid h-10 w-10 place-items-center rounded-xl',
                    finished ? 'bg-matcha/15 text-matcha' : p > 0 ? 'bg-accent/10 text-accent-fg' : 'bg-bg-hover text-fg-faint',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {finished ? <Check className="h-4 w-4 text-matcha" /> : null}
              </div>
              <p className="mt-3 text-sm font-semibold text-fg-strong">{s.name}</p>
              <p className="text-xs text-fg-faint">
                {done}/{SECTION_LESSON_COUNTS[s.id]} lessons
              </p>
              <ProgressBar className="mt-2" height="h-1.5" value={p} barClassName={finished ? 'bg-matcha' : 'bg-accent'} />
            </button>
          )
        })}
      </div>

      {/* Lessons for the selected section */}
      {activeSection ? (
        <Card>
          <div className="flex items-center justify-between p-4 sm:p-5">
            <div>
              <h2 className="text-lg font-bold text-fg-strong">{SECTION_META[activeSection].name}</h2>
              <p className="text-xs text-fg-muted">{SECTION_META[activeSection].blurb}</p>
            </div>
            <Badge tone="brand">
              {sectionDone(course.level, activeSection, completed)}/{SECTION_LESSON_COUNTS[activeSection]}
            </Badge>
          </div>

          <ul className="divide-y divide-line border-t border-line">
            {lessons.map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} />
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  )
}

function BackLink() {
  return (
    <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted hover:text-fg">
      <ArrowLeft className="h-4 w-4" /> Courses
    </Link>
  )
}

const STATUS_BADGE: Record<Lesson['status'], string> = {
  done: 'bg-matcha/15 text-matcha',
  current: 'bg-accent text-accent-on',
  available: 'bg-accent/10 text-accent-fg',
}

function LessonRow({ lesson }: { lesson: Lesson }) {
  return (
    <li>
      <Link
        to={lesson.href}
        className="flex items-center gap-3 p-3 transition-colors hover:bg-bg-hover sm:px-5"
      >
        <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold', STATUS_BADGE[lesson.status])}>
          {lesson.status === 'done' ? <Check className="h-5 w-5" /> : lesson.index}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-fg-strong">{lesson.title}</p>
          <p className="truncate text-xs text-fg-faint">
            {lesson.itemCount} items · +{lesson.xp} XP
            {lesson.accuracy !== undefined ? ` · ${lesson.accuracy}%` : ''}
          </p>
        </div>

        {lesson.status === 'done' ? (
          <span className="flex items-center gap-1 text-xs font-medium text-matcha">
            <Star className="h-3.5 w-3.5 fill-current" /> Review
          </span>
        ) : lesson.status === 'current' ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-on">
            <Play className="h-3.5 w-3.5" /> {/* first incomplete */} Continue
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-fg">
            Start <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </Link>
    </li>
  )
}
