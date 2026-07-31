import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowClockwise, Check, Headphones, X } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SpeakButton } from '@/components/ui/SpeakButton'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import {
  buildAdaptiveSession,
  type AdaptiveSession,
  type Confidence,
  type SessionStep,
  type StudyDuration,
} from '@/lib/adaptiveSession'
import { cn } from '@/lib/cn'

type AnswerRecord = {
  stepId: string
  skill: SessionStep['skill']
  correct: boolean
  confidence: Confidence
}

const CONFIDENCE: { id: Confidence; label: string; weight: number }[] = [
  { id: 'easy', label: 'Easy', weight: 1 },
  { id: 'okay', label: 'Okay', weight: 0.8 },
  { id: 'difficult', label: 'Difficult', weight: 0.45 },
  { id: 'guess', label: 'Guess', weight: 0.2 },
]

export default function TodaySession() {
  const { user, setUser } = useAuth()
  const [params, setParams] = useSearchParams()
  const duration = parseDuration(params.get('duration'))
  const completed = user?.progress.completedLessons ?? {}
  const target = user?.jlptTarget ?? 'N5'

  const [session, setSession] = useState<AdaptiveSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [confidenceOpen, setConfidenceOpen] = useState(false)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    buildAdaptiveSession(completed, duration, target).then((next) => {
      if (!active) return
      setSession(next)
      setStepIndex(0)
      setPicked(null)
      setChecked(false)
      setConfidenceOpen(false)
      setAnswers([])
      setComplete(false)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [completed, duration, target])

  const step = session?.steps[stepIndex]
  const needsAnswer = typeof step?.answer === 'number' && Array.isArray(step.choices)
  const correct = needsAnswer && picked === step?.answer
  const progress = session ? Math.round((stepIndex / Math.max(1, session.steps.length)) * 100) : 0
  const analysis = useMemo(() => analyze(answers), [answers])

  function chooseDuration(next: StudyDuration) {
    setParams({ duration: String(next) })
  }

  function advanceWithoutAnswer() {
    advance()
  }

  function checkAnswer() {
    if (!needsAnswer || picked === null) return
    setChecked(true)
    setConfidenceOpen(true)
  }

  function recordConfidence(confidence: Confidence) {
    if (!step || !needsAnswer) return
    const nextAnswers = [...answers, { stepId: step.id, skill: step.skill, correct: Boolean(correct), confidence }]
    setAnswers(nextAnswers)
    setConfidenceOpen(false)
    advance(nextAnswers)
  }

  function advance(nextAnswers = answers) {
    setPicked(null)
    setChecked(false)
    setConfidenceOpen(false)
    if (!session || stepIndex + 1 >= session.steps.length) {
      finish(nextAnswers)
      return
    }
    setStepIndex((i) => i + 1)
  }

  function finish(finalAnswers = answers) {
    setComplete(true)
    if (!session) return
    const correctCount = finalAnswers.filter((answer) => answer.correct).length
    const total = Math.max(1, finalAnswers.length)
    api
      .completeLesson({
        level: session.source.level,
        section: session.source.section,
        lessonIndex: session.source.lessonIndex,
        correct: correctCount,
        total,
      })
      .then(({ user }) => setUser(user))
      .catch(() => undefined)
  }

  if (loading || !session || !step) {
    return (
      <div className="mx-auto max-w-xl animate-fade-up">
        <Card>
          <CardBody className="p-8 text-center">
            <p className="text-sm font-semibold text-fg-strong">Building today&apos;s course...</p>
            <p className="mt-2 text-sm text-fg-muted">Choosing review, new material, and mixed recall.</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  if (complete) {
    return <SessionAnalysis analysis={analysis} duration={duration} level={session.level} onRestart={() => window.location.reload()} />
  }

  const phase = session.phases.find((p) => p.id === step.phase)

  return (
    <div className="mx-auto max-w-2xl animate-fade-up space-y-4">
      <div className="ke-panel p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="ke-section-label">Today&apos;s Course</p>
            <h1 className="mt-1 text-xl font-extrabold text-fg-strong">{session.level} adaptive session</h1>
            <p className="mt-1 text-sm text-fg-muted">{phase?.objective}</p>
          </div>
          <div className="flex gap-1 rounded-xl bg-bg-soft p-1">
            {[15, 20, 30].map((minutes) => (
              <button
                key={minutes}
                onClick={() => chooseDuration(minutes as StudyDuration)}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-xs font-bold',
                  duration === minutes ? 'bg-accent text-accent-on' : 'text-fg-muted hover:bg-bg-hover',
                )}
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={progress} className="flex-1" />
          <span className="text-xs font-semibold text-fg-muted">
            {stepIndex + 1}/{session.steps.length}
          </span>
        </div>
      </div>

      <Card>
        <CardBody className="p-5 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge tone={step.phase === 'listening' ? 'sakura' : step.phase === 'reading' ? 'matcha' : 'brand'}>
              {step.title}
            </Badge>
            <Badge tone="neutral">{step.skill}</Badge>
          </div>

          <SessionContent step={step} />

          {step.item?.kind === 'quiz' && step.item.passage && (
            <div className="mt-4 rounded-xl bg-bg-soft p-4 ring-1 ring-inset ring-line/60">
              <div className="flex items-start justify-between gap-3">
                <p className="font-jp text-base leading-relaxed text-fg">{step.item.passage}</p>
                {step.item.skill === 'listening' && <SpeakButton text={step.item.passage} icon />}
              </div>
            </div>
          )}

          <p className="mt-5 whitespace-pre-line text-base font-semibold leading-7 text-fg-strong">{step.prompt}</p>

          {step.choices && (
            <div className="mt-4 space-y-2">
              {step.choices.map((choice, index) => {
                const isAnswer = checked && index === step.answer
                const isWrongPick = checked && picked === index && index !== step.answer
                return (
                  <button
                    key={`${choice}-${index}`}
                    disabled={checked}
                    onClick={() => setPicked(index)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left text-sm transition-all',
                      !checked && picked === index && 'border-accent bg-accent/10',
                      !checked && picked !== index && 'border-line bg-bg-soft hover:bg-bg-hover',
                      isAnswer && 'border-matcha/50 bg-matcha/10',
                      isWrongPick && 'border-coral/50 bg-coral/10',
                      checked && !isAnswer && !isWrongPick && 'border-line bg-bg-soft opacity-60',
                    )}
                  >
                    <span className="font-jp">{choice}</span>
                    {isAnswer && <Check className="h-4 w-4 text-matcha" />}
                    {isWrongPick && <X className="h-4 w-4 text-coral" />}
                  </button>
                )
              })}
            </div>
          )}

          {checked && step.explain && (
            <p className="mt-4 rounded-xl bg-bg-soft p-3 text-sm leading-6 text-fg-muted">{step.explain}</p>
          )}

          {confidenceOpen && (
            <div className="mt-5 rounded-xl border border-line bg-bg-soft p-3">
              <p className="text-sm font-bold text-fg-strong">How confident were you?</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CONFIDENCE.map((option) => (
                  <Button key={option.id} variant="outline" onClick={() => recordConfidence(option.id)}>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="flex gap-3">
        <div className="hidden flex-1 rounded-xl bg-bg-card p-3 text-xs leading-5 text-fg-muted ring-1 ring-inset ring-line sm:block">
          <span className="font-bold text-fg-strong">Why this now: </span>
          {phase?.psychology}
        </div>
        {needsAnswer ? (
          <Button className="ml-auto min-w-32" disabled={picked === null || confidenceOpen} onClick={checked ? advance : checkAnswer}>
            {checked ? 'Continue' : step.actionLabel}
          </Button>
        ) : (
          <Button className="ml-auto min-w-32" onClick={advanceWithoutAnswer}>
            {step.actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

function SessionContent({ step }: { step: SessionStep }) {
  const item = step.item
  if (!item) return null

  if (item.kind === 'kanji') {
    return (
      <div className="flex items-center justify-center gap-4">
        <p className="font-jp text-7xl font-bold text-fg-strong">{item.char}</p>
        <div className="text-sm text-fg-muted">
          <p className="font-bold text-fg-strong">{item.meaning}</p>
          <p>ON {item.on || '-'}</p>
          <p>KUN {item.kun || '-'}</p>
          <p className="mt-2 font-jp">{item.example}</p>
        </div>
      </div>
    )
  }

  if (item.kind === 'vocab') {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <p className="font-jp text-5xl font-bold text-fg-strong">{item.front}</p>
          <SpeakButton text={item.front} pronunciation={item.reading} icon />
        </div>
        <p className="mt-2 text-sm text-fg-muted">{item.reading} - {item.meaning}</p>
      </div>
    )
  }

  if (item.kind === 'grammar') {
    return (
      <div className="rounded-xl bg-bg-soft p-4">
        <p className="font-jp text-2xl font-bold text-fg-strong">{item.example}</p>
        <p className="mt-2 text-sm text-fg-muted">{item.exampleEn}</p>
      </div>
    )
  }

  if (step.phase === 'listening') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-bg-soft p-4">
        <Headphones className="h-6 w-6 text-sakura" />
        <p className="text-sm font-semibold text-fg-strong">Listen first. Replay only after your first attempt.</p>
      </div>
    )
  }

  return null
}

function SessionAnalysis({
  analysis,
  duration,
  level,
  onRestart,
}: {
  analysis: ReturnType<typeof analyze>
  duration: StudyDuration
  level: string
  onRestart: () => void
}) {
  return (
    <div className="mx-auto max-w-2xl animate-fade-up space-y-4">
      <div className="ke-panel p-5 sm:p-6">
        <p className="ke-section-label">AI Analysis</p>
        <h1 className="mt-1 text-2xl font-extrabold text-fg-strong">{level} session complete</h1>
        <p className="mt-2 text-sm text-fg-muted">
          {duration} minutes planned. Mastery uses correctness plus confidence, so guesses do not count as full retention.
        </p>
      </div>

      <Card>
        <CardBody className="space-y-4 p-5 sm:p-6">
          {analysis.skills.map((skill) => (
            <div key={skill.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-semibold text-fg-strong">{skill.label}</span>
                <span className="font-bold text-fg-muted">{skill.score}%</span>
              </div>
              <ProgressBar value={skill.score} barClassName={skill.score >= 80 ? 'bg-matcha' : skill.score >= 55 ? 'bg-amber' : 'bg-coral'} />
            </div>
          ))}

          <div className="rounded-xl bg-bg-soft p-4">
            <p className="text-sm font-bold text-fg-strong">Tomorrow&apos;s priority</p>
            <p className="mt-1 text-sm leading-6 text-fg-muted">{analysis.recommendation}</p>
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-3">
        <Link to="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full">Dashboard</Button>
        </Link>
        <Button className="flex-1" onClick={onRestart}>
          <ArrowClockwise className="h-4 w-4" /> Repeat session
        </Button>
      </div>
    </div>
  )
}

function parseDuration(value: string | null): StudyDuration {
  return value === '20' || value === '30' ? Number(value) as StudyDuration : 15
}

function analyze(answers: AnswerRecord[]) {
  const labels: Record<SessionStep['skill'], string> = {
    kanji: 'Kanji Recognition',
    vocab: 'Vocabulary',
    grammar: 'Grammar',
    listening: 'Listening',
    reading: 'Reading',
    writing: 'Production',
    meta: 'Learning Strategy',
  }
  const bySkill = new Map<SessionStep['skill'], AnswerRecord[]>()
  for (const answer of answers) bySkill.set(answer.skill, [...(bySkill.get(answer.skill) ?? []), answer])
  const skills = [...bySkill.entries()].map(([skill, rows]) => {
    const raw = rows.reduce((sum, row) => {
      const confidence = CONFIDENCE.find((option) => option.id === row.confidence)?.weight ?? 0.5
      return sum + (row.correct ? confidence : 0)
    }, 0)
    return { label: labels[skill], score: Math.round((raw / rows.length) * 100) }
  })
  const weakest = skills.length ? [...skills].sort((a, b) => a.score - b.score)[0] : undefined
  return {
    skills,
    recommendation: weakest
      ? `Review ${weakest.label.toLowerCase()} first. Items answered with low confidence should return in spaced review before new content.`
      : 'No retrieval answers were recorded. Tomorrow should start with active recall before adding new content.',
  }
}
