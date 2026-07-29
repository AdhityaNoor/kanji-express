// ---------------------------------------------------------------------------
// Real study content for the course lessons. Vocab / kanji / grammar are
// curated pools per level; listening / reading / tests are structured question
// items. getLessonItems() slices a pool deterministically per lesson so every
// lesson opens with real, non-empty content.
// ---------------------------------------------------------------------------

import type { JlptLevel, SectionId } from './courses'

export type StudyItem =
  | {
      kind: 'vocab'
      id: string
      front: string // kanji/kana headword
      reading: string // kana reading
      meaning: string
      example: string
      exampleEn: string
    }
  | {
      kind: 'kanji'
      id: string
      char: string
      on: string
      kun: string
      meaning: string
      strokes: number
      example: string
    }
  | {
      kind: 'grammar'
      id: string
      pattern: string
      meaning: string
      structure: string
      example: string
      exampleEn: string
    }
  | {
      kind: 'quiz' // listening / reading / test — multiple choice
      id: string
      prompt: string
      passage?: string
      choices: string[]
      answer: number // index into choices
      explain: string
    }

// --- Vocabulary pools --------------------------------------------------------

const VOCAB: Record<JlptLevel, Omit<Extract<StudyItem, { kind: 'vocab' }>, 'kind' | 'id'>[]> = {
  N5: [
    { front: '学生', reading: 'がくせい', meaning: 'student', example: '私は学生です。', exampleEn: 'I am a student.' },
    { front: '先生', reading: 'せんせい', meaning: 'teacher', example: '先生は優しいです。', exampleEn: 'The teacher is kind.' },
    { front: '水', reading: 'みず', meaning: 'water', example: '水を飲みます。', exampleEn: 'I drink water.' },
    { front: '食べる', reading: 'たべる', meaning: 'to eat', example: '朝ご飯を食べる。', exampleEn: 'I eat breakfast.' },
    { front: '行く', reading: 'いく', meaning: 'to go', example: '学校に行く。', exampleEn: 'I go to school.' },
    { front: '大きい', reading: 'おおきい', meaning: 'big', example: '大きい犬。', exampleEn: 'A big dog.' },
    { front: '小さい', reading: 'ちいさい', meaning: 'small', example: '小さい家。', exampleEn: 'A small house.' },
    { front: '友達', reading: 'ともだち', meaning: 'friend', example: '友達と話す。', exampleEn: 'I talk with a friend.' },
    { front: '毎日', reading: 'まいにち', meaning: 'every day', example: '毎日勉強する。', exampleEn: 'I study every day.' },
    { front: '時間', reading: 'じかん', meaning: 'time / hour', example: '時間がない。', exampleEn: 'There is no time.' },
    { front: '買う', reading: 'かう', meaning: 'to buy', example: '本を買う。', exampleEn: 'I buy a book.' },
    { front: '見る', reading: 'みる', meaning: 'to see / watch', example: '映画を見る。', exampleEn: 'I watch a movie.' },
    { front: '電車', reading: 'でんしゃ', meaning: 'train', example: '電車に乗る。', exampleEn: 'I ride the train.' },
    { front: '天気', reading: 'てんき', meaning: 'weather', example: 'いい天気ですね。', exampleEn: 'Nice weather, isn’t it?' },
    { front: '新しい', reading: 'あたらしい', meaning: 'new', example: '新しい車。', exampleEn: 'A new car.' },
    { front: '高い', reading: 'たかい', meaning: 'expensive / tall', example: '高いビル。', exampleEn: 'A tall building.' },
  ],
  N4: [
    { front: '約束', reading: 'やくそく', meaning: 'promise', example: '約束を守る。', exampleEn: 'I keep a promise.' },
    { front: '準備', reading: 'じゅんび', meaning: 'preparation', example: '旅行の準備をする。', exampleEn: 'I prepare for the trip.' },
    { front: '経済', reading: 'けいざい', meaning: 'economy', example: '経済のニュース。', exampleEn: 'Economic news.' },
    { front: '説明', reading: 'せつめい', meaning: 'explanation', example: '先生が説明する。', exampleEn: 'The teacher explains.' },
    { front: '案内', reading: 'あんない', meaning: 'guidance', example: '町を案内する。', exampleEn: 'I show them around town.' },
    { front: '珍しい', reading: 'めずらしい', meaning: 'rare / unusual', example: '珍しい花。', exampleEn: 'A rare flower.' },
    { front: '立てる', reading: 'たてる', meaning: 'to set up / build', example: '計画を立てる。', exampleEn: 'I make a plan.' },
    { front: '足りる', reading: 'たりる', meaning: 'to be enough', example: 'お金が足りる。', exampleEn: 'The money is enough.' },
  ],
  N3: [
    { front: '経験', reading: 'けいけん', meaning: 'experience', example: '経験を積む。', exampleEn: 'I gain experience.' },
    { front: '確認', reading: 'かくにん', meaning: 'confirmation', example: '予約を確認する。', exampleEn: 'I confirm the reservation.' },
    { front: '認める', reading: 'みとめる', meaning: 'to acknowledge', example: '失敗を認める。', exampleEn: 'I admit the mistake.' },
    { front: '影響', reading: 'えいきょう', meaning: 'influence', example: '天気の影響。', exampleEn: 'The influence of weather.' },
    { front: '解決', reading: 'かいけつ', meaning: 'solution', example: '問題を解決する。', exampleEn: 'I solve the problem.' },
    { front: '一般的', reading: 'いっぱんてき', meaning: 'general / typical', example: '一般的な意見。', exampleEn: 'A general opinion.' },
  ],
  N2: [
    { front: '傾向', reading: 'けいこう', meaning: 'tendency', example: '増える傾向がある。', exampleEn: 'There is a tendency to increase.' },
    { front: '提供', reading: 'ていきょう', meaning: 'offer / provide', example: 'サービスを提供する。', exampleEn: 'We provide a service.' },
    { front: '相互', reading: 'そうご', meaning: 'mutual', example: '相互に助ける。', exampleEn: 'We help each other.' },
    { front: '徹底的', reading: 'てっていてき', meaning: 'thorough', example: '徹底的に調べる。', exampleEn: 'I investigate thoroughly.' },
  ],
  N1: [
    { front: '曖昧', reading: 'あいまい', meaning: 'ambiguous', example: '曖昧な返事。', exampleEn: 'An ambiguous answer.' },
    { front: '把握', reading: 'はあく', meaning: 'grasp / comprehension', example: '状況を把握する。', exampleEn: 'I grasp the situation.' },
    { front: '顕著', reading: 'けんちょ', meaning: 'remarkable', example: '顕著な成長。', exampleEn: 'Remarkable growth.' },
  ],
}

