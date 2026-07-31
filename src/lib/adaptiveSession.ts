import { getLessonItems, lessonMeta, type StudyItem } from '@/data/content'
import {
  JLPT_SECTION_ORDER,
  STARTER_SECTION_ORDER,
  lessonCount,
  lessonKey,
  type CourseLevelId,
  type SectionId,
} from '@/data/courses'
import { activeLevel, type Completed } from '@/lib/progress'

export type StudyDuration = 15 | 20 | 30
export type Confidence = 'easy' | 'okay' | 'difficult' | 'guess'

export type SessionPhaseId =
  | 'preview'
  | 'guided'
  | 'active-recall'
  | 'semantic-expansion'
  | 'contextual-grammar'
  | 'production'
  | 'listening'
  | 'reading'
  | 'mixed-recall'
  | 'confidence'
  | 'analysis'

export interface SessionPhase {
  id: SessionPhaseId
  label: string
  objective: string
  psychology: string
  exitCondition: string
}

export interface SessionSource {
  level: CourseLevelId
  section: SectionId
  lessonIndex: number
}

export interface SessionStep {
  id: string
  phase: SessionPhaseId
  title: string
  prompt: string
  actionLabel: string
  item?: StudyItem
  choices?: string[]
  answer?: number
  explain?: string
  source?: SessionSource
  skill: 'kanji' | 'vocab' | 'grammar' | 'listening' | 'reading' | 'writing' | 'meta'
}

export interface AdaptiveSession {
  level: CourseLevelId
  duration: StudyDuration
  source: SessionSource
  phases: SessionPhase[]
  steps: SessionStep[]
}

const PHASES: SessionPhase[] = [
  {
    id: 'preview',
    label: 'Preview',
    objective: "Prime today's kanji, words, and patterns quickly.",
    psychology: 'Priming reduces later cognitive load without pretending exposure equals mastery.',
    exitCondition: 'Learner has seen and heard the targets once.',
  },
  {
    id: 'guided',
    label: 'Guided Learning',
    objective: 'Teach one concept at a time with compact examples.',
    psychology: 'Comprehensible input and focused attention keep the new load small.',
    exitCondition: 'Learner can identify the meaning or role of the concept.',
  },
  {
    id: 'active-recall',
    label: 'Active Recall',
    objective: 'Retrieve the new concept immediately.',
    psychology: 'Retrieval practice strengthens memory more than rereading.',
    exitCondition: 'Learner attempts a recognition or meaning question.',
  },
  {
    id: 'semantic-expansion',
    label: 'Semantic Expansion',
    objective: 'Connect the target to related words or known context.',
    psychology: 'Elaboration creates more retrieval paths than isolated memorization.',
    exitCondition: 'Learner sees the concept in a small relationship chain.',
  },
  {
    id: 'contextual-grammar',
    label: 'Contextual Grammar',
    objective: 'Observe grammar inside a sentence before explanation.',
    psychology: 'Noticing before explanation improves pattern discovery.',
    exitCondition: 'Learner identifies what changed or what the pattern does.',
  },
  {
    id: 'production',
    label: 'Production',
    objective: 'Generate Japanese through ordering, blanks, or short translation.',
    psychology: 'The generation effect makes recall harder and more durable.',
    exitCondition: 'Learner produces or completes Japanese, not only recognizes it.',
  },
  {
    id: 'listening',
    label: 'Listening',
    objective: "Hear today's vocabulary and grammar in a short audio-style prompt.",
    psychology: 'Audio-first recall builds the memory path needed for JLPT listening.',
    exitCondition: 'Learner answers before relying on replay.',
  },
  {
    id: 'reading',
    label: 'Reading',
    objective: "Read a short passage using today's targets.",
    psychology: 'Context-based reading transfers isolated knowledge into comprehension.',
    exitCondition: 'Learner answers a concrete information question.',
  },
  {
    id: 'mixed-recall',
    label: 'Mixed Recall',
    objective: 'Interleave vocabulary, grammar, kanji, reading, and listening.',
    psychology: 'Interleaving prevents category cues from doing the work for the learner.',
    exitCondition: 'Learner completes a mixed retrieval block.',
  },
  {
    id: 'confidence',
    label: 'Confidence',
    objective: 'Capture whether recall was solid, weak, or guessed.',
    psychology: 'Confidence-based assessment prevents lucky answers from counting as mastery.',
    exitCondition: 'Learner marks Easy, Okay, Difficult, or Guess.',
  },
  {
    id: 'analysis',
    label: 'AI Analysis',
    objective: 'Summarize weak areas and decide what should return next.',
    psychology: 'Error-based learning turns mistakes into the next review plan.',
    exitCondition: 'Session result is saved and tomorrow can be prioritized.',
  },
]

