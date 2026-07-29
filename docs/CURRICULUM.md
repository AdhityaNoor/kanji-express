# Kanji Express Curriculum Direction

This document resets the course strategy for Kanji Express. The current in-app
lesson data is useful as a UI seed, but it is not strong enough to be the
learning product. It is too small, too flat, and not tied to a coherent
pedagogical progression.

## Research Baseline

The curriculum should combine three proven models:

1. JLPT exam alignment
   - Source: official JLPT test sections and item types.
   - Implication: every level needs explicit training for vocabulary,
     orthography, grammar form selection, sentence composition, text grammar,
     reading comprehension, information retrieval, task-based listening, key
     point listening, and quick response.
   - Link: https://www.jlpt.jp/e/guideline/testsections.html

2. JF Standard / Marugoto can-do learning
   - Source: Japan Foundation's JF Standard and Marugoto.
   - Implication: lessons should not be lists of words. Each lesson should be a
     usable real-life mission: "I can order food", "I can ask for directions",
     "I can explain why I am late", "I can understand a short notice".
   - Link: https://www.jfstandard.jpf.go.jp/
   - Link: https://marugoto.jpf.go.jp/en/teacher/feature/

3. SRS-driven kanji and vocabulary acquisition
   - Source pattern: WaniKani-style radical -> kanji -> vocabulary unlocking,
     reinforced through spaced reviews.
   - Implication: kanji lessons should teach components and mnemonics first,
     then unlock vocabulary that proves the kanji readings in context.
   - Link: https://www.wanikani.com/

For beginner sequencing, Genki is a useful benchmark because it explicitly
builds listening, speaking, reading, and writing across 23 lessons; volume 1 is
positioned around JLPT N5 / CEFR A1, and volume 2 around JLPT N4 / CEFR A2.
Link: https://genki3.japantimes.co.jp/en/intro/index.html

For intermediate sequencing, Tobira is a useful benchmark because it moves from
form practice into topical reading, discussion, and presentation with clear
can-do goals. Link: https://tobiraweb.9640.jp/tobira-intermediate/

## Product Curriculum Principles

Kanji Express should not copy textbook chapters. It should translate the best
ideas into a modern app loop:

1. Mission first
   - Every lesson starts with a concrete outcome.
   - Example: "Ride the train to a meeting", not "Particle de".

2. Input before explanation
   - Show a short dialogue, notice, message, or mini-story first.
   - Let the learner notice target phrases before the grammar card explains
     them.

3. One lesson, one compact cognitive load
   - 8-12 new vocabulary items.
   - 2-4 kanji or kana/script targets.
   - 1-2 grammar patterns.
   - 1 listening task.
   - 1 reading task.
   - 1 production prompt.

4. Spiral review
   - A grammar pattern must return in later listening, reading, and speaking
     prompts.
   - Vocabulary should reappear across multiple missions instead of being
     isolated in a themed list.

5. Kanji unlocks vocabulary
   - Radical/component mnemonic -> kanji recognition -> readings -> vocabulary
     in context -> handwriting.
   - Do not teach stroke writing as the first encounter with a new kanji.

6. JLPT readiness is trained explicitly
   - Lesson practice teaches the language.
   - Exam drills teach the test format.
   - Mock exams should use official JLPT item categories and timings.

7. AI is a tutor, not the source of truth
   - Curated content is canonical.
   - AI explains mistakes, generates extra examples, roleplays, and adapts
     review load.

## Recommended App Lesson Format

Each lesson should be modeled as:

```ts
interface CurriculumLesson {
  id: string
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  unit: string
  mission: string
  canDo: string
  scenario: string
  targets: {
    vocabulary: string[]
    kanji: string[]
    grammar: string[]
    listeningSkills: string[]
    readingSkills: string[]
  }
  flow: [
    'preview',
    'input-dialogue',
    'noticing',
    'vocabulary',
    'grammar',
    'kanji',
    'guided-practice',
    'listening-check',
    'reading-check',
    'production',
    'srs-queue'
  ]
  assessment: {
    recognition: string[]
    recall: string[]
    comprehension: string[]
    production: string[]
  }
}
```

The existing `StudyItem` type is too narrow for this. It lacks can-do goals,
dialogues, target grouping, pitch accent, distractor rationale, production
prompts, and SRS metadata.

## JLPT Level Strategy

### N5: Survival Foundations

Goal: understand and use basic Japanese in classroom and daily situations.

Learner can:
- read hiragana, katakana, and frequent beginner kanji in short sentences.
- handle greetings, identity, time, prices, locations, requests, preferences,
  invitations, and simple past events.
- understand short slow conversations and extract one key fact.

Content target:
- kana mastery.
- about 100 kanji.
- about 800 high-frequency words and expressions.
- core polite verb/adjective forms.
- short signs, notes, schedules, and dialogues.

