import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const root = process.cwd()
const contentPath = path.join(root, 'src', 'data', 'content.ts')
const coursesPath = path.join(root, 'src', 'data', 'courses.ts')

const requiredSectionsByLevel = {
  STARTER: ['orientation', 'kana', 'phrases', 'sentences', 'study'],
  N5: ['vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
  N4: ['vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
  N3: ['vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
  N2: ['vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
  N1: ['vocab', 'kanji', 'grammar', 'listening', 'reading', 'tests'],
}
const requiredLevels = Object.keys(requiredSectionsByLevel)
const mojibakePattern = /Ã|Â|â€™|â€œ|â€|ã€|ï¼|ðŸ|�/
const japanesePattern = /[\u3040-\u30ff\u3400-\u9fff]/

const errors = []

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
      lessons.forEach((lesson, lessonIndex) => checkLesson(level, section, lesson, lessonIndex))
    }
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
checkRawEncoding(coursesPath)

const content = await loadContentModule()
checkRegistry(content.LESSON_DEFS)

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

console.log(`Content validation passed: ${lessonCount} lessons across Express Starter and ${requiredLevels.length - 1} JLPT levels.`)