export async function buildAdaptiveSession(
  completed: Completed,
  duration: StudyDuration,
  target: CourseLevelId = 'N5',
): Promise<AdaptiveSession> {
  const level = activeLevel(completed)?.level ?? target
  const source = firstIncompleteSource(level, completed) ?? { level, section: level === 'STARTER' ? 'orientation' : 'overview', lessonIndex: 0 }
  const sectionSources = candidateSources(level, completed)
  const loaded = await Promise.all(
    sectionSources.map(async (src) => ({
      source: src,
      items: await getLessonItems(src.level, src.section, src.lessonIndex),
      meta: lessonMeta(src.level, src.section, src.lessonIndex),
    })),
  )

  const byKind = {
    kanji: loaded.flatMap((l) => l.items.filter((item) => item.kind === 'kanji').map((item) => ({ item, source: l.source }))),
    vocab: loaded.flatMap((l) => l.items.filter((item) => item.kind === 'vocab').map((item) => ({ item, source: l.source }))),
    grammar: loaded.flatMap((l) => l.items.filter((item) => item.kind === 'grammar').map((item) => ({ item, source: l.source }))),
    quiz: loaded.flatMap((l) => l.items.filter((item) => item.kind === 'quiz').map((item) => ({ item, source: l.source }))),
  }

  const listening = byKind.quiz.filter(({ item }) => item.kind === 'quiz' && item.skill === 'listening')
  const reading = byKind.quiz.filter(({ item }) => item.kind === 'quiz' && item.skill === 'reading')
  const mixed = byKind.quiz.filter(({ item }) => item.kind === 'quiz' && item.skill !== 'listening' && item.skill !== 'reading')
  const steps: SessionStep[] = []

  const previewTargets = [...byKind.kanji.slice(0, 1), ...byKind.vocab.slice(0, 2), ...byKind.grammar.slice(0, 1)]
  previewTargets.forEach(({ item, source }, index) => {
    steps.push({
      id: `preview-${index}`,
      phase: 'preview',
      title: phaseTitle('preview'),
      prompt: previewPrompt(item),
      actionLabel: 'Next',
      item,
      source,
      skill: skillFor(item),
    })
  })

  ;[...byKind.kanji.slice(0, 1), ...byKind.vocab.slice(0, 1), ...byKind.grammar.slice(0, 1)].forEach(({ item, source }, index) => {
    steps.push({
      id: `guided-${index}`,
      phase: 'guided',
      title: phaseTitle('guided'),
      prompt: guidedPrompt(item),
      actionLabel: 'Recall it',
      item,
      source,
      skill: skillFor(item),
    })
  })

  ;[...byKind.vocab.slice(0, 2), ...byKind.kanji.slice(0, 1)].forEach(({ item, source }, index) => {
    const quiz = recognitionQuiz(item)
    steps.push({
      id: `recall-${index}`,
      phase: 'active-recall',
      title: phaseTitle('active-recall'),
      prompt: quiz.prompt,
      actionLabel: 'Check',
      item,
      source,
      choices: quiz.choices,
      answer: quiz.answer,
      explain: quiz.explain,
      skill: skillFor(item),
    })
  })

  const semanticTarget = byKind.kanji[0] ?? byKind.vocab[0]
  if (semanticTarget) {
    steps.push({
      id: 'semantic-0',
      phase: 'semantic-expansion',
      title: phaseTitle('semantic-expansion'),
      prompt: semanticPrompt(semanticTarget.item),
      actionLabel: 'Continue',
      item: semanticTarget.item,
      source: semanticTarget.source,
      skill: skillFor(semanticTarget.item),
    })
  }

  const grammarTarget = byKind.grammar[0]
  if (grammarTarget) {
    steps.push({
      id: 'grammar-context-0',
      phase: 'contextual-grammar',
      title: phaseTitle('contextual-grammar'),
      prompt: contextualGrammarPrompt(grammarTarget.item),
      actionLabel: 'I noticed it',
      item: grammarTarget.item,
      source: grammarTarget.source,
      skill: 'grammar',
    })
    const quiz = productionQuiz(grammarTarget.item)
    steps.push({
      id: 'production-0',
      phase: 'production',
      title: phaseTitle('production'),
      prompt: quiz.prompt,
      actionLabel: 'Check',
      item: grammarTarget.item,
      source: grammarTarget.source,
      choices: quiz.choices,
      answer: quiz.answer,
      explain: quiz.explain,
      skill: 'writing',
    })
  }

  ;[...listening.slice(0, duration === 15 ? 1 : 2)].forEach(({ item, source }, index) => {
    if (item.kind !== 'quiz') return
    steps.push(quizStep(`listening-${index}`, 'listening', item, source))
  })

  ;[...reading.slice(0, duration === 15 ? 1 : 2)].forEach(({ item, source }, index) => {
    if (item.kind !== 'quiz') return
    steps.push(quizStep(`reading-${index}`, 'reading', item, source))
  })

  const mixedLimit = duration === 15 ? 4 : duration === 20 ? 6 : 9
  mixed.slice(0, mixedLimit).forEach(({ item, source }, index) => {
    if (item.kind !== 'quiz') return
    steps.push(quizStep(`mixed-${index}`, 'mixed-recall', item, source))
  })

  return { level, duration, source, phases: PHASES, steps }
}