// --- Kanji pools -------------------------------------------------------------

const KANJI: Record<JlptLevel, Omit<Extract<StudyItem, { kind: 'kanji' }>, 'kind' | 'id'>[]> = {
  N5: [
    { char: '日', on: 'ニチ', kun: 'ひ', meaning: 'day / sun', strokes: 4, example: '日曜日 (Sunday)' },
    { char: '本', on: 'ホン', kun: 'もと', meaning: 'book / origin', strokes: 5, example: '日本 (Japan)' },
    { char: '人', on: 'ジン', kun: 'ひと', meaning: 'person', strokes: 2, example: '一人 (one person)' },
    { char: '時', on: 'ジ', kun: 'とき', meaning: 'time / hour', strokes: 10, example: '時間 (time)' },
    { char: '水', on: 'スイ', kun: 'みず', meaning: 'water', strokes: 4, example: '水曜日 (Wednesday)' },
    { char: '火', on: 'カ', kun: 'ひ', meaning: 'fire', strokes: 4, example: '火山 (volcano)' },
    { char: '木', on: 'モク', kun: 'き', meaning: 'tree / wood', strokes: 4, example: '木曜日 (Thursday)' },
    { char: '大', on: 'ダイ', kun: 'おお', meaning: 'big', strokes: 3, example: '大学 (university)' },
    { char: '学', on: 'ガク', kun: 'まな', meaning: 'study', strokes: 8, example: '学生 (student)' },
    { char: '生', on: 'セイ', kun: 'い', meaning: 'life / birth', strokes: 5, example: '先生 (teacher)' },
  ],
  N4: [
    { char: '楽', on: 'ガク', kun: 'たの', meaning: 'comfort / music', strokes: 13, example: '音楽 (music)' },
    { char: '園', on: 'エン', kun: 'その', meaning: 'garden / park', strokes: 13, example: '公園 (park)' },
    { char: '運', on: 'ウン', kun: 'はこ', meaning: 'carry / luck', strokes: 12, example: '運動 (exercise)' },
    { char: '験', on: 'ケン', kun: '—', meaning: 'test / verify', strokes: 18, example: '経験 (experience)' },
  ],
  N3: [
    { char: '経', on: 'ケイ', kun: 'へ', meaning: 'pass through / manage', strokes: 11, example: '経済 (economy)' },
    { char: '認', on: 'ニン', kun: 'みと', meaning: 'recognize', strokes: 14, example: '確認 (confirm)' },
    { char: '影', on: 'エイ', kun: 'かげ', meaning: 'shadow', strokes: 15, example: '影響 (influence)' },
  ],
  N2: [
    { char: '傾', on: 'ケイ', kun: 'かたむ', meaning: 'lean / tendency', strokes: 13, example: '傾向 (tendency)' },
    { char: '徹', on: 'テツ', kun: '—', meaning: 'penetrate', strokes: 15, example: '徹底 (thorough)' },
  ],
  N1: [
    { char: '把', on: 'ハ', kun: '—', meaning: 'grasp', strokes: 7, example: '把握 (grasp)' },
    { char: '顕', on: 'ケン', kun: 'あき', meaning: 'evident', strokes: 18, example: '顕著 (remarkable)' },
  ],
}

