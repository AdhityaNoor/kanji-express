# Adaptive Course Session Specification

Kanji Express courses should be consumed primarily through **Start Today's Course**.
The course catalog remains available for browsing and reference, but the default
learning path is an adaptive, evidence-backed session.

## Product Goal

The learner should never ask, "What should I study next?"

The app should choose the next session from:

- Current JLPT level and unlocked content
- Weak sections and previous mistakes
- Spaced repetition due items
- Available study duration: 15, 20, or 30 minutes
- Target JLPT level and future exam date
- Confidence, response accuracy, response speed, handwriting quality, and listening results

## Session Flow

Every adaptive session follows the same phases:

1. Preview
   - Objective: prime today's kanji, vocabulary, and grammar quickly.
   - UX: show pronunciation, meaning, example/audio, no long explanation.
   - Psychology: priming and cognitive load reduction.
   - Exit: learner has seen/heard each target once.

2. Guided Learning
   - Objective: teach one concept at a time.
   - UX: compact card with example, audio, mnemonic or sentence context.
   - Psychology: comprehensible input and focused attention.
   - Exit: learner can identify the concept's role or meaning.

3. Immediate Active Recall
   - Objective: retrieve the new concept immediately.
   - UX: recognition, multiple choice, writing, or listening prompt.
   - Psychology: retrieval practice.
   - Exit: learner attempts recall.

4. Semantic Expansion
   - Objective: connect the concept to related words or known contexts.
   - UX: relationship chain such as kanji -> compound -> sentence.
   - Psychology: elaboration and memory network building.
   - Exit: learner sees the concept in a small family of uses.

5. Contextual Grammar
   - Objective: introduce grammar through observation first.
   - UX: sentence appears before the rule; learner notices the changed part.
   - Psychology: noticing hypothesis and generation effect.
   - Exit: learner identifies what the pattern does.

6. Production
   - Objective: make the learner generate Japanese.
   - UX: sentence ordering, fill-in, short translation, speaking, or writing.
   - Psychology: generation effect and desirable difficulty.
   - Exit: learner produces or completes Japanese.

7. Listening
   - Objective: use today's targets in audio-first comprehension.
   - UX: play prompt, answer first, replay after first attempt.
   - Psychology: auditory retrieval and memory under time pressure.
   - Exit: learner answers an audio prompt.

8. Reading
   - Objective: transfer today's content into a short passage.
   - UX: 90-95 percent comprehensible passage with optional explanation.
   - Psychology: context-based learning and transfer.
   - Exit: learner answers concrete information questions.

9. Mixed Recall
   - Objective: interleave all categories.
   - UX: mixed vocabulary, kanji, grammar, listening, reading, and production.
   - Psychology: interleaving and discrimination practice.
   - Exit: learner completes mixed retrieval.

10. Confidence Assessment
    - Objective: capture quality of recall.
    - UX: Easy, Okay, Difficult, Guess after retrieval.
    - Psychology: confidence-based mastery; guesses do not count as mastery.
    - Exit: every retrieval answer has confidence.

11. AI Analysis
    - Objective: decide what should appear next.
    - UX: skill breakdown, weak area, tomorrow recommendation.
    - Psychology: error-based learning and spaced repetition planning.
    - Exit: session result is saved.

## UI Principles

- Mobile-first, one-handed, single primary action.
- Calm, focused, minimal, premium.
- No XP-first or celebration-first learning.
- No separate "Kanji Quiz", "Grammar Quiz", "Vocabulary Quiz" as the main path.
- Quizzes should be interleaved unless the learner intentionally opens a reference section.

## State Model

Current implementation records lesson completion through the existing progress API and
records confidence inside the session result model. The next data-model step should add:

- Per-item recall history
- Confidence history
- Response time
- Error type
- Forgetting probability
- Next review date
- Skill-level mastery estimates

## Current Implementation

- Session planner: `src/lib/adaptiveSession.ts`
- Session route: `/session?duration=15|20|30`
- Session UI: `src/pages/TodaySession.tsx`
- Dashboard primary action: Start Today's Course

## Future Algorithm

Priority score per candidate item:

```text
priority =
  dueReviewWeight
  + weakTopicWeight
  + examRelevanceWeight
  + lowConfidenceWeight
  + recentMistakeWeight
  - overloadPenalty
```

The planner should select a small set of new items plus due review items, then route
them through the phase sequence above.
