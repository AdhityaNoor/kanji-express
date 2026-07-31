import { Link } from 'react-router-dom'
import {
  BookOpenText as BookOpenCheck,
  CaretRight as ChevronRight,
  Clock,
  Coins,
  Fire as Flame,
  GraduationCap,
  Lightning as Zap,
  Play,
  Sparkle as Sparkles,
  Target,
  Warning as AlertTriangle,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RingProgress } from '@/components/ui/RingProgress'
import { Badge } from '@/components/ui/Badge'
import { StatChip } from '@/components/dashboard/StatChip'
import { Heatmap } from '@/components/dashboard/Heatmap'
import { SECTION_ICON } from '@/components/courses/sectionIcons'
import { COURSE_LEVELS, buildLessons, type Lesson } from '@/data/courses'
import { useAuth } from '@/lib/auth'
import {
  levelOverall,
  activeLevel,
  itemsLearned,
  studyCountsByDay,
  xpEarnedToday,
  lessonsCompletedToday,
  weakLessons,
  overallAccuracy,
  examReadiness,
  type Completed,
} from '@/lib/progress'

const DAILY_XP_GOAL = 100

const learnedSections: { id: 'kanji' | 'vocab' | 'grammar'; label: string; tone: string }[] = [
  { id: 'kanji', label: 'Kanji', tone: 'bg-accent' },
  { id: 'vocab', label: 'Vocabulary', tone: 'bg-matcha' },
  { id: 'grammar', label: 'Grammar', tone: 'bg-amber' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const p = user?.progress
  const completed: Completed = p?.completedLessons ?? {}

  const xpIntoLevel = p ? p.xp % 500 : 0
  const xpToday = xpEarnedToday(completed)
  const lessonsToday = lessonsCompletedToday(completed)
  const goalPct = Math.min(100, Math.round((xpToday / DAILY_XP_GOAL) * 100))

  const active = activeLevel(completed)
  const target = user?.jlptTarget ?? 'N5'
  const jlptLevels = COURSE_LEVELS.filter((level) => level.kind === 'jlpt')

  // "Up next" = the current (first incomplete) lesson in each section of the active level.
  const upNext: Lesson[] = active
    ? active.sections
        .map((s) => buildLessons(active, s.id, completed).find((l) => l.status === 'current'))
        .filter((l): l is Lesson => Boolean(l))
        .slice(0, 5)
    : []

  const weak = weakLessons(completed)
  const accuracy = overallAccuracy(completed)
  const readiness = examReadiness(target, completed)
  const dayCounts = studyCountsByDay(completed)
  const studyDayCount = p?.studyDays.length ?? 0
  const studyHours = Math.round(((p?.completedLessonCount ?? 0) * 4) / 60)

  const startHref = '/session?duration=15'

  return (
    <div className="animate-fade-up space-y-6">
      {/* Greeting */}
      <div className="ke-panel p-5 sm:p-6">
        <div className="ke-watermark -right-4 -top-8 text-[9rem]">学</div>
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-accent-fg">おかえり、また会えて嬉しいです</p>
            <h1 className="mt-1 text-2xl font-extrabold text-fg-strong sm:text-3xl">
              Welcome back, {user?.name ?? 'there'}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="brand">
                <GraduationCap className="h-3 w-3" /> Target {target}
              </Badge>
              <Badge tone="amber">
                <Clock className="h-3 w-3" /> {xpToday}/{DAILY_XP_GOAL} XP today
              </Badge>
              <Badge tone="matcha">
                <BookOpenCheck className="h-3 w-3" /> {lessonsToday} lesson{lessonsToday === 1 ? '' : 's'}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-[13rem] rounded-xl bg-bg-soft/80 p-3 ring-1 ring-inset ring-line">
              <div className="mb-1 flex items-center justify-between text-xs font-semibold text-fg-muted">
                <span>Daily route</span>
                <span>{goalPct}%</span>
              </div>
              <ProgressBar value={goalPct} height="h-2.5" />
            </div>
            <Link to={startHref}>
              <Button size="md" className="w-full shrink-0 sm:w-auto">
                <Play className="h-4 w-4" /> {lessonsToday > 0 ? 'Keep going' : "Start today's session"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top stat chips */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatChip icon={Flame} label="Current streak" value={`${p?.streak ?? 0} days`} sub={`Best ${p?.longestStreak ?? 0}`} tone="text-amber" />
        <StatChip icon={Zap} label="Level & XP" value={`Lv ${p?.level ?? 1}`} sub={`${xpIntoLevel} / 500 XP`} tone="text-accent-fg" />
        <StatChip icon={BookOpenCheck} label="Lessons today" value={String(lessonsToday)} sub={`${p?.completedLessonCount ?? 0} all-time`} tone="text-matcha" />
        <StatChip icon={Coins} label="Coins" value={(p?.coins ?? 0).toLocaleString()} sub="Spend in shop" tone="text-sakura" />
      </div>

      {/* Row: Daily goal ring + Up next */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Daily goal</CardTitle>
            <Badge tone={goalPct >= 100 ? 'matcha' : 'brand'}>
              <Target className="h-3 w-3" /> {goalPct}%
            </Badge>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-4">
            <RingProgress value={goalPct} size={150} stroke={12} color={goalPct >= 100 ? '#2fd67f' : 'var(--c-accent)'}>
              <div>
                <p className="text-3xl font-extrabold text-fg-strong">{xpToday}</p>
                <p className="text-xs text-fg-muted">of {DAILY_XP_GOAL} XP</p>
              </div>
            </RingProgress>
            <div className="grid w-full grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-bg-soft p-3 ring-1 ring-inset ring-line/60">
                <p className="text-lg font-bold text-fg-strong">{lessonsToday}</p>
                <p className="text-[11px] text-fg-faint">Lessons today</p>
              </div>
              <div className="rounded-xl bg-bg-soft p-3 ring-1 ring-inset ring-line/60">
                <p className="text-lg font-bold text-fg-strong">{p?.streak ?? 0}</p>
                <p className="text-[11px] text-fg-faint">Day streak</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Up next */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Up next</CardTitle>
            <Link to="/courses">
              <Button size="sm" variant="outline">
                All courses <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardBody className="space-y-2">
            {upNext.length > 0 ? (
              upNext.map((lesson) => {
                const Icon = SECTION_ICON[lesson.section]
                return (
                  <Link
                    key={lesson.id}
                    to={lesson.href}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-bg-soft p-3 transition-all hover:-translate-y-0.5 hover:border-accent/35 hover:bg-bg-hover"
                  >
                    <div className="grid h-11 w-8 shrink-0 place-items-center text-accent-fg">
                      <Icon className="h-6 w-6" weight="duotone" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg-strong">{lesson.title}</p>
                      <p className="truncate text-xs text-fg-faint">
                        {active?.level} · {lesson.subtitle} · +{lesson.xp} XP
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-fg-faint transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )
              })
            ) : (
              <div className="grid place-items-center gap-2 py-8 text-center">
                <Sparkles className="h-8 w-8 text-accent-fg" />
                <p className="text-sm font-semibold text-fg-strong">You&apos;re all caught up!</p>
                <p className="max-w-xs text-xs text-fg-muted">
                  Every unlocked lesson is done. Keep your streak alive by reviewing or advancing to the next level.
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Row: JLPT progress + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>JLPT progress</CardTitle>
            <Badge tone="brand">Targeting {target}</Badge>
          </CardHeader>
          <CardBody className="space-y-4">
            {jlptLevels.map((lvl) => {
              const overall = levelOverall(lvl, completed)
              const isTarget = lvl.level === target
              return (
                <div key={lvl.level}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-fg">
                      {lvl.level}
                      {isTarget ? <Badge tone="brand">target</Badge> : null}
                    </span>
                    <span className="text-fg-muted">{overall}%</span>
                  </div>
                  <ProgressBar
                    value={overall}
                    barClassName={overall >= 100 ? 'bg-matcha' : overall > 0 ? 'bg-accent' : 'bg-fg-faint/40'}
                  />
                </div>
              )
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your activity</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            <Stat label="Lessons completed" value={String(p?.completedLessonCount ?? 0)} />
            <Stat label="Study days" value={String(studyDayCount)} />
            <Stat label="Overall accuracy" value={accuracy === null ? '—' : `${accuracy}%`} />
            <Stat label="Total XP" value={(p?.xp ?? 0).toLocaleString()} />
          </CardBody>
        </Card>
      </div>

      {/* Learned stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {learnedSections.map((s) => {
          const { learned, total } = itemsLearned(s.id, completed)
          const pct = total === 0 ? 0 : Math.round((learned / total) * 100)
          return (
            <Card key={s.id} className="p-4 sm:p-5">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-fg">{s.label} learned</p>
                <span className="text-xs text-fg-faint">{pct}%</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold text-fg-strong">
                {learned.toLocaleString()}
                <span className="text-sm font-medium text-fg-faint"> / {total.toLocaleString()}</span>
              </p>
              <ProgressBar className="mt-3" value={pct} barClassName={s.tone} />
            </Card>
          )
        })}
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Study activity</CardTitle>
          <div className="flex gap-4 text-xs text-fg-muted">
            <span>{studyDayCount} days</span>
            <span>{studyHours} h</span>
            {accuracy !== null ? <span>{accuracy}% accuracy</span> : null}
          </div>
        </CardHeader>
        <CardBody>
          <Heatmap counts={dayCounts} />
        </CardBody>
      </Card>

      {/* Weakest topics + exam readiness */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weakest topics</CardTitle>
            {weak.length > 0 ? (
              <Badge tone="coral">
                <AlertTriangle className="h-3 w-3" /> Needs work
              </Badge>
            ) : null}
          </CardHeader>
          <CardBody className="space-y-3">
            {weak.length > 0 ? (
              weak.map((t) => (
                <div key={t.key} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-fg">{t.label}</p>
                      <Badge tone="neutral">{t.level}</Badge>
                    </div>
                    <ProgressBar
                      className="mt-1.5"
                      height="h-1.5"
                      value={t.accuracy}
                      barClassName={t.accuracy < 50 ? 'bg-coral' : 'bg-amber'}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-sm font-bold text-fg-strong">{t.accuracy}%</span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-fg-muted">
                Complete a few lessons and your weakest topics will show up here.
              </p>
            )}
          </CardBody>
        </Card>

        <Card className="grid place-items-center">
          <CardBody className="flex flex-col items-center gap-3 text-center">
            <CardTitle>Exam readiness</CardTitle>
            <RingProgress value={readiness} size={130} stroke={11} color="#2fd67f">
              <div>
                <p className="text-2xl font-extrabold text-fg-strong">{readiness}%</p>
                <p className="text-[11px] text-fg-muted">to pass {target}</p>
              </div>
            </RingProgress>
            <p className="max-w-[16rem] text-xs text-fg-faint">
              Based on your completion of the {target} course. Grows as you finish lessons.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-bg-soft p-3">
      <span className="text-sm text-fg">{label}</span>
      <span className="text-sm font-bold text-fg-strong">{value}</span>
    </div>
  )
}