// --- Grammar pools -----------------------------------------------------------

const GRAMMAR: Record<JlptLevel, Omit<Extract<StudyItem, { kind: 'grammar' }>, 'kind' | 'id'>[]> = {
  N5: [
    { pattern: '〜は〜です', meaning: 'A is B (topic + statement)', structure: 'Noun + は + Noun + です', example: '私は学生です。', exampleEn: 'I am a student.' },
    { pattern: '〜を〜ます', meaning: 'do (object marker)', structure: 'Noun + を + Verb-ます', example: 'ご飯を食べます。', exampleEn: 'I eat a meal.' },
    { pattern: '〜たい', meaning: 'want to (do)', structure: 'Verb-stem + たい', example: '日本へ行きたい。', exampleEn: 'I want to go to Japan.' },
    { pattern: '〜ませんか', meaning: 'won’t you…? (invitation)', structure: 'Verb-stem + ませんか', example: '一緒に行きませんか。', exampleEn: 'Won’t you go together?' },
    { pattern: '〜が好きです', meaning: 'to like', structure: 'Noun + が + 好きです', example: '音楽が好きです。', exampleEn: 'I like music.' },
    { pattern: '〜てください', meaning: 'please do', structure: 'Verb-て + ください', example: '待ってください。', exampleEn: 'Please wait.' },
  ],
  N4: [
    { pattern: '〜ようになる', meaning: 'come to be able to', structure: 'Verb-dict + ようになる', example: '泳げるようになった。', exampleEn: 'I became able to swim.' },
    { pattern: '〜そうだ', meaning: 'looks like / seems', structure: 'Verb-stem + そうだ', example: '雨が降りそうだ。', exampleEn: 'It looks like rain.' },
    { pattern: '〜てしまう', meaning: 'to finish / do regrettably', structure: 'Verb-て + しまう', example: '全部食べてしまった。', exampleEn: 'I ate it all up.' },
  ],
  N3: [
    { pattern: '〜ばかり', meaning: 'just / only', structure: 'Verb-た + ばかり', example: '来たばかりです。', exampleEn: 'I just arrived.' },
    { pattern: '〜ように', meaning: 'so that / in order to', structure: 'Verb-dict + ように', example: '忘れないように書く。', exampleEn: 'I write it so I don’t forget.' },
    { pattern: '〜わけではない', meaning: 'it doesn’t mean that', structure: 'Clause + わけではない', example: '嫌いなわけではない。', exampleEn: 'It’s not that I dislike it.' },
  ],
  N2: [
    { pattern: '〜に基づいて', meaning: 'based on', structure: 'Noun + に基づいて', example: 'データに基づいて決める。', exampleEn: 'Decide based on the data.' },
    { pattern: '〜どころか', meaning: 'far from / let alone', structure: 'Clause + どころか', example: '休むどころか働いた。', exampleEn: 'Far from resting, I worked.' },
  ],
  N1: [
    { pattern: '〜をものともせず', meaning: 'in defiance of', structure: 'Noun + をものともせず', example: '困難をものともせず進む。', exampleEn: 'Advancing in defiance of hardship.' },
    { pattern: '〜であれ〜であれ', meaning: 'whether … or …', structure: 'Noun + であれ + Noun + であれ', example: '晴れであれ雨であれ行く。', exampleEn: 'Rain or shine, I’ll go.' },
  ],
}

// --- Quiz pools (listening / reading / tests) --------------------------------

