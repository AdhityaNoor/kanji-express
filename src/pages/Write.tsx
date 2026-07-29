import { Link } from 'react-router-dom'
import { ChevronRight, NotebookPen, PenLine } from 'lucide-react'
import { cn } from '@/lib/cn'

const WRITE_MENUS = [
  {
    title: 'Stroke lab',
    description: 'Look up a kanji, draw it, replay your strokes, and compare the result.',
    to: '/write/stroke-lab',
    icon: PenLine,
    meta: ['JLPT lookup', 'Stroke order', 'Open practice'],
  },
  {
    title: 'Kanji practice',
    description: 'Progress through radicals and JLPT sets with pass counters before quizzes unlock.',
    to: '/write/kanji-practice',
    icon: NotebookPen,
    meta: ['N0-N5+', '20 passes each', 'End quizzes'],
  },
]

export default function Write() {
  return (
    <div className="animate-fade-up mx-auto max-w-5xl space-y-5">
      <div className="border-b border-line pb-4">
        <p className="ke-section-label">Write</p>
        <h1 className="mt-2 text-2xl font-extrabold text-fg-strong sm:text-3xl">Writing practice</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-fg-muted">
          Pick the writing workflow you need right now.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-bg-card">
        {WRITE_MENUS.map(({ title, description, to, icon: Icon, meta }, index) => (
          <Link key={to} to={to} className="group block">
            <div
              className={cn(
                'grid gap-4 p-4 transition-colors hover:bg-bg-hover sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center sm:p-5',
                index > 0 && 'border-t border-line',
              )}
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-bg-soft text-fg ring-1 ring-inset ring-line">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-fg-strong">{title}</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-fg-muted">{description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {meta.map((item) => (
                    <span key={item} className="rounded-md bg-bg-soft px-2 py-1 text-[11px] font-semibold text-fg-muted">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-accent-fg sm:justify-self-end">
                Open
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
