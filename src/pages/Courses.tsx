import { Link } from 'react-router-dom'
import { Lock, ChevronRight, Check, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RingProgress } from '@/components/ui/RingProgress'
import { SECTION_ICON } from '@/components/courses/sectionIcons'
import { COURSE_LEVELS } from '@/data/courses'
import {
  levelOverall,
  isLevelUnlocked,
  unlockHintForLevel,
  activeLevel,
  sectionPct,
  type Completed,
} from '@/lib/progress'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/cn'

export default function Courses() {
  const { user } = useAuth()
  const completed: Completed = user?.progress.completedLessons ?? {}
  const active = activeLevel(completed)

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fg-strong sm:text-3xl">Learning Route</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Start with a lightweight Express Starter, then move into JLPT N5-N1.
        </p>
      </div>

      {active ? (
        <Card className="flex flex-col gap-4 bg-accent/[0.06] p-5 sm:flex-row sm:items-center">
          <RingProgress value={levelOverall(active, completed)} size={72} stroke={8}>
            <span className="text-sm font-extrabold text-fg-strong">{levelOverall(active, completed)}%</span>
          </RingProgress>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-fg">
              {levelOverall(active, completed) > 0 ? 'Continue learning' : 'Start here'}
            </p>
            <p className="truncate text-lg font-bold text-fg-strong">
              {active.level === 'STARTER' ? active.title : `${active.level} - ${active.title}`}
            </p>
            <p className="truncate text-sm text-fg-muted">{active.blurb}</p>
          </div>
          <Link
            to={`/courses/${active.level.toLowerCase()}`}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-accent px-5 font-semibold text-accent-on shadow-glow transition-colors hover:bg-accent-strong"
          >
            {levelOverall(active, completed) > 0 ? 'Resume' : 'Begin'} <ChevronRight className="h-4 w-4" />
          </Link>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {COURSE_LEVELS.map((lvl) => {
          const overall = levelOverall(lvl, completed)
          const unlocked = isLevelUnlocked(lvl.level, completed)
          const complete = overall === 100
          const inner = (
            <Card
              className={cn(
                'group relative h-full overflow-hidden p-5 transition-all',
                unlocked ? 'hover:-translate-y-0.5 hover:shadow-glow' : 'opacity-70',
              )}
            >
              <span className="pointer-events-none absolute -right-3 -top-6 select-none font-jp text-[6rem] leading-none text-fg/[0.04]">
                {lvl.accentKana}
              </span>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'grid h-12 min-w-12 place-items-center rounded-xl px-2 text-lg font-extrabold',
                      unlocked ? 'bg-accent text-accent-on' : 'bg-bg-hover text-fg-faint',
                    )}
                  >
                    {lvl.level === 'STARTER' ? <Sparkles className="h-5 w-5" /> : lvl.level}
                  </div>
                  <div>
                    <p className="font-bold text-fg-strong">{lvl.title}</p>
                    {complete ? (
                      <Badge tone="matcha">
                        <Check className="h-3 w-3" /> Complete
                      </Badge>
                    ) : unlocked ? (
                      <Badge tone={lvl.kind === 'starter' ? 'sakura' : 'brand'}>{overall}% done</Badge>
                    ) : (
                      <Badge tone="neutral">
                        <Lock className="h-3 w-3" /> Locked
                      </Badge>
                    )}
                  </div>
                </div>
                {unlocked ? (
                  <ChevronRight className="h-5 w-5 text-fg-faint transition-transform group-hover:translate-x-0.5" />
                ) : (
                  <Lock className="h-5 w-5 text-fg-faint" />
                )}
              </div>

              <p className="mt-3 text-sm text-fg-muted">{lvl.blurb}</p>

              {unlocked ? (
                <ProgressBar className="mt-4" value={overall} barClassName={complete ? 'bg-matcha' : 'bg-accent'} />
              ) : (
                <p className="mt-4 text-xs font-medium text-fg-faint">{unlockHintForLevel(lvl.level, completed)}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-1.5">
                {lvl.sections.map((s) => {
                  const Icon = SECTION_ICON[s.id]
                  const sPct = sectionPct(lvl.level, s.id, completed)
                  const sDone = sPct >= 100
                  return (
                    <span
                      key={s.id}
                      title={`${s.name} - ${sPct}%`}
                      className={cn(
                        'grid h-8 w-8 place-items-center rounded-lg ring-1 ring-inset ring-line',
                        !unlocked
                          ? 'bg-bg-soft text-fg-faint'
                          : sDone
                            ? 'bg-matcha/15 text-matcha'
                            : sPct > 0
                              ? 'bg-accent/10 text-accent-fg'
                              : 'bg-bg-soft text-fg-faint',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  )
                })}
              </div>
            </Card>
          )

          return unlocked ? (
            <Link key={lvl.level} to={`/courses/${lvl.level.toLowerCase()}`} className="block">
              {inner}
            </Link>
          ) : (
            <div key={lvl.level} aria-disabled className="cursor-not-allowed">
              {inner}
            </div>
          )
        })}
      </div>
    </div>
  )
}