const LISTENING: Omit<Extract<StudyItem, { kind: 'quiz' }>, 'kind' | 'id'>[] = [
  {
    prompt: 'Listen: 「すみません、駅はどこですか。」 What is the speaker asking?',
    passage: '🔊 Sumimasen, eki wa doko desu ka.',
    choices: ['Where is the station?', 'What time is it?', 'How much is it?', 'Where is the toilet?'],
    answer: 0,
    explain: '駅 (eki) = station, どこ (doko) = where.',
  },
  {
    prompt: 'Listen: 「コーヒーを二つください。」 What did the customer order?',
    passage: '🔊 Koohii o futatsu kudasai.',
    choices: ['One tea', 'Two coffees', 'Two teas', 'One coffee'],
    answer: 1,
    explain: '二つ (futatsu) = two, コーヒー = coffee.',
  },
  {
    prompt: 'Listen: 「明日は雨でしょう。」 What is being said about tomorrow?',
    passage: '🔊 Ashita wa ame deshou.',
    choices: ['It will be sunny', 'It will probably rain', 'It snowed', 'It is windy'],
    answer: 1,
    explain: '雨 (ame) = rain, でしょう = probably.',
  },
]

const READING: Omit<Extract<StudyItem, { kind: 'quiz' }>, 'kind' | 'id'>[] = [
  {
    prompt: 'What does the notice ask people to do?',
    passage: '図書館では、静かにしてください。飲み物は禁止です。',
    choices: ['Be quiet; no drinks', 'Speak loudly', 'Bring food', 'Take photos'],
    answer: 0,
    explain: '静かに = quietly, 飲み物は禁止 = drinks prohibited.',
  },
  {
    prompt: 'When is the shop open?',
    passage: 'この店は午前9時から午後6時まで開いています。日曜日は休みです。',
    choices: ['9am–6pm, closed Sunday', '24 hours', '6am–9pm daily', 'Only weekends'],
    answer: 0,
    explain: '9時から6時まで = 9 to 6; 日曜日は休み = closed Sunday.',
  },
]

const TESTS: Omit<Extract<StudyItem, { kind: 'quiz' }>, 'kind' | 'id'>[] = [
  {
    prompt: '私は毎朝コーヒー＿＿飲みます。 Choose the correct particle.',
    choices: ['を', 'が', 'に', 'で'],
    answer: 0,
    explain: 'を marks the direct object (coffee).',
  },
  {
    prompt: 'この本は＿＿です。 (interesting) Choose the correct word.',
    choices: ['おもしろい', 'たかい', 'ちいさい', 'あたらしい'],
    answer: 0,
    explain: 'おもしろい = interesting.',
  },
  {
    prompt: '「食べる」の て-form is:',
    choices: ['食べて', '食べた', '食べない', '食べます'],
    answer: 0,
    explain: 'Ichidan verb: drop る, add て → 食べて.',
  },
]

// --- Resolver ----------------------------------------------------------------

const ITEMS_PER_LESSON = 8

function rotate<T>(pool: T[], offset: number, count: number): T[] {
  if (pool.length === 0) return []
  const out: T[] = []
  for (let i = 0; i < count; i++) out.push(pool[(offset + i) % pool.length])
  return out
}

/** Return a non-empty, typed list of study items for a specific lesson. */
export function getLessonItems(level: JlptLevel, section: SectionId, lessonIndex: number): StudyItem[] {
  const offset = lessonIndex * 3
  const tag = `${level}-${section}-${lessonIndex}`

  if (section === 'vocab') {
    return rotate(VOCAB[level], offset, ITEMS_PER_LESSON).map((v, i) => ({ kind: 'vocab', id: `${tag}-${i}`, ...v }))
  }
  if (section === 'kanji') {
    return rotate(KANJI[level], offset, Math.min(ITEMS_PER_LESSON, 6)).map((k, i) => ({ kind: 'kanji', id: `${tag}-${i}`, ...k }))
  }
  if (section === 'grammar') {
    return rotate(GRAMMAR[level], offset, Math.min(ITEMS_PER_LESSON, 5)).map((g, i) => ({ kind: 'grammar', id: `${tag}-${i}`, ...g }))
  }
  const pool = section === 'listening' ? LISTENING : section === 'reading' ? READING : TESTS
  return rotate(pool, offset, Math.min(ITEMS_PER_LESSON, 5)).map((q, i) => ({ kind: 'quiz', id: `${tag}-${i}`, ...q }))
}