function candidateSources(level: CourseLevelId, completed: Completed): SessionSource[] {
  const sections = level === 'STARTER' ? STARTER_SECTION_ORDER : JLPT_SECTION_ORDER
  return sections
    .map((section) => firstIncompleteSource(level, completed, section))
    .filter((source): source is SessionSource => Boolean(source))
}

function firstIncompleteSource(level: CourseLevelId, completed: Completed, onlySection?: SectionId): SessionSource | undefined {
  const sections = onlySection ? [onlySection] : level === 'STARTER' ? STARTER_SECTION_ORDER : JLPT_SECTION_ORDER
  for (const section of sections) {
    const total = lessonCount(level, section)
    for (let lessonIndex = 0; lessonIndex < total; lessonIndex += 1) {
      if (!completed[lessonKey(level, section, lessonIndex)]) return { level, section, lessonIndex }
    }
  }
  return undefined
}

function phaseTitle(phase: SessionPhaseId) {
  return PHASES.find((p) => p.id === phase)?.label ?? 'Session'
}

function skillFor(item: StudyItem): SessionStep['skill'] {
  if (item.kind === 'quiz') return item.skill === 'reading' || item.skill === 'listening' || item.skill === 'vocab' || item.skill === 'grammar' ? item.skill : 'grammar'
  if (item.kind === 'info') return 'meta'
  return item.kind
}

function previewPrompt(item: StudyItem) {
  if (item.kind === 'kanji') return `${item.char} - ${item.meaning} - ${item.example}`
  if (item.kind === 'vocab') return `${item.front} (${item.reading}) - ${item.meaning}`
  if (item.kind === 'grammar') return `${item.pattern} - ${item.meaning}`
  if (item.kind === 'quiz') return item.prompt
  return item.title
}

function guidedPrompt(item: StudyItem) {
  if (item.kind === 'kanji') return `${item.char}: ${item.meaning}. ON ${item.on || '-'}, KUN ${item.kun || '-'}. Example: ${item.example}. ${item.mnemonic ?? ''}`
  if (item.kind === 'vocab') return `${item.front}: ${item.meaning}. Example: ${item.example} (${item.exampleEn})`
  if (item.kind === 'grammar') return `Observe: ${item.example} Meaning: ${item.exampleEn}. Pattern: ${item.structure}.`
  return previewPrompt(item)
}

function recognitionQuiz(item: StudyItem) {
  if (item.kind === 'kanji') {
    const choices = rotate([item.meaning, 'station', 'teacher', 'tomorrow'], item.char.charCodeAt(0))
    return { prompt: `What does ${item.char} mean?`, choices, answer: choices.indexOf(item.meaning), explain: `${item.char} means ${item.meaning}.` }
  }
  if (item.kind === 'vocab') {
    const choices = rotate([item.meaning, 'to go', 'quiet', 'ticket'], item.front.length)
    return { prompt: `What does ${item.front} mean?`, choices, answer: choices.indexOf(item.meaning), explain: `${item.front} means ${item.meaning}.` }
  }
  return { prompt: previewPrompt(item), choices: ['I remember it', 'I need review'], answer: 0, explain: 'This item will return in mixed recall.' }
}

function semanticPrompt(item: StudyItem) {
  if (item.kind === 'kanji') return `${item.char} -> ${item.example} -> another sentence using the same idea. Notice how the kanji travels inside real words.`
  if (item.kind === 'vocab') return `${item.front} -> ${item.example} -> replace one word and keep the same sentence shape.`
  return previewPrompt(item)
}

function contextualGrammarPrompt(item: StudyItem) {
  if (item.kind !== 'grammar') return previewPrompt(item)
  return `Look first: ${item.example}\nWhat changed? ${item.pattern} marks: ${item.meaning}.\nOnly now remember the rule: ${item.structure}.`
}

function productionQuiz(item: StudyItem) {
  if (item.kind !== 'grammar') return recognitionQuiz(item)
  const choices = rotate([item.example, item.pattern, item.structure, item.meaning], item.pattern.length)
  return {
    prompt: `Choose the sentence that best matches: ${item.exampleEn}`,
    choices,
    answer: choices.indexOf(item.example),
    explain: `The model sentence is: ${item.example}`,
  }
}

function quizStep(id: string, phase: SessionPhaseId, item: Extract<StudyItem, { kind: 'quiz' }>, source: SessionSource): SessionStep {
  return {
    id,
    phase,
    title: phaseTitle(phase),
    prompt: item.prompt,
    actionLabel: 'Check',
    item,
    source,
    choices: item.choices,
    answer: item.answer,
    explain: item.explain,
    skill: skillFor(item),
  }
}

function rotate<T>(items: T[], seed: number): T[] {
  if (!items.length) return items
  const shift = seed % items.length
  const rotated = [...items.slice(shift), ...items.slice(0, shift)]
  const answerIndex = rotated.indexOf(items[0])
  if (answerIndex === 0 && rotated.length > 1) return [rotated[1], rotated[0], ...rotated.slice(2)]
  return rotated
}
