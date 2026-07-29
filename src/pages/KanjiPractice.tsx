import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { BookOpenText as BookOpenCheck, CheckCircle as CheckCircle2, Lock, Trophy } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SpeakButton } from '@/components/ui/SpeakButton'
import { KanjiCanvas, type Grade } from '@/components/write/KanjiCanvas'
import { allKanji, type KanjiEntry } from '@/data/content'
import { strokePathsFor } from '@/data/strokeData'
import { cn } from '@/lib/cn'
import { fetchJlptKanji, fetchKanjiInfo, type KanjiInfo, type KanjiJlptLevel } from '@/lib/kanjiApi'
import { KANJIVG_VIEWBOX, loadKanjiVgPaths } from '@/lib/kanjivg'
import { firstJapaneseReading } from '@/lib/japaneseSpeech'

type PracticeLevel = 'N0' | KanjiJlptLevel

const REQUIRED_PASSES = 20
const REFERENCE_PASSES = 5
const STORAGE_KEY = 'kanji-express.kanji-practice.v1'

const LEVELS: { id: PracticeLevel; label: string; name: string }[] = [
  { id: 'N0', label: 'N0', name: 'Radicals' },
  { id: 'N5', label: 'N5', name: 'Foundation' },
  { id: 'N4', label: 'N4', name: 'Daily life' },
  { id: 'N3', label: 'N3', name: 'Bridge' },
  { id: 'N2', label: 'N2', name: 'Formal' },
  { id: 'N1', label: 'N1', name: 'Advanced' },
]

const RADICALS: KanjiEntry[] = [
  { char: '一', on: 'イチ', kun: 'ひと', meaning: 'one; horizontal line', strokes: 1, example: '一 (one)', level: 'N5' },
  { char: '丨', on: 'コン', kun: '', meaning: 'vertical line', strokes: 1, example: '中 uses this line shape', level: 'N5' },
  { char: '丶', on: 'チュ', kun: '', meaning: 'dot', strokes: 1, example: '丸 uses a dot shape', level: 'N5' },
  { char: 'ノ', on: '', kun: 'の', meaning: 'slash stroke', strokes: 1, example: '人 starts with this stroke', level: 'N5' },
  { char: '亅', on: 'ケツ', kun: '', meaning: 'hook', strokes: 1, example: '了 uses a hook', level: 'N5' },
  { char: '二', on: 'ニ', kun: 'ふた', meaning: 'two', strokes: 2, example: '二 (two)', level: 'N5' },
  { char: '十', on: 'ジュウ', kun: 'とお', meaning: 'ten; cross', strokes: 2, example: '十 (ten)', level: 'N5' },
  { char: '人', on: 'ジン / ニン', kun: 'ひと', meaning: 'person', strokes: 2, example: '人 (person)', level: 'N5' },
  { char: '口', on: 'コウ', kun: 'くち', meaning: 'mouth; opening', strokes: 3, example: '口 (mouth)', level: 'N5' },
  { char: '日', on: 'ニチ / ジツ', kun: 'ひ', meaning: 'sun; day', strokes: 4, example: '日 (day)', level: 'N5' },
  { char: '月', on: 'ゲツ / ガツ', kun: 'つき', meaning: 'moon; month', strokes: 4, example: '月 (month)', level: 'N5' },
  { char: '木', on: 'モク', kun: 'き', meaning: 'tree; wood', strokes: 4, example: '木 (tree)', level: 'N5' },
]

interface PracticeRecord {
  passes: number
  attempts: number
  bestScore: number
}

type PracticeProgress = Record<string, PracticeRecord>

const emptyRecord = (): PracticeRecord => ({ passes: 0, attempts: 0, bestScore: 0 })

