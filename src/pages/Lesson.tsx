import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowCounterClockwise as RotateCcw, CaretRight as ChevronRight, Check, Trophy, X } from '@phosphor-icons/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SpeakButton } from '@/components/ui/SpeakButton'
import { getLevel, SECTION_META, SECTION_ORDER, lessonTitle, lessonDescription, type SectionId } from '@/data/courses'
import { getLessonDef, getLessonItems, type LessonDef, type StudyItem } from '@/data/content'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'
import { primaryJapaneseReading } from '@/lib/japaneseSpeech'

export default function Lesson() {
  const { level = '', section = '', lesson = '0' } = useParams()
  const navigate = useNavigate()

  const course = getLevel(level)
  const sectionId = SECTION_ORDER.includes(section as SectionId) ? (section as SectionId) : undefined
  const lessonIndex = Number.parseInt(lesson, 10) || 0

  const [items, setItems] = useState<StudyItem[]>([])
  const [lessonDef, setLessonDef] = useState<LessonDef | undefined>()
  const [loading, setLoading] = useState(true)

  const { setUser } = useAuth()
  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setItems([])
    setLessonDef(undefined)
    setStep(0)
    setRevealed(false)
    setPicked(null)
    setCorrect(0)
    setDone(false)

    if (!course || !sectionId) {
      setLoading(false)
      return
    }

    Promise.all([
      getLessonItems(course.level, sectionId, lessonIndex),
      getLessonDef(course.level, sectionId, lessonIndex),
    ])
      .then(([nextItems, nextDef]) => {
        if (!active) return
        setItems(nextItems)
        setLessonDef(nextDef)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [course, sectionId, lessonIndex])

  if (loading) {
    return (
      <div className="animate-fade-up">
        <Card className="p-10 text-center">
          <p className="text-sm text-fg-muted">Loading lesson...</p>
        </Card>
      </div>
    )
  }

  if (!course || !sectionId || items.length === 0) {
    return (
      <div className="animate-fade-up">
        <Card className="p-10 text-center">
          <p className="text-sm text-fg-muted">This lesson could not be found.</p>
          <Link to="/courses" className="mt-3 inline-block text-sm font-semibold text-accent-fg">
            Back to courses
          </Link>
        </Card>
      </div>
    )
  }

  const item = items[step]
  const total = items.length
  const backHref = `/courses/${course.level.toLowerCase()}`

  function advance(gotIt: boolean) {
    const nextCorrect = correct + (gotIt ? 1 : 0)
    if (gotIt) setCorrect(nextCorrect)
    if (step + 1 >= total) {
      setDone(true)
      if (course && sectionId) {
        api
          .completeLesson({
            level: course.level,
            section: sectionId,
            lessonIndex,
            correct: nextCorrect,
            total,
          })
          .then(({ user }) => setUser(user))
          .catch(() => undefined)
      }
    } else {
      setStep((s) => s + 1)
      setRevealed(false)
      setPicked(null)
    }
  }

  function restart() {
    setStep(0)
    setRevealed(false)
    setPicked(null)
    setCorrect(0)
    setDone(false)
  }

  if (done) {
    const accuracy = Math.round((correct / total) * 100)
    const xp = 20 + correct * 8
    return (
      <div className="mx-auto max-w-md animate-fade-up">
        <Card className="p-8 text-center">
          <div className="ke-watermark -right-5 -top-8 text-[7rem]">完</div>
          <div className="mx-auto grid h-20 w-10 place-items-center text-accent-fg animate-pop">
            <Trophy className="h-11 w-11" weight="duotone" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-fg-strong">Lesson complete!</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {course.level} - {SECTION_META[sectionId].name}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <SummaryStat label="XP" value={`+${xp}`} />
            <SummaryStat label="Accuracy" value={`${accuracy}%`} />
            <SummaryStat label="Correct" value={`${correct}/${total}`} />
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={restart}>
              <RotateCcw className="h-4 w-4" /> Retry
            </Button>
            <Button className="flex-1" onClick={() => navigate(backHref)}>
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isQuiz = item.kind === 'quiz'

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <div className="mb-5 flex items-center gap-3">
        <button
          aria-label="Exit lesson"
          onClick={() => navigate(backHref)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-fg-muted hover:bg-bg-hover hover:text-fg"
        >
          <X className="h-5 w-5" />
        </button>
        <ProgressBar value={((step + (revealed || picked !== null ? 1 : 0)) / total) * 100} className="flex-1" />
        <span className="shrink-0 text-sm font-semibold text-fg-muted">
          {step + 1}/{total}
        </span>
      </div>

      <div className="mb-4 space-y-3">
        <div>
          <h1 className="text-lg font-extrabold text-fg-strong">
            {course.level} - {lessonTitle(course.level, sectionId, lessonIndex)}
          </h1>
          <p className="text-sm text-fg-muted">{lessonDescription(course.level, sectionId, lessonIndex)}</p>
        </div>

        {(lessonDef?.mission || lessonDef?.canDo) && (
          <div className="grid gap-2 rounded-2xl border border-line bg-bg-card p-3 sm:grid-cols-2">
            {lessonDef.mission && <ContextBlock label="Mission" value={lessonDef.mission} />}
            {lessonDef.canDo && <ContextBlock label="Can-do" value={lessonDef.canDo} />}
          </div>
        )}
      </div>

      <Card className="p-6 sm:p-8">
        <div className="ke-watermark -right-5 -top-8 text-[7rem]">練</div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="brand">{SECTION_META[sectionId].name}</Badge>
          <Badge tone="neutral">Step {step + 1}</Badge>
        </div>

        {item.kind === 'vocab' && <VocabCard item={item} revealed={revealed} />}
        {item.kind === 'kanji' && <KanjiCard item={item} revealed={revealed} />}
        {item.kind === 'grammar' && <GrammarCard item={item} revealed={revealed} />}
        {item.kind === 'info' && <InfoCard item={item} />}
        {item.kind === 'quiz' && <QuizCard item={item} picked={picked} onPick={setPicked} />}
      </Card>

      <div className="mt-5">
        {item.kind === 'info' ? (
          <Button className="w-full" size="lg" onClick={() => advance(true)}>
            Continue <ChevronRight className="h-4 w-4" />
          </Button>
        ) : !isQuiz && !revealed ? (
          <Button className="w-full" size="lg" onClick={() => setRevealed(true)}>
            Reveal answer
          </Button>
        ) : !isQuiz && revealed ? (
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => advance(false)}>
              <RotateCcw className="h-4 w-4" /> Again
            </Button>
            <Button size="lg" className="flex-1" onClick={() => advance(true)}>
              <Check className="h-4 w-4" /> Got it
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            size="lg"
            disabled={picked === null}
            onClick={() => advance(item.kind === 'quiz' && picked === item.answer)}
          >
            {step + 1 >= total ? 'Finish' : 'Next'} <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg-soft p-3 ring-1 ring-inset ring-line/60">
      <p className="text-xl font-extrabold text-fg-strong">{value}</p>
      <p className="text-[11px] text-fg-faint">{label}</p>
    </div>
  )
}

function ContextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg-soft p-3 ring-1 ring-inset ring-line/60">
      <p className="text-[11px] font-bold uppercase tracking-wide text-fg-faint">{label}</p>
      <p className="mt-1 text-sm leading-snug text-fg">{value}</p>
    </div>
  )
}

function DetailTile({ label, value, speakText }: { label: string; value?: string | number; speakText?: string }) {
  if (!value) return null
  return (
    <div className="rounded-xl bg-bg-soft p-3">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-fg-faint">{label}</dt>
      <dd className="mt-1 flex items-center gap-1.5 font-jp text-sm text-fg-strong">
        <span>{value}</span>
        {speakText && <SpeakButton text={String(value)} pronunciation={speakText} icon className="h-7 w-7" />}
      </dd>
    </div>
  )
}

function VocabCard({ item, revealed }: { item: Extract<StudyItem, { kind: 'vocab' }>; revealed: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2">
        <p className="font-jp text-5xl font-bold text-fg-strong sm:text-6xl">{item.front}</p>
        <SpeakButton text={item.front} pronunciation={primaryJapaneseReading(item.reading)} label={item.reading} icon />
      </div>
      <p className="mt-2 text-sm text-fg-faint">{item.reading}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {item.partOfSpeech && <Badge tone="neutral">{item.partOfSpeech}</Badge>}
        {item.pitch && <Badge tone="amber">Pitch {item.pitch}</Badge>}
      </div>

      {revealed && (
        <div className="mt-6 animate-fade-up border-t border-line pt-6">
          <p className="text-2xl font-bold text-accent-fg">{item.meaning}</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <p className="font-jp text-lg text-fg">{item.example}</p>
            <SpeakButton text={item.example} icon />
          </div>
          <p className="mt-1 text-sm text-fg-muted">{item.exampleEn}</p>
        </div>
      )}
    </div>
  )
}

function InfoCard({ item }: { item: Extract<StudyItem, { kind: 'info' }> }) {
  return (
    <article>
      <h2 className="text-2xl font-extrabold text-fg-strong">{item.title}</h2>
      <p className="mt-3 text-sm leading-6 text-fg-muted">{item.body}</p>
      <ul className="mt-5 space-y-3">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 rounded-xl bg-bg-soft p-3 text-sm leading-6 text-fg ring-1 ring-inset ring-line/60">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function KanjiCard({ item, revealed }: { item: Extract<StudyItem, { kind: 'kanji' }>; revealed: boolean }) {
  const onReading = primaryJapaneseReading(item.on)
  const kunReading = primaryJapaneseReading(item.kun)
  const mainReading = kunReading || onReading

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3">
        <p className="font-jp text-7xl font-bold text-fg-strong sm:text-8xl">{item.char}</p>
        <SpeakButton text={item.char} pronunciation={mainReading} icon />
      </div>

      {revealed && (
        <div className="mt-6 animate-fade-up border-t border-line pt-6 text-left">
          <p className="text-center text-xl font-bold text-accent-fg">{item.meaning}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <DetailTile label="On'yomi" value={item.on} speakText={onReading} />
            <DetailTile label="Kun'yomi" value={item.kun} speakText={kunReading} />
            <DetailTile label="Strokes" value={item.strokes} />
            <div className="flex items-center justify-between rounded-xl bg-bg-soft p-3">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-fg-faint">Example</dt>
                <dd className="font-jp text-fg-strong">{item.example}</dd>
              </div>
              <SpeakButton text={item.example} icon />
            </div>
          </dl>

          {item.mnemonic && (
            <div className="mt-4 rounded-xl bg-accent/10 p-3 text-sm text-fg">
              <p className="text-[11px] font-bold uppercase tracking-wide text-accent-fg">Mnemonic</p>
              <p className="mt-1">{item.mnemonic}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GrammarCard({ item, revealed }: { item: Extract<StudyItem, { kind: 'grammar' }>; revealed: boolean }) {
  return (
    <div className="text-center">
      <p className="font-jp text-3xl font-bold text-fg-strong sm:text-4xl">{item.pattern}</p>
      {revealed && (
        <div className="mt-6 animate-fade-up border-t border-line pt-6 text-left">
          <p className="text-center text-lg font-bold text-accent-fg">{item.meaning}</p>
          <p className="mt-4 rounded-xl bg-bg-soft p-3 text-center text-sm text-fg">{item.structure}</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <p className="font-jp text-lg text-fg">{item.example}</p>
            <SpeakButton text={item.example} icon />
          </div>
          <p className="mt-1 text-center text-sm text-fg-muted">{item.exampleEn}</p>
          {item.note && (
            <div className="mt-4 rounded-xl bg-amber/10 p-3 text-sm text-fg">
              <p className="text-[11px] font-bold uppercase tracking-wide text-amber">Note</p>
              <p className="mt-1">{item.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function QuizCard({
  item,
  picked,
  onPick,
}: {
  item: Extract<StudyItem, { kind: 'quiz' }>
  picked: number | null
  onPick: (i: number) => void
}) {
  const answered = picked !== null
  return (
    <div>
      {item.skill && (
        <Badge
          tone={item.skill === 'listening' ? 'sakura' : item.skill === 'reading' ? 'matcha' : 'brand'}
          className="mb-3 capitalize"
        >
          {item.skill}
        </Badge>
      )}
      {item.passage && (
        <div className="mb-4 rounded-xl bg-bg-soft p-4 ring-1 ring-inset ring-line/60">
          <div className="flex items-start justify-between gap-3">
            <p className="font-jp text-base leading-relaxed text-fg">{item.passage}</p>
            {item.skill === 'listening' && <SpeakButton text={item.passage} icon />}
          </div>
        </div>
      )}
      <p className="text-base font-semibold text-fg-strong">{item.prompt}</p>

      <div className="mt-4 space-y-2">
        {item.choices.map((choice, i) => {
          const isAnswer = i === item.answer
          const isPicked = i === picked
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => onPick(i)}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left text-sm transition-all',
                !answered && 'border-line bg-bg-soft hover:bg-bg-hover',
                answered && isAnswer && 'border-matcha/50 bg-matcha/10 text-fg-strong',
                answered && isPicked && !isAnswer && 'border-coral/50 bg-coral/10 text-fg-strong',
                answered && !isAnswer && !isPicked && 'border-line bg-bg-soft opacity-60',
              )}
            >
              <span className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-bg-card text-xs font-extrabold text-fg-muted">
                  {i + 1}
                </span>
                <span className="font-jp">{choice}</span>
              </span>
              {answered && isAnswer && <Check className="h-4 w-4 text-matcha" />}
              {answered && isPicked && !isAnswer && <X className="h-4 w-4 text-coral" />}
            </button>
          )
        })}
      </div>

      {answered && (
        <p className="mt-4 animate-fade-up rounded-xl bg-bg-soft p-3 text-sm text-fg-muted">
          <span className={cn('font-semibold', picked === item.answer ? 'text-matcha' : 'text-coral')}>
            {picked === item.answer ? 'Correct. ' : 'Not quite. '}
          </span>
          {item.explain}
        </p>
      )}
    </div>
  )
}
