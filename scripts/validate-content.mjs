import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const root = process.cwd()
const contentPath = path.join(root, 'src', 'data', 'contentStore.ts')
const indexPath = path.join(root, 'src', 'data', 'contentIndex.ts')
const coursesPath = path.join(root, 'src', 'data', 'courses.ts')

const requiredSectionsByLevel = {
  STARTER: ['orientation', 'kana', 'phrases', 'sentences', 'study'],
  N5: ['overview', 'vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
  N4: ['overview', 'vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
  N3: ['overview', 'vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
  N2: ['overview', 'vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
  N1: ['overview', 'vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
}
const requiredLevels = Object.keys(requiredSectionsByLevel)
const minimumLessonCounts = {
  'N5.overview': 4,
  'N5.vocab': 10,
  'N5.kanji': 13,
  'N5.grammar': 10,
  'N5.listening': 6,
  'N5.reading': 6,
  'N5.tests': 9,
}
const mojibakePattern = /Ã|Â|â€™|â€œ|â€|ã€|ï¼|ðŸ|�/
const japanesePattern = /[\u3040-\u30ff\u3400-\u9fff]/

const errors = []
const resolvedAnswerCounts = new Map()
let resolvedQuizCount = 0

function readUtf8(file) {
  return fs.readFileSync(file, 'utf8')
}

function fail(message) {
  errors.push(message)
}

function checkRawEncoding(file) {
  const text = readUtf8(file)
  if (mojibakePattern.test(text)) {
    fail(`${path.relative(root, file)} contains mojibake-looking text.`)
  }
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function hasJapanese(value) {
  return typeof value === 'string' && japanesePattern.test(value)
}

function checkQuiz(level, section, lessonIndex, itemIndex, item) {
  const prefix = `${level}.${section}[${lessonIndex}].items[${itemIndex}]`
  if (!nonEmpty(item.prompt)) fail(`${prefix} quiz is missing prompt.`)
  if (!Array.isArray(item.choices) || item.choices.length < 2) fail(`${prefix} quiz needs at least two choices.`)
  if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.choices.length) {
    fail(`${prefix} quiz answer index is invalid.`)
  }
  if (!nonEmpty(item.explain)) fail(`${prefix} quiz is missing explanation.`)
  if ((section === 'listening' || item.skill === 'listening') && !hasJapanese(item.passage)) {
    fail(`${prefix} listening item needs a Japanese passage/transcript.`)
  }
  if ((section === 'reading' || item.skill === 'reading') && !hasJapanese(item.passage)) {
    fail(`${prefix} reading item needs a Japanese passage.`)
  }
}

function checkItem(level, section, lessonIndex, itemIndex, item) {
  const prefix = `${level}.${section}[${lessonIndex}].items[${itemIndex}]`
  if (!item || typeof item !== 'object') {
    fail(`${prefix} is not an object.`)
    return
  }

  if (item.kind === 'vocab') {
    for (const key of ['front', 'reading', 'meaning', 'example', 'exampleEn']) {
      if (!nonEmpty(item[key])) fail(`${prefix} vocab is missing ${key}.`)
    }
    if (!hasJapanese(item.front) && !hasJapanese(item.example)) fail(`${prefix} vocab should include Japanese text.`)
    return
  }

  if (item.kind === 'info') {
    if (!nonEmpty(item.title)) fail(`${prefix} info is missing title.`)
    if (!nonEmpty(item.body)) fail(`${prefix} info is missing body.`)
    if (!Array.isArray(item.bullets) || item.bullets.length === 0) fail(`${prefix} info needs bullets.`)
    for (const [bulletIndex, bullet] of (item.bullets || []).entries()) {
      if (!nonEmpty(bullet)) fail(`${prefix} info bullet ${bulletIndex} is empty.`)
    }
    return
  }

  if (item.kind === 'kanji') {
    for (const key of ['char', 'on', 'meaning', 'example']) {
      if (!nonEmpty(item[key])) fail(`${prefix} kanji is missing ${key}.`)
    }
    if (!Number.isInteger(item.strokes) || item.strokes <= 0) fail(`${prefix} kanji has invalid stroke count.`)
    if (!hasJapanese(item.char)) fail(`${prefix} kanji char should be Japanese.`)
    return
  }

  if (item.kind === 'grammar') {
    for (const key of ['pattern', 'meaning', 'structure', 'example', 'exampleEn']) {
      if (!nonEmpty(item[key])) fail(`${prefix} grammar is missing ${key}.`)
    }
    if (!hasJapanese(item.pattern) && !hasJapanese(item.example)) fail(`${prefix} grammar should include Japanese text.`)
    return
  }

  if (item.kind === 'quiz') {
    checkQuiz(level, section, lessonIndex, itemIndex, item)
    return
  }

  fail(`${prefix} has unknown kind "${item.kind}".`)
}

function checkLesson(level, section, lesson, lessonIndex) {
  const prefix = `${level}.${section}[${lessonIndex}]`
  if (!nonEmpty(lesson.title)) fail(`${prefix} is missing title.`)
  if (!nonEmpty(lesson.description)) fail(`${prefix} is missing description.`)
  if (!Array.isArray(lesson.items) || lesson.items.length === 0) fail(`${prefix} needs at least one item.`)

  if ((level === 'STARTER' || level === 'N5') && lessonIndex === 0) {
    if (!nonEmpty(lesson.mission)) fail(`${prefix} pilot lesson is missing mission.`)
    if (!nonEmpty(lesson.canDo)) fail(`${prefix} pilot lesson is missing canDo.`)
  }

  lesson.items?.forEach((item, itemIndex) => checkItem(level, section, lessonIndex, itemIndex, item))
}

function checkRegistry(lessonDefs) {
  for (const level of requiredLevels) {
    if (!lessonDefs[level]) {
      fail(`Missing level ${level}.`)
      continue
    }

    for (const section of requiredSectionsByLevel[level]) {
      const lessons = lessonDefs[level][section]
      if (!Array.isArray(lessons) || lessons.length === 0) {
        fail(`${level}.${section} needs at least one lesson.`)
        continue
      }
      const minimumLessonCount = minimumLessonCounts[`${level}.${section}`]
      if (minimumLessonCount && lessons.length < minimumLessonCount) {
        fail(`${level}.${section} needs at least ${minimumLessonCount} lessons; found ${lessons.length}.`)
      }
      lessons.forEach((lesson, lessonIndex) => checkLesson(level, section, lesson, lessonIndex))
    }
  }
}

function lessonText(lessons) {
  return lessons
    .flatMap((lesson) => [
      lesson.title,
      lesson.description,
      lesson.mission,
      lesson.canDo,
      ...(lesson.items || []).flatMap((item) => Object.values(item).flatMap((value) => (Array.isArray(value) ? value : [value]))),
    ])
    .filter((value) => typeof value === 'string')
    .join('\n')
}

function checkN5Manifest(content) {
  const manifest = content.N5_SYLLABUS_MANIFEST
  if (!manifest) {
    fail('Missing N5_SYLLABUS_MANIFEST.')
    return
  }

  const n5 = content.LESSON_DEFS.N5
  for (const [section, minimum] of Object.entries(manifest.minimumLessonCounts || {})) {
    const count = n5[section]?.length || 0
    if (count < minimum) fail(`N5 manifest requires ${minimum} ${section} lessons; found ${count}.`)
  }

  const vocabLessonTitles = new Set((n5.vocab || []).map((lesson) => lesson.title))
  for (const title of manifest.vocabThemes || []) {
    if (!vocabLessonTitles.has(title)) fail(`N5 vocab theme is not covered by a lesson: ${title}.`)
  }

  const grammarText = lessonText(n5.grammar || [])
  for (const point of manifest.grammarPoints || []) {
    for (const token of point.tokens || []) {
      if (!grammarText.includes(token)) fail(`N5 grammar point ${point.id} is missing token: ${token}.`)
    }
  }

  const n5Kanji = new Set()
  for (const lesson of n5.kanji || []) {
    for (const item of lesson.items || []) {
      if (item.kind === 'kanji') n5Kanji.add(item.char)
    }
  }
  for (const char of manifest.kanji || []) {
    if (!n5Kanji.has(char)) fail(`N5 manifest kanji is missing from kanji lessons: ${char}.`)
  }

  const readingTitles = lessonText(n5.reading || []).toLowerCase()
  for (const task of manifest.readingTasks || []) {
    if (!readingTitles.includes(task.toLowerCase())) fail(`N5 reading task is not represented: ${task}.`)
  }

  const listeningTitles = lessonText(n5.listening || []).toLowerCase()
  for (const task of manifest.listeningTasks || []) {
    if (!listeningTitles.includes(task.toLowerCase())) fail(`N5 listening task is not represented: ${task}.`)
  }

  const testSkillCounts = { vocab: 0, grammar: 0, reading: 0, listening: 0 }
  for (const lesson of n5.tests || []) {
    for (const item of lesson.items || []) {
      if (item.kind !== 'quiz') continue
      const skill = item.skill || 'grammar'
      if (skill in testSkillCounts) testSkillCounts[skill] += 1
    }
  }
  for (const [skill, minimum] of Object.entries(manifest.practiceSkillMinimums || {})) {
    if ((testSkillCounts[skill] || 0) < minimum) {
      fail(`N5 tests need at least ${minimum} ${skill} quiz items; found ${testSkillCounts[skill] || 0}.`)
    }
  }
}

function recordResolvedQuiz(item) {
  resolvedQuizCount += 1
  resolvedAnswerCounts.set(item.answer, (resolvedAnswerCounts.get(item.answer) || 0) + 1)
}

function checkResolvedQuizDistribution(content) {
  for (const level of requiredLevels) {
    for (const section of requiredSectionsByLevel[level]) {
      const lessons = content.LESSON_DEFS[level][section] || []
      for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex += 1) {
        const items = content.getLessonItems(level, section, lessonIndex)
        for (const item of items) {
          if (item.kind !== 'quiz') continue
          if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.choices.length) {
            fail(`${level}.${section}[${lessonIndex}] resolved quiz answer index is invalid.`)
            continue
          }
          recordResolvedQuiz(item)
        }
      }
    }
  }

  if (resolvedQuizCount === 0) {
    fail('No resolved quizzes found.')
    return
  }

  const firstAnswerCount = resolvedAnswerCounts.get(0) || 0
  if (firstAnswerCount === resolvedQuizCount) {
    fail('Resolved quizzes all use the first choice as the correct answer.')
  }

  const dominantCount = Math.max(...resolvedAnswerCounts.values())
  if (resolvedQuizCount >= 10 && dominantCount / resolvedQuizCount > 0.7) {
    fail(`Resolved quiz answers are too concentrated in one position (${dominantCount}/${resolvedQuizCount}).`)
  }
}

async function loadContentModule() {
  const outfile = path.join(os.tmpdir(), `kanji-express-content-${Date.now()}.mjs`)
  const source = readUtf8(contentPath)
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
  })
  fs.writeFileSync(outfile, result.outputText, 'utf8')

  try {
    return await import(pathToFileURL(outfile).href)
  } finally {
    fs.rmSync(outfile, { force: true })
  }
}

checkRawEncoding(contentPath)
checkRawEncoding(indexPath)
checkRawEncoding(coursesPath)

const content = await loadContentModule()
checkRegistry(content.LESSON_DEFS)
checkN5Manifest(content)
checkResolvedQuizDistribution(content)

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} issue(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

const lessonCount = requiredLevels.reduce(
  (sum, level) =>
    sum +
    requiredSectionsByLevel[level].reduce(
      (sectionSum, section) => sectionSum + content.LESSON_DEFS[level][section].length,
      0,
    ),
  0,
)

const quizDistribution = [...resolvedAnswerCounts.entries()]
  .sort(([left], [right]) => left - right)
  .map(([answer, count]) => `${answer}:${count}`)
  .join(', ')

console.log(
  `Content validation passed: ${lessonCount} lessons across Express Starter and ${requiredLevels.length - 1} JLPT levels. Quiz answers ${quizDistribution}.`,
)