### N4: Everyday Autonomy

Goal: handle routine daily life with basic connected sentences.

Learner can:
- describe plans, experiences, reasons, comparisons, obligations, permissions,
  and ongoing actions.
- understand slow daily conversations with multiple turns.
- read short messages, notices, and simple articles on familiar topics.

Content target:
- about 300 total kanji.
- about 1,500 total vocabulary items.
- te-form expansion, plain form, nai form, ta form, dictionary form, potential,
  giving/receiving, comparisons, intentions, and conditionals.

### N3: The Bridge

Goal: understand everyday Japanese to a practical intermediate degree.

Learner can:
- follow near-natural conversations on familiar topics.
- read short articles, summaries, explanations, and practical notices.
- understand nuance around reasons, expectations, hearsay, appearance,
  contrast, and speaker stance.

Content target:
- about 650 total kanji.
- about 3,700 total vocabulary items.
- high-frequency intermediate grammar and discourse connectors.

### N2: Independent Fluency

Goal: understand Japanese across broad everyday, workplace, and social topics.

Learner can:
- read essays, opinion pieces, reports, business notices, and longer passages.
- follow natural-speed explanations and discussions.
- distinguish claim, evidence, contrast, implication, and author attitude.

Content target:
- about 1,000 total kanji.
- about 6,000 total vocabulary items.
- formal written grammar, news vocabulary, abstract nouns, and discourse
  structure.

### N1: Advanced Mastery

Goal: understand Japanese in varied, abstract, specialized, and literary
contexts.

Learner can:
- read logically complex texts, editorials, critiques, and abstract prose.
- follow natural-speed speech with implicit relationships and dense argument.
- handle nuanced grammar, idioms, register, and rhetorical structure.

Content target:
- about 2,000+ kanji recognition.
- about 10,000+ vocabulary items.
- advanced grammar, register control, idiomatic expressions, literary forms,
  and domain-specific reading/listening.

## N5 Express Route: First 12 Units

This should replace the current N5 seed as the pilot curriculum.

| Unit | Mission | Core Grammar | Vocabulary Domain | Kanji/Kana | Listening/Reading Output |
| --- | --- | --- | --- | --- | --- |
| 1 | Start the journey | greetings, XはYです, questions | names, countries, classroom | hiragana row 1, 一二三 | exchange greetings and identify people |
| 2 | Ask for help in class | もう一度, ゆっくり, ください | classroom language | hiragana rows 2-3, 人口 | understand teacher instructions |
| 3 | Introduce yourself | の, も, じゃありません | identity, occupation, school | 日月火水 | short self-introduction |
| 4 | Buy a station snack | これ/それ/あれ, counters, いくら | food, money, numbers | 金円百千 | order and understand prices |
| 5 | Find the right train | どこ, へ/に行きます, で | stations, transport, places | 駅車先生 | ask directions and read signs |
| 6 | Plan your day | time, days, から/まで | time, schedules, routines | 時分今毎 | understand a simple schedule |
| 7 | Talk about likes | が好き, adjectives | hobbies, food, drinks | 好食飲見 | discuss preferences |
| 8 | Meet a friend | verbs with を, ませんか/ましょう | activities, invitations | 行来休友 | invite and respond |
| 9 | Describe places | あります/います, position words | rooms, town, objects | 上下中外 | describe where things are |
| 10 | Explain yesterday | past tense, adjective past | weather, events | 雨天気山川 | say what happened |
| 11 | Make a polite request | te-form intro, てください | services, shopping, travel | 書読聞話 | make simple requests |
| 12 | N5 checkpoint 1 | mixed review | units 1-11 | recognition set 1 | mini mock: vocab, grammar, reading, listening |

Each unit should have 5 micro-lessons:

1. Mission briefing: short illustrated situation and can-do.
2. Dialogue input: audio-first, then transcript.
3. Language tools: vocab, grammar, kanji.
4. Practice: recognition, recall, sentence building, listening, reading.
5. Express challenge: roleplay, writing prompt, or timed JLPT drill.

That gives 60 N5 pilot lessons before expanding to the full level.

## Content Quality Requirements

Every vocabulary item should include:
- Japanese headword.
- kana reading.
- English meaning.
- part of speech.
- pitch accent.
- frequency band.
- JLPT level.
- example sentence.
- natural English translation.
- audio key.
- tags.
- related grammar.

Every grammar item should include:
- pattern.
- meaning.
- formation.
- register.
- when to use it.
- when not to use it.
- common mistake.
- 3 graded examples.
- contrastive notes where needed.
- quiz templates.

Every kanji item should include:
- character.
- meaning.
- on reading.
- kun reading.
- stroke count.
- components/radicals.
- mnemonic.
- 3 common words.
- example sentence.
- frequency band.
- stroke order reference.
- handwriting rubric.

