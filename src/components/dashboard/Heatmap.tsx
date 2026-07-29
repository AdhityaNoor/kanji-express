import { useMemo } from 'react'
import { cn } from '@/lib/cn'

type Level = 0 | 1 | 2 | 3 | 4

interface HeatDay {
  date: Date
  key: string
  count: number
  level: Level
}

const LEVEL_CLASS: Record<Level, string> = {
  0: 'bg-bg-hover',
  1: 'bg-heat-1',
  2: 'bg-heat-2',
  3: 'bg-heat-3',
  4: 'bg-heat-4',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function levelFor(count: number): Level {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 5) return 3
  return 4
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/**
 * GitHub-style contribution heatmap driven by real study data.
 * `counts` maps 'YYYY-MM-DD' → number of lessons completed that day.
 */
export function Heatmap({ counts = {}, weeks = 27 }: { counts?: Record<string, number>; weeks?: number }) {
  const columns = useMemo(() => {
    const total = weeks * 7
    const start = new Date()
    start.setUTCHours(0, 0, 0, 0)
    start.setUTCDate(start.getUTCDate() - (total - 1))

    const days: HeatDay[] = []
    for (let i = 0; i < total; i++) {
      const date = new Date(start)
      date.setUTCDate(start.getUTCDate() + i)
      const key = dayKey(date)
      const count = counts[key] || 0
      days.push({ date, key, count, level: levelFor(count) })
    }

    const cols: HeatDay[][] = []
    for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7))
    return cols
  }, [counts, weeks])

  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = []
    let last = -1
    columns.forEach((week, i) => {
      const m = week[0]?.date.getUTCMonth()
      if (m !== undefined && m !== last) {
        labels.push({ index: i, label: MONTHS[m] })
        last = m
      }
    })
    return labels
  }, [columns])

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full flex-col gap-1">
        <div className="flex gap-1 pl-8 text-[10px] text-fg-faint">
          {columns.map((_, i) => {
            const lbl = monthLabels.find((m) => m.index === i)
            return (
              <div key={i} className="w-3 shrink-0 sm:w-3.5">
                {lbl ? <span className="relative -left-0.5">{lbl.label}</span> : null}
              </div>
            )
          })}
        </div>

        <div className="flex gap-1">
          <div className="flex w-7 shrink-0 flex-col gap-1 pr-1 text-[10px] text-fg-faint">
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
              <div key={i} className="flex h-3 items-center sm:h-3.5">
                {d}
              </div>
            ))}
          </div>

          {columns.map((week, i) => (
            <div key={i} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.key}
                  title={`${day.date.toDateString()} — ${day.count} lesson${day.count === 1 ? '' : 's'}`}
                  className={cn(
                    'h-3 w-3 rounded-[3px] transition-transform hover:scale-125 sm:h-3.5 sm:w-3.5',
                    LEVEL_CLASS[day.level],
                  )}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-1 flex items-center gap-1.5 pl-8 text-[10px] text-fg-faint">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={cn('h-3 w-3 rounded-[3px]', LEVEL_CLASS[l as Level])} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