export default function KanjiPractice() {
  const [builtin, setBuiltin] = useState<KanjiEntry[]>([])

  useEffect(() => {
    let active = true
    allKanji().then((kanji) => {
      if (active) setBuiltin(kanji)
    })
    return () => {
      active = false
    }
  }, [])

  const builtinByChar = useMemo(() => new Map([...builtin, ...RADICALS].map((k) => [k.char, k])), [builtin])
  const builtinByLevel = useMemo(() => {
    const m = new Map<KanjiJlptLevel, string[]>()
    for (const k of builtin) {
      if (k.level === 'STARTER') continue
      m.set(k.level, [...(m.get(k.level) ?? []), k.char])
    }
    return m
  }, [builtin])

  const [level, setLevel] = useState<PracticeLevel>('N0')
  const [chars, setChars] = useState<string[]>(RADICALS.map((k) => k.char))
  const [progress, setProgress] = useState<PracticeProgress>(() => loadProgress())
  const [info, setInfo] = useState<KanjiInfo | null>(null)
  const [lastGrade, setLastGrade] = useState<Grade | null>(null)
  const [nonce, setNonce] = useState(0)
  const [quizOpen, setQuizOpen] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    if (level === 'N0') {
      setChars(RADICALS.map((k) => k.char))
      return
    }

    let active = true
    setChars(builtinByLevel.get(level) ?? [])
    fetchJlptKanji(level).then((list) => {
      if (active && list.length) setChars(list)
    })
    return () => {
      active = false
    }
  }, [level, builtinByLevel])

  const activeChar = useMemo(() => chars.find((c) => recordFor(progress, level, c).passes < REQUIRED_PASSES) ?? chars[0] ?? '日', [chars, level, progress])
  const record = recordFor(progress, level, activeChar)
  const stats = summarize(progress, level, chars)
  const levelComplete = chars.length > 0 && stats.complete === chars.length
  const fallback = builtinByChar.get(activeChar)
  const expectedStrokes = info?.strokes || fallback?.strokes || 1
  const reading = firstJapaneseReading(info?.kun) || firstJapaneseReading(info?.on)
  const showReference = record.passes < REFERENCE_PASSES
  const quiz = makeQuiz(chars, builtinByChar)
  const quizComplete = quiz.length > 0 && quiz.every((_, i) => typeof answers[i] === 'number')
  const quizCorrect = quiz.filter((q, i) => answers[i] === q.answer).length

  useEffect(() => {
    const fb = builtinByChar.get(activeChar)
    setInfo(fb ? { char: fb.char, meanings: [fb.meaning], on: [fb.on].filter(Boolean), kun: [fb.kun].filter(Boolean), strokes: fb.strokes, jlpt: null } : null)

    if (level === 'N0') return
    let active = true
    fetchKanjiInfo(activeChar).then((next) => {
      if (active && next) setInfo(next)
    })
    return () => {
      active = false
    }
  }, [activeChar, builtinByChar, level])

  function chooseLevel(next: PracticeLevel) {
    setLevel(next)
    setLastGrade(null)
    setAnswers({})
    setQuizOpen(false)
    setNonce((n) => n + 1)
  }

  function handleGrade(grade: Grade) {
    setLastGrade(grade)
    const passed = isPassingGrade(grade)
    setProgress((prev) => {
      const key = progressKey(level, activeChar)
      const current = prev[key] ?? emptyRecord()
      return {
        ...prev,
        [key]: {
          attempts: current.attempts + 1,
          passes: passed ? Math.min(REQUIRED_PASSES, current.passes + 1) : current.passes,
          bestScore: Math.max(current.bestScore, grade.score),
        },
      }
    })
    if (passed) window.setTimeout(() => setNonce((n) => n + 1), 250)
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="ke-panel p-5 sm:p-6">
        <p className="ke-section-label">Kanji practice</p>
        <h1 className="relative mt-2 text-2xl font-extrabold text-fg-strong sm:text-3xl">Write-to-pass training</h1>
        <p className="relative mt-2 max-w-2xl text-sm leading-6 text-fg-muted">
          Train from radicals to N5 and beyond. Each kanji needs 20 correct writings before the next one unlocks.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="hidden space-y-2 xl:block">
          {LEVELS.map((item, index) => {
            const locked = index > 0 && !isLevelComplete(progress, LEVELS[index - 1].id, builtinByLevel)
            const levelChars = item.id === level ? chars : expectedChars(item.id, builtinByLevel)
            const rowStats = item.id === level ? stats : summarize(progress, item.id, levelChars)
            return (
              <button
                key={item.id}
                disabled={locked}
                onClick={() => chooseLevel(item.id)}
                className={cn(
                  'w-full rounded-xl border bg-bg-card p-3 text-left transition-all',
                  item.id === level ? 'border-accent shadow-card' : 'border-line hover:bg-bg-hover',
                  locked && 'cursor-not-allowed opacity-55',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-fg-strong">{item.label}</p>
                    <p className="text-xs text-fg-muted">{item.name}</p>
                  </div>
                  {locked ? <Lock className="h-4 w-4 text-fg-faint" /> : rowStats.total > 0 && rowStats.complete === rowStats.total ? <CheckCircle2 className="h-4 w-4 text-matcha" /> : null}
                </div>
                <ProgressBar value={rowStats.total ? (rowStats.passes / (rowStats.total * REQUIRED_PASSES)) * 100 : 0} className="mt-3" height="h-1.5" />
                <p className="mt-1 text-[11px] text-fg-faint">{rowStats.complete}/{rowStats.total} complete</p>
              </button>
            )
          })}
        </aside>

        <Card className="order-1 xl:order-none">
          <CardBody className="p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-fg-strong">{info?.meanings.slice(0, 2).join(', ') || 'Practice'}</h2>
                  <SpeakButton text={activeChar} pronunciation={reading} icon />
                </div>
                <p className="text-sm text-fg-muted">
                  {reading || 'reading hidden'} · {expectedStrokes} strokes · {record.passes}/{REQUIRED_PASSES} passes
                </p>
              </div>
              <Badge tone={showReference ? 'amber' : 'brand'}>{showReference ? 'Reference on' : 'Memory mode'}</Badge>
            </div>

            <ProgressBar value={stats.total ? (stats.passes / (stats.total * REQUIRED_PASSES)) * 100 : 0} />

            {levelComplete ? (
              <div className="mt-5 rounded-xl border border-line bg-bg-soft p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-8 place-items-center text-matcha">
                    <Trophy className="h-7 w-7" weight="duotone" />
                  </div>
                  <div>
                    <p className="font-bold text-fg-strong">{level} writing complete</p>
                    <p className="text-sm text-fg-muted">Take the end quiz to check meanings before moving on.</p>
                  </div>
                </div>
                <Button className="mt-4" onClick={() => setQuizOpen(true)}>
                  <BookOpenCheck className="h-4 w-4" /> End quiz
                </Button>
              </div>
            ) : (
              <div className={cn('mt-5 grid justify-center gap-4', showReference ? 'lg:grid-cols-[minmax(0,420px)_minmax(0,420px)]' : 'lg:grid-cols-[minmax(0,420px)]')}>
                {showReference && <PracticeReference char={activeChar} replayKey={record.attempts} />}
                <KanjiCanvas
                  key={`${level}-${activeChar}-${nonce}`}
                  char={activeChar}
                  expectedStrokes={expectedStrokes}
                  onGraded={handleGrade}
                  showGuideDefault={false}
                  allowGuideToggle={false}
                  showStrokeReference={false}
                />
              </div>
            )}

            {lastGrade && !levelComplete && (
              <div className={cn('mt-4 rounded-xl border p-3 text-sm', isPassingGrade(lastGrade) ? 'border-matcha/40 bg-matcha/10 text-matcha' : 'border-coral/35 bg-coral/10 text-coral')}>
                <p className="font-bold">{isPassingGrade(lastGrade) ? 'Pass counted' : 'Not counted yet'}</p>
                <p className="mt-1">
                  Score {lastGrade.score}% · order {Math.round(lastGrade.order * 100)}% · strokes {lastGrade.strokes}/{lastGrade.expectedStrokes}
                </p>
              </div>
            )}

            {quizOpen && (
              <QuizPanel
                quiz={quiz}
                answers={answers}
                setAnswers={setAnswers}
                correct={quizCorrect}
                complete={quizComplete}
                onClose={() => setQuizOpen(false)}
              />
            )}
          </CardBody>
        </Card>

        <Card className="order-2 xl:order-none">
          <CardBody className="p-4">
            <p className="text-sm font-bold text-fg-strong">Current tracker</p>
            <ProgressBar value={(record.passes / REQUIRED_PASSES) * 100} className="mt-3" />
            <p className="mt-2 text-xs text-fg-muted">
              {record.passes}/{REQUIRED_PASSES} passes · {record.attempts} attempts · best {record.bestScore}%
            </p>

            <div className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
              <TrackerRow label="Stroke count" value="Exact" />
              <TrackerRow label="Stroke order" value="65%+" />
              <TrackerRow label="Neatness" value="80% score" />
              <TrackerRow label="Reference" value="First 5 passes" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function TrackerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-fg-faint">{label}</span>
      <span className="text-right font-semibold text-fg-strong">{value}</span>
    </div>
  )
}

function PracticeReference({ char, replayKey }: { char: string; replayKey: number }) {
  const [strokeData, setStrokeData] = useState<{ paths: string[]; viewBox: number } | null>(() => {
    const builtin = strokePathsFor(char)
    return builtin ? { paths: builtin, viewBox: 100 } : null
  })

  useEffect(() => {
    const builtin = strokePathsFor(char)
    setStrokeData(builtin ? { paths: builtin, viewBox: 100 } : null)

    let active = true
    loadKanjiVgPaths(char).then((paths) => {
      if (active && paths?.length) setStrokeData({ paths, viewBox: KANJIVG_VIEWBOX })
    })
    return () => {
      active = false
    }
  }, [char])

  return (
    <div className="w-full">
      <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl border border-line bg-bg-card">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-line/70" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-line/70" />
        </div>
        {strokeData ? (
          <svg
            key={`${char}-${replayKey}-${strokeData.viewBox}-${strokeData.paths.length}`}
            viewBox={`0 0 ${strokeData.viewBox} ${strokeData.viewBox}`}
            className="absolute inset-0 h-full w-full"
          >
            {strokeData.paths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgb(var(--accent-fg))"
                strokeWidth={strokeData.viewBox > 100 ? 4 : 4.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="1"
                  to="0"
                  dur="1.45s"
                  begin={`${0.35 + i * 1.65}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.2 0 0.15 1"
                />
              </path>
            ))}
          </svg>
        ) : (
          <div className="grid h-full place-items-center text-xs text-fg-faint">Reference unavailable</div>
        )}
      </div>
      <p className="mt-2 text-center text-xs font-semibold text-fg-muted">Reference</p>
    </div>
  )
}

interface QuizQuestion {
  prompt: string
  choices: string[]
  answer: number
}

function QuizPanel({
  quiz,
  answers,
  setAnswers,
  correct,
  complete,
  onClose,
}: {
  quiz: QuizQuestion[]
  answers: Record<number, number>
  setAnswers: Dispatch<SetStateAction<Record<number, number>>>
  correct: number
  complete: boolean
  onClose: () => void
}) {
  return (
    <div className="mt-5 rounded-xl border border-line bg-bg-soft p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-fg-strong">End quiz</p>
          <p className="text-xs text-fg-muted">{correct}/{quiz.length} correct</p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
      </div>
      <div className="mt-4 space-y-3">
        {quiz.map((q, qi) => (
          <div key={q.prompt} className="rounded-lg bg-bg-card p-3">
            <p className="text-sm font-semibold text-fg-strong">{q.prompt}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {q.choices.map((choice, ci) => (
                <button
                  key={choice}
                  onClick={() => setAnswers((prev) => ({ ...prev, [qi]: ci }))}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left text-sm transition-all',
                    answers[qi] === ci ? 'border-accent bg-accent/10 text-accent-fg' : 'border-line bg-bg-soft text-fg hover:bg-bg-hover',
                  )}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {complete && (
        <div className={cn('mt-4 rounded-lg p-3 text-sm font-semibold', correct === quiz.length ? 'bg-matcha/10 text-matcha' : 'bg-amber/10 text-amber')}>
          {correct === quiz.length ? 'Quiz passed.' : 'Some answers are still wrong.'}
        </div>
      )}
    </div>
  )
}

function loadProgress(): PracticeProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PracticeProgress) : {}
  } catch {
    return {}
  }
}

function progressKey(level: PracticeLevel, char: string) {
  return `${level}:${char}`
}

function recordFor(progress: PracticeProgress, level: PracticeLevel, char: string): PracticeRecord {
  return progress[progressKey(level, char)] ?? emptyRecord()
}

function summarize(progress: PracticeProgress, level: PracticeLevel, chars: string[]) {
  return chars.reduce(
    (acc, char) => {
      const record = recordFor(progress, level, char)
      acc.passes += Math.min(REQUIRED_PASSES, record.passes)
      if (record.passes >= REQUIRED_PASSES) acc.complete += 1
      return acc
    },
    { passes: 0, complete: 0, total: chars.length },
  )
}

function expectedChars(level: PracticeLevel, builtinByLevel: Map<KanjiJlptLevel, string[]>): string[] {
  if (level === 'N0') return RADICALS.map((k) => k.char)
  return builtinByLevel.get(level) ?? []
}

function isLevelComplete(progress: PracticeProgress, level: PracticeLevel, builtinByLevel: Map<KanjiJlptLevel, string[]>): boolean {
  const stats = summarize(progress, level, expectedChars(level, builtinByLevel))
  return stats.total > 0 && stats.complete === stats.total
}

function isPassingGrade(g: Grade): boolean {
  return g.score >= 80 && g.strokes === g.expectedStrokes && g.order >= 0.65 && g.precision >= 0.5
}

function makeQuiz(chars: string[], byChar: Map<string, KanjiEntry>): QuizQuestion[] {
  const entries = chars.map((c) => byChar.get(c)).filter((k): k is KanjiEntry => !!k).slice(0, 8)
  const meanings = entries.map((e) => e.meaning)
  return entries.slice(0, 5).map((entry, index) => {
    const choices = rotate([entry.meaning, ...meanings.filter((m) => m !== entry.meaning).slice(0, 3)], index)
    return {
      prompt: `What does ${entry.char} mean?`,
      choices,
      answer: choices.indexOf(entry.meaning),
    }
  })
}

function rotate<T>(items: T[], amount: number): T[] {
  if (!items.length) return items
  const shift = amount % items.length
  return [...items.slice(shift), ...items.slice(0, shift)]
}