Every listening item should include:
- audio or TTS text.
- transcript.
- speed target.
- task type.
- correct answer.
- distractor rationale.
- skill tag.

Every reading item should include:
- passage.
- passage type.
- word count.
- unknown-word budget.
- question type.
- answer rationale.
- scanning/skimming skill tag.

## Immediate Implementation Plan

1. Fix encoding first.
   - The current source and README contain mojibake. Replacing course content
     before fixing encoding will keep producing broken Japanese.

2. Split content from UI seed code.
   - Move curriculum data into structured JSON/TS modules by level and unit.
   - Keep `src/data/content.ts` as a resolver, not as the content warehouse.

3. Upgrade the data model.
   - Add can-do goals, unit missions, dialogue input, pitch accent, grammar
     metadata, SRS metadata, and assessment types.

4. Build the N5 12-unit Express route.
   - Start with Unit 1 and Unit 2 as production-quality examples.
   - Use these as the pattern for N5 expansion.

5. Add validation.
   - A script should reject empty examples, duplicate IDs, missing readings,
     invalid JLPT levels, missing answer rationales, and mojibake.

6. Then expand by level.
   - N5 full route.
   - N4 continuation.
   - N3 bridge route.
   - N2/N1 exam-heavy advanced routes.

## App Experience Implications

The course UI should shift from "section list" to an express-map route:

- Main route: progressive can-do missions.
- Side tracks: kanji depot, grammar lab, vocabulary deck, listening platform,
  reading car, mock exam terminal.
- Reviews: driven by FSRS and weak-skill tags.
- AI Teacher: attached to every mistake and every production prompt.

The theme should support this metaphor without becoming decorative:

- stations = units.
- cars = lesson types.
- tickets = checkpoint tests.
- delays = weak topics.
- express pass = daily goal streak.

The learning value still comes first: the train theme should make progress feel
clear and motivating, not hide weak content behind styling.

## Express Starter Track

Before the learner enters N5, Kanji Express should provide a lightweight
onboarding track. This is not a replacement for JLPT study. It is a confidence
and orientation layer that teaches the learner how Japanese works and how the
app expects them to study.

The Starter track is mandatory for new learners and intentionally short. It
should take roughly 20-30 minutes total, split into small missions.

### Starter Sections

| Section | Purpose | Learner Outcome |
| --- | --- | --- |
| Boarding Pass | Explain the app loop and the JLPT target | I know what I will practice and why reviews matter |
| Kana Sprint | Introduce hiragana, katakana, and kanji without overload | I can tell the scripts apart and read first kana chunks |
| Survival Phrases | Give immediate useful Japanese before grammar depth | I can use basic phrases like すみません and もう一度お願いします |
| Sentence Signals | Demystify particles and sentence order | I can recognize は, を, で, and か as functional signals |
| Review System | Teach SRS behavior and mistake handling | I can use Again/Got it honestly and understand why items return |

### Unlocking

The learning route should be:

1. Express Starter
2. N5 Survival Foundations
3. N4 Everyday Autonomy
4. N3 The Bridge
5. N2 Independent Fluency
6. N1 Advanced Mastery

N5 should unlock after Express Starter is complete. Later JLPT levels continue
to unlock from previous-level progress. This prevents brand-new users from being
dropped into formal course sections before they understand the study loop.

## JLPT Level Handovers

Each JLPT level must begin with a `Level Overview` section before Vocabulary,
Kanji, Grammar, Listening, Reading, and Practice Tests. This overview is the
handover from the previous stage into the next study mode.

Every level overview must include:

- scope: what the level covers and how it differs from the previous level.
- outcome: what the learner should be able to do by the end.
- study strategy: what habits matter most for that level.
- kanji/vocabulary target: the long-term recognition scope for the level.
- one comprehension check so the overview counts as real progress.

Current target scope:

| Level | Role | Long-term Kanji Target | Long-term Vocabulary Target |
| --- | --- | ---: | ---: |
| N5 | Survival foundations | ~100 | ~800 |
| N4 | Everyday autonomy | ~300 total | ~1,500 total |
| N3 | Intermediate bridge | ~650 total | ~3,700 total |
| N2 | Independent fluency | ~1,000 total | ~6,000 total |
| N1 | Advanced mastery | 2,000+ | 10,000+ |

The current in-app kanji lessons are still curated seeds. They are not yet the
complete target manifests. The product should treat kanji completion as two
layers:

1. Course kanji: selected kanji taught in context with words, examples,
   mnemonics, and sentence use.
2. Kanji depot / handwriting: full level manifest used for recognition,
   writing practice, and spaced review.

The next syllabus expansion should generate canonical per-level kanji manifests
and then map each kanji into lesson units instead of manually placing a few
example kanji per level.
