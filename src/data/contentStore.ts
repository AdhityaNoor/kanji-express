// ---------------------------------------------------------------------------
// Course content seed.
//
// This is still a lightweight in-app dataset, but it now follows the curriculum
// direction in docs/CURRICULUM.md: mission-led lessons, clean UTF-8 Japanese,
// spiral review, and explicit listening/reading/test practice. The next content
// pass should split this into per-level modules and add richer metadata.
// ---------------------------------------------------------------------------

import type { CourseLevelId, SectionId } from './courses'

export type StudyItem =
  | {
      kind: 'info'
      id: string
      title: string
      body: string
      bullets: string[]
    }
  | {
      kind: 'vocab'
      id: string
      front: string
      reading: string
      meaning: string
      example: string
      exampleEn: string
      partOfSpeech?: string
      pitch?: string
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
      mnemonic?: string
    }
  | {
      kind: 'grammar'
      id: string
      pattern: string
      meaning: string
      structure: string
      example: string
      exampleEn: string
      note?: string
    }
  | {
      kind: 'quiz'
      id: string
      prompt: string
      passage?: string
      choices: string[]
      answer: number
      explain: string
      skill?: 'listening' | 'reading' | 'grammar' | 'vocab'
    }

type Raw =
  | Omit<Extract<StudyItem, { kind: 'info' }>, 'id'>
  | Omit<Extract<StudyItem, { kind: 'vocab' }>, 'id'>
  | Omit<Extract<StudyItem, { kind: 'kanji' }>, 'id'>
  | Omit<Extract<StudyItem, { kind: 'grammar' }>, 'id'>
  | Omit<Extract<StudyItem, { kind: 'quiz' }>, 'id'>

export interface LessonDef {
  title: string
  description: string
  mission?: string
  canDo?: string
  items: Raw[]
}

const v = (
  front: string,
  reading: string,
  meaning: string,
  example: string,
  exampleEn: string,
  partOfSpeech?: string,
  pitch?: string,
): Raw => ({ kind: 'vocab', front, reading, meaning, example, exampleEn, partOfSpeech, pitch })

const k = (
  char: string,
  on: string,
  kun: string,
  meaning: string,
  strokes: number,
  example: string,
  mnemonic?: string,
): Raw => ({ kind: 'kanji', char, on, kun, meaning, strokes, example, mnemonic })

const g = (
  pattern: string,
  meaning: string,
  structure: string,
  example: string,
  exampleEn: string,
  note?: string,
): Raw => ({ kind: 'grammar', pattern, meaning, structure, example, exampleEn, note })

const q = (
  prompt: string,
  choices: string[],
  answer: number,
  explain: string,
  passage?: string,
  skill?: Extract<StudyItem, { kind: 'quiz' }>['skill'],
): Raw => ({ kind: 'quiz', prompt, choices, answer, explain, passage, skill })

const info = (title: string, body: string, bullets: string[]): Raw => ({ kind: 'info', title, body, bullets })

// ===========================================================================
// STARTER - lightweight onboarding before JLPT courses
// ===========================================================================

const STARTER_ORIENTATION: LessonDef[] = [
  {
    title: 'Boarding pass',
    description: 'Understand the app loop before starting JLPT study.',
    mission: 'Learn how Kanji Express turns Japanese into short daily missions.',
    canDo: 'I can explain what I will practice each day and why reviews matter.',
    items: [
      q('What is the Kanji Express lesson loop?', ['Mission, input, tools, practice, review', 'Grammar list only', 'Kanji writing only', 'Mock exams only'], 0, 'The app teaches with a compact loop: mission, input, language tools, practice, then review.', undefined, 'grammar'),
      q('What does JLPT mainly test?', ['Reading, listening, vocabulary, and grammar', 'Speaking interviews', 'Essay writing only', 'Handwriting speed'], 0, 'JLPT focuses on language knowledge, reading, and listening.', undefined, 'grammar'),
      q('Why should lessons stay short?', ['Short sessions reduce overload and make daily review easier', 'Short lessons avoid learning grammar', 'Long sessions never work', 'Because kanji is optional'], 0, 'A lightweight daily loop helps retention without overwhelming beginners.', undefined, 'grammar'),
    ],
  },
]

const STARTER_KANA: LessonDef[] = [
  {
    title: 'Three scripts, one system',
    description: 'Recognize hiragana, katakana, and kanji without panic.',
    mission: 'Look at a platform sign and identify which script you are seeing.',
    canDo: 'I can tell hiragana, katakana, and kanji apart.',
    items: [
      v('ひらがな', 'ひらがな', 'hiragana; native Japanese syllabary', 'これはひらがなです。', 'This is hiragana.', 'script'),
      v('カタカナ', 'カタカナ', 'katakana; foreign-word syllabary', 'コーヒーはカタカナです。', 'Coffee is written in katakana.', 'script'),
      v('漢字', 'かんじ', 'kanji; meaning-based Chinese characters', '日本語には漢字があります。', 'Japanese has kanji.', 'script'),
      q('Which item is katakana?', ['コーヒー', 'こんにちは', '学生', '私は'], 0, 'Katakana uses angular characters and often appears in loanwords like コーヒー.', undefined, 'vocab'),
      q('Which item is kanji?', ['駅', 'すみません', 'パン', 'です'], 0, '駅 is a kanji character meaning station.', undefined, 'vocab'),
    ],
  },
  {
    title: 'Kana sprint: first sounds',
    description: 'Start reading simple kana by sound, not by memorizing charts perfectly.',
    mission: 'Recognize the first kana used in greetings and survival phrases.',
    canDo: 'I can read a few high-frequency kana chunks.',
    items: [
      v('あ', 'あ', 'a', 'あさです。', 'It is morning.', 'kana'),
      v('い', 'い', 'i', 'いいです。', 'It is good.', 'kana'),
      v('う', 'う', 'u', 'うえです。', 'It is above.', 'kana'),
      v('え', 'え', 'e', 'えきです。', 'It is a station.', 'kana'),
      v('お', 'お', 'o', 'おちゃです。', 'It is tea.', 'kana'),
      q('What sound is あ?', ['a', 'i', 'u', 'e'], 0, 'あ is the vowel sound a.', undefined, 'vocab'),
    ],
  },
]

const STARTER_PHRASES: LessonDef[] = [
  {
    title: 'Survival phrases',
    description: 'Learn useful expressions before formal grammar.',
    mission: 'Handle your first simple exchange politely.',
    canDo: 'I can use a few phrases immediately, even before I understand every grammar part.',
    items: [
      v('すみません', 'すみません', 'excuse me / sorry', 'すみません、駅はどこですか。', 'Excuse me, where is the station?', 'expression'),
      v('ありがとうございます', 'ありがとうございます', 'thank you', 'ありがとうございます。助かりました。', 'Thank you. That helped.', 'expression'),
      v('もう一度お願いします', 'もういちどおねがいします', 'one more time, please', 'もう一度お願いします。', 'One more time, please.', 'expression'),
      v('わかりません', 'わかりません', 'I do not understand', 'すみません、わかりません。', 'Sorry, I do not understand.', 'expression'),
      v('これは何ですか', 'これはなんですか', 'what is this?', 'これは何ですか。', 'What is this?', 'expression'),
      q('Which phrase asks someone to repeat?', ['もう一度お願いします', 'ありがとうございます', 'こんにちは', 'これは何ですか'], 0, 'もう一度お願いします asks for one more time.', undefined, 'vocab'),
    ],
  },
]

const STARTER_SENTENCES: LessonDef[] = [
  {
    title: 'Sentence signals',
    description: 'See how particles make Japanese sentence order less mysterious.',
    mission: 'Read tiny sentences and spot what each marker does.',
    canDo: 'I can recognize は, を, で, and か as signals in a sentence.',
    items: [
      g('X は Y です', 'X is Y', 'Topic + は + noun + です', '私は学生です。', 'I am a student.', 'は marks what the sentence is about.'),
      g('X をください', 'please give me X', 'Noun + を + ください', '水をください。', 'Water, please.', 'を often marks the thing receiving an action.'),
      g('X で行きます', 'go by X', 'Vehicle/tool + で + 行きます', '電車で行きます。', 'I go by train.', 'で can mark the method or tool.'),
      g('...ですか', 'question marker', 'Statement + か', '駅はどこですか。', 'Where is the station?', 'か turns a statement into a question.'),
      q('In 水をください, what does を mark?', ['The thing requested', 'The time', 'The speaker', 'A question'], 0, '水 is the thing being requested.', undefined, 'grammar'),
    ],
  },
]

const STARTER_STUDY: LessonDef[] = [
  {
    title: 'How reviews work',
    description: 'Learn why mistakes return and how to study without burning out.',
    mission: 'Set the right expectation for daily review.',
    canDo: 'I can use Again and Got it honestly so SRS helps me remember.',
    items: [
      q('When should you press Again?', ['When recall was wrong or slow', 'Only when the app crashes', 'Never', 'Only for kanji'], 0, 'Again is useful feedback. It brings weak items back sooner.', undefined, 'grammar'),
      q('What is better for retention?', ['Short daily sessions', 'One huge session once a month', 'Skipping reviews', 'Only reading explanations'], 0, 'Short daily reviews beat rare cramming for memory.', undefined, 'grammar'),
      q('Why do mistakes come back?', ['To strengthen weak memory before it fades', 'To punish the learner', 'Because progress is broken', 'Because the item is complete'], 0, 'SRS uses mistakes to schedule better review timing.', undefined, 'grammar'),
    ],
  },
]

// ===========================================================================
// N5 - Survival foundations
// ===========================================================================

const N5_OVERVIEW: LessonDef[] = [
  {
    title: 'N5 handover: survival foundations',
    description: 'Understand the scope, target outcomes, and study strategy for your first JLPT level.',
    mission: 'Get oriented before starting N5 lessons.',
    canDo: 'I can explain what N5 covers and what I should be able to do by the end.',
    items: [
      info('Scope', 'N5 is the first real checkpoint after Express Starter. It turns isolated phrases into short usable sentences.', [
        'Core polite sentences, basic particles, time, prices, locations, and requests.',
        'Short signs, notes, schedules, and slow everyday conversations.',
        'Recognition target: roughly 100 beginner kanji and high-frequency beginner vocabulary.',
      ]),
      info('By the end', 'You should be able to survive simple classroom, station, shop, and self-introduction situations.', [
        'Introduce yourself and ask simple questions.',
        'Read short notices and pick out names, times, prices, and places.',
        'Understand slow one-point listening prompts.',
      ]),
      info('Kanji plan', 'The app starts with a curated kanji seed, then the handwriting practice can pull full JLPT kanji references at runtime.', [
        'Course lessons teach kanji in context, not as isolated character dumps.',
        'Handwriting practice is the place for broader kanji drilling.',
        'The long-term content target is a complete N5 kanji manifest, not only the current seed lessons.',
      ]),
      q('What is the main purpose of N5?', ['Build survival foundations', 'Master editorials', 'Read academic papers', 'Understand workplace debates'], 0, 'N5 is about basic language knowledge and simple daily comprehension.', undefined, 'grammar'),
    ],
  },
]

const N5_VOCAB: LessonDef[] = [
  {
    title: 'Start the journey',
    description: 'Greet someone, give your name, and recognize the first classroom words.',
    mission: 'You have just boarded the Kanji Express and need to introduce yourself.',
    canDo: 'I can exchange basic greetings and say who I am.',
    items: [
      v('こんにちは', 'こんにちは', 'hello / good afternoon', 'こんにちは。私はアリです。', 'Hello. I am Ari.', 'expression', 'LHHHH'),
      v('はじめまして', 'はじめまして', 'nice to meet you', 'はじめまして。よろしくお願いします。', 'Nice to meet you. Please treat me well.', 'expression'),
      v('私', 'わたし', 'I / me', '私は学生です。', 'I am a student.', 'pronoun', 'LHH'),
      v('学生', 'がくせい', 'student', 'マリアさんは学生です。', 'Maria is a student.', 'noun'),
      v('先生', 'せんせい', 'teacher', '田中先生は日本語の先生です。', 'Tanaka-sensei is a Japanese teacher.', 'noun'),
      v('日本', 'にほん', 'Japan', '日本から来ました。', 'I came from Japan.', 'noun'),
      v('日本語', 'にほんご', 'Japanese language', '日本語を勉強します。', 'I study Japanese.', 'noun'),
      v('名前', 'なまえ', 'name', 'お名前は何ですか。', 'What is your name?', 'noun'),
    ],
  },
  {
    title: 'Numbers on the platform',
    description: 'Read basic numbers, prices, and platform information.',
    mission: 'Buy a ticket and find the correct platform.',
    canDo: 'I can understand simple numbers, yen prices, and platform labels.',
    items: [
      v('一', 'いち', 'one', '一番線はここです。', 'Platform one is here.', 'number'),
      v('二', 'に', 'two', '切符を二枚ください。', 'Two tickets, please.', 'number'),
      v('三', 'さん', 'three', '三時に会いましょう。', "Let's meet at three.", 'number'),
      v('四', 'よん / し', 'four', '四人で行きます。', 'Four people will go.', 'number'),
      v('五', 'ご', 'five', '五百円です。', 'It is 500 yen.', 'number'),
      v('円', 'えん', 'yen', 'これは百円です。', 'This is 100 yen.', 'noun'),
      v('切符', 'きっぷ', 'ticket', '切符を買います。', 'I buy a ticket.', 'noun'),
      v('番線', 'ばんせん', 'platform / track number', '電車は二番線です。', 'The train is on platform two.', 'noun'),
    ],
  },
  {
    title: 'Time and schedules',
    description: 'Talk about today, tomorrow, and train departure times.',
    mission: 'Check the departure board before meeting a friend.',
    canDo: 'I can understand simple times and days.',
    items: [
      v('今日', 'きょう', 'today', '今日は暑いです。', 'It is hot today.', 'noun'),
      v('明日', 'あした', 'tomorrow', '明日、学校へ行きます。', 'Tomorrow I will go to school.', 'noun'),
      v('昨日', 'きのう', 'yesterday', '昨日は雨でした。', 'Yesterday was rainy.', 'noun'),
      v('今', 'いま', 'now', '今、何時ですか。', 'What time is it now?', 'noun'),
      v('時', 'じ', "o'clock", '七時に起きます。', 'I wake up at seven.', 'suffix'),
      v('分', 'ふん / ぷん', 'minute', '五分待ってください。', 'Please wait five minutes.', 'suffix'),
      v('毎日', 'まいにち', 'every day', '毎日、日本語を聞きます。', 'I listen to Japanese every day.', 'noun'),
      v('週末', 'しゅうまつ', 'weekend', '週末は休みです。', 'The weekend is a day off.', 'noun'),
    ],
  },
  {
    title: 'Food car orders',
    description: 'Order simple food and drinks politely.',
    mission: 'Order from the train food cart.',
    canDo: 'I can ask for food and drinks using ください.',
    items: [
      v('水', 'みず', 'water', '水をください。', 'Water, please.', 'noun'),
      v('お茶', 'おちゃ', 'tea', 'お茶を二つください。', 'Two teas, please.', 'noun'),
      v('コーヒー', 'コーヒー', 'coffee', 'コーヒーを飲みます。', 'I drink coffee.', 'noun'),
      v('ご飯', 'ごはん', 'rice / meal', '朝ご飯を食べます。', 'I eat breakfast.', 'noun'),
      v('パン', 'パン', 'bread', 'パンを買います。', 'I buy bread.', 'noun'),
      v('肉', 'にく', 'meat', '肉が好きです。', 'I like meat.', 'noun'),
      v('魚', 'さかな', 'fish', '魚を食べません。', 'I do not eat fish.', 'noun'),
      v('野菜', 'やさい', 'vegetable', '野菜はおいしいです。', 'Vegetables are tasty.', 'noun'),
    ],
  },
  {
    title: 'Places around town',
    description: 'Ask where places are and say where you are going.',
    mission: 'Leave the station and find your destination.',
    canDo: 'I can ask and answer where familiar places are.',
    items: [
      v('駅', 'えき', 'station', '駅はどこですか。', 'Where is the station?', 'noun'),
      v('学校', 'がっこう', 'school', '学校へ行きます。', 'I go to school.', 'noun'),
      v('会社', 'かいしゃ', 'company', '父は会社にいます。', 'My father is at the company.', 'noun'),
      v('店', 'みせ', 'shop', 'あの店は安いです。', 'That shop is cheap.', 'noun'),
      v('病院', 'びょういん', 'hospital', '病院は駅の前です。', 'The hospital is in front of the station.', 'noun'),
      v('電車', 'でんしゃ', 'train', '電車で行きます。', 'I go by train.', 'noun'),
      v('車', 'くるま', 'car', '車は新しいです。', 'The car is new.', 'noun'),
      v('道', 'みち', 'road / way', 'この道は長いです。', 'This road is long.', 'noun'),
    ],
  },
]

const N5_KANJI: LessonDef[] = [
  {
    title: 'Numbers 一 to 五',
    description: 'The first number kanji used in prices, dates, and platforms.',
    mission: 'Recognize number kanji on a ticket machine.',
    canDo: 'I can recognize 一, 二, 三, 四, and 五 in simple words.',
    items: [
      k('一', 'イチ', 'ひと', 'one', 1, '一番 (number one)', 'One horizontal line: the simplest stop on the route.'),
      k('二', 'ニ', 'ふた', 'two', 2, '二人 (two people)', 'Two rails running side by side.'),
      k('三', 'サン', 'み', 'three', 3, '三時 (three o’clock)', 'Three rails stacked together.'),
      k('四', 'シ', 'よん / よ', 'four', 5, '四月 (April)', 'A box holding four corners.'),
      k('五', 'ゴ', 'いつ', 'five', 4, '五百円 (500 yen)', 'A crossing shape that marks stop five.'),
    ],
  },
  {
    title: 'People and language',
    description: 'Kanji for person, Japan, language, student, and teacher.',
    mission: 'Read the words on a classroom name card.',
    canDo: 'I can recognize identity words like 日本人 and 学生.',
    items: [
      k('人', 'ジン / ニン', 'ひと', 'person', 2, '日本人 (Japanese person)', 'A person standing with two legs.'),
      k('日', 'ニチ / ジツ', 'ひ / か', 'day / sun', 4, '日本 (Japan)', 'The sun seen through a window.'),
      k('本', 'ホン', 'もと', 'book / origin', 5, '日本 (Japan)', 'A tree with a mark at its root.'),
      k('語', 'ゴ', 'かた.る', 'language / word', 14, '日本語 (Japanese language)', 'Words spoken clearly become a language.'),
      k('学', 'ガク', 'まな.ぶ', 'study / learning', 8, '学生 (student)', 'A child learning under a roof.'),
      k('生', 'セイ / ショウ', 'い.きる / う.まれる', 'life / birth', 5, '先生 (teacher)', 'A plant growing into life.'),
    ],
  },
  {
    title: 'Time markers',
    description: 'Kanji for time, now, every, month, and water.',
    mission: 'Read a simple daily schedule.',
    canDo: 'I can recognize basic schedule kanji.',
    items: [
      k('時', 'ジ', 'とき', 'time / hour', 10, '七時 (seven o’clock)'),
      k('分', 'フン / ブン', 'わ.ける', 'minute / part', 4, '五分 (five minutes)'),
      k('今', 'コン / キン', 'いま', 'now', 4, '今日 (today)'),
      k('毎', 'マイ', 'ごと', 'every', 6, '毎日 (every day)'),
      k('月', 'ゲツ / ガツ', 'つき', 'month / moon', 4, '一月 (January)'),
      k('水', 'スイ', 'みず', 'water', 4, '水曜日 (Wednesday)'),
    ],
  },
]

const N5_GRAMMAR_EXPANDED: LessonDef[] = [
  {
    title: 'Topics, identity, and questions',
    description: 'Build the base sentence frame that JLPT N5 uses everywhere.',
    mission: 'Introduce yourself and ask one identity question without translating word by word.',
    canDo: 'I can use は, も, です, じゃありません, and か in simple identity sentences.',
    items: [
      info('What this unit covers', 'N5 grammar begins with sentence roles. The topic is what the sentence is about, and the ending tells whether it is polite, negative, or a question.', [
        'は marks the topic and is pronounced わ.',
        'です makes a noun or adjective sentence polite.',
        'か turns a polite sentence into a question.',
      ]),
      g('A は B です', 'A is B', 'Topic + は + noun/adjective + です', '私は学生です。', 'I am a student.', 'Do not translate は as "is"; it only marks the topic.'),
      g('A は B じゃありません', 'A is not B', 'Topic + は + noun/na-adjective + じゃありません', '田中さんは先生じゃありません。', 'Tanaka is not a teacher.'),
      g('A も B です', 'A is also B', 'Noun/topic + も + B + です', 'マリアさんも学生です。', 'Maria is also a student.'),
      g('A は B ですか', 'Is A B?', 'Statement + か', 'これは切符ですか。', 'Is this a ticket?'),
      q('私＿＿学生です。', ['は', 'を', 'で', 'に'], 0, 'は marks 私 as the topic of the sentence.', undefined, 'grammar'),
      q('田中さんも学生です。What does も add?', ['also / too', 'from', 'at', 'only'], 0, 'も adds "also" or "too".', undefined, 'grammar'),
      q('これは水です＿＿。', ['か', 'を', 'へ', 'と'], 0, 'か at the end makes a polite question.', undefined, 'grammar'),
    ],
  },
  {
    title: 'This, that, and noun linking',
    description: 'Use これ, それ, あれ, この, その, あの, and の correctly.',
    mission: 'Point to things on the platform and ask what they are.',
    canDo: 'I can distinguish standalone demonstratives from noun-modifying demonstratives.',
    items: [
      info('Coherence check', 'N5 often tests whether you know if a word can stand alone or must attach to a noun.', [
        'これ, それ, あれ stand alone: これは何ですか。',
        'この, その, あの must attach to a noun: この本。',
        'の links nouns, often showing possession or category.',
      ]),
      g('これ / それ / あれ', 'this / that / that over there', 'Demonstrative pronoun + は + ...', 'これは本です。', 'This is a book.'),
      g('この / その / あの + N', 'this/that N', 'Demonstrative adjective + noun', 'この切符はいくらですか。', 'How much is this ticket?'),
      g('A の B', "A's B / B of A", 'Noun + の + noun', '日本語の先生です。', 'A Japanese-language teacher.'),
      g('だれの N ですか', 'whose N is it?', 'だれ + の + noun + ですか', 'これはだれのかばんですか。', 'Whose bag is this?'),
      q('＿＿本は田中さんのです。', ['この', 'これ', 'ここ', 'だれ'], 0, 'この must be followed by a noun, so この本 is correct.', undefined, 'grammar'),
      q('これは＿＿かばんですか。', ['だれの', 'どこ', '何時', 'いくら'], 0, 'だれの asks "whose".', undefined, 'grammar'),
      q('日本語の先生 means what?', ['Japanese-language teacher', 'Teacher is Japan', 'Japanese ticket', 'Teacher goes to Japan'], 0, 'の links 日本語 and 先生 as a noun phrase.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Core particles in action',
    description: 'Choose the right particle for object, place, direction, time, and company.',
    mission: 'Describe one simple trip with what, where, when, and with whom.',
    canDo: 'I can choose は, が, を, に, へ, で, と, から, and まで in beginner sentences.',
    items: [
      info('Particle map', 'Particles are small, but they carry most of the sentence logic in N5 questions.', [
        'を marks the direct object of an action.',
        'で marks where an action happens or the means used.',
        'に marks time, destination, existence location, or indirect target.',
      ]),
      g('N を Vます', 'do V to N', 'Object + を + verb', 'パンを食べます。', 'I eat bread.'),
      g('Place で Vます', 'do V at/in a place', 'Place + で + action verb', '駅で買います。', 'I buy it at the station.'),
      g('Time に Vます', 'do V at a time', 'Time + に + verb', '七時に起きます。', 'I get up at seven.'),
      g('Place へ / に 行きます', 'go to a place', 'Destination + へ/に + movement verb', '学校へ行きます。', 'I go to school.'),
      g('Person と Vます', 'do V with someone', 'Person + と + verb', '友だちと帰ります。', 'I go home with a friend.'),
      g('A から B まで', 'from A to B', 'Start + から + end + まで', '九時から五時まで勉強します。', 'I study from nine to five.'),
      q('駅＿＿切符を買います。', ['で', 'を', 'は', 'と'], 0, 'で marks the place where the action happens.', undefined, 'grammar'),
      q('毎朝、七時＿＿起きます。', ['に', 'で', 'を', 'から'], 0, 'に marks a specific time.', undefined, 'grammar'),
      q('友だち＿＿日本語を勉強します。', ['と', 'を', 'へ', 'まで'], 0, 'と means "with" when linking a person to an action.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Existence and location',
    description: 'Use あります and います without mixing people, animals, and things.',
    mission: 'Describe what is in a station, classroom, or room.',
    canDo: 'I can say where people and things are, and ask whether something exists.',
    items: [
      info('Existence split', 'N5 regularly checks あります versus います and where が and に belong.', [
        'あります is for things, plants, events, and abstract items.',
        'います is for people and animals.',
        'The existing thing/person is usually marked by が.',
      ]),
      g('Place に Thing が あります', 'there is a thing in a place', 'Location + に + thing + が + あります', '駅に店があります。', 'There is a shop at the station.'),
      g('Place に Person が います', 'there is a person in a place', 'Location + に + person + が + います', '教室に先生がいます。', 'There is a teacher in the classroom.'),
      g('Thing は Place に あります', 'the thing is in a place', 'Thing + は + location + に + あります', '本は机の上にあります。', 'The book is on the desk.'),
      g('Person は Place に います', 'the person is in a place', 'Person + は + location + に + います', '田中さんは駅にいます。', 'Tanaka is at the station.'),
      g('Position words', 'above, under, inside, next to', 'Noun + の + 上/下/中/前/後ろ/となり', 'かばんは机の下にあります。', 'The bag is under the desk.'),
      q('教室に学生が＿＿。', ['います', 'あります', 'です', '行きます'], 0, '学生 is a person, so います is used.', undefined, 'grammar'),
      q('机の上に本が＿＿。', ['あります', 'います', '食べます', '来ます'], 0, '本 is a thing, so あります is used.', undefined, 'grammar'),
      q('かばんは机の下＿＿あります。', ['に', 'で', 'を', 'と'], 0, 'に marks the location of existence.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Polite verbs and tense',
    description: 'Control present, negative, past, and past-negative ます forms.',
    mission: 'Talk about today, yesterday, and tomorrow with accurate verb endings.',
    canDo: 'I can recognize and form basic polite verb tenses tested at N5.',
    items: [
      info('Verb ending grid', 'N5 grammar questions often ask for the one ending that matches time and polarity.', [
        'ます is non-past affirmative: do / will do.',
        'ません is non-past negative: do not / will not do.',
        'ました and ませんでした are past forms.',
      ]),
      g('Vます', 'do / will do', 'ます-stem + ます', '毎日、日本語を勉強します。', 'I study Japanese every day.'),
      g('Vません', 'do not / will not do', 'ます-stem + ません', '今日は行きません。', 'I will not go today.'),
      g('Vました', 'did', 'ます-stem + ました', '昨日、映画を見ました。', 'I watched a movie yesterday.'),
      g('Vませんでした', 'did not do', 'ます-stem + ませんでした', '昨日、勉強しませんでした。', 'I did not study yesterday.'),
      g('Frequency + Vます', 'how often something happens', 'いつも/よく/ときどき/あまり/ぜんぜん + verb', 'あまりテレビを見ません。', 'I do not watch TV much.', 'あまり and ぜんぜん pair naturally with negative verbs.'),
      q('昨日、学校へ行き＿＿。', ['ました', 'ます', 'ません', 'です'], 0, '昨日 requires a past form, so 行きました fits.', undefined, 'grammar'),
      q('明日、映画を見＿＿。', ['ます', 'ました', 'でした', 'ませんでした'], 0, '明日 is future, so non-past 見ます is correct.', undefined, 'grammar'),
      q('あまり水を飲み＿＿。', ['ません', 'ました', 'ます', 'でした'], 0, 'あまり usually pairs with a negative form.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Adjectives and noun modifiers',
    description: 'Handle い-adjectives, な-adjectives, and adjective negatives.',
    mission: 'Describe food, tickets, stations, and people naturally.',
    canDo: 'I can choose the right adjective ending before nouns and before です.',
    items: [
      info('Two adjective families', 'N5 adjective questions often test whether the adjective is い-type or な-type.', [
        'い-adjectives keep い before nouns: 大きい駅.',
        'な-adjectives need な before nouns: 静かな町.',
        'Negative and past endings are different for nouns/な-adjectives versus い-adjectives.',
      ]),
      g('い-adjective + N', 'an adjective directly modifies a noun', 'い-adjective + noun', '新しい本を買いました。', 'I bought a new book.'),
      g('い-adjective negative', 'is not ...', 'い -> くないです', 'この切符は高くないです。', 'This ticket is not expensive.'),
      g('い-adjective past', 'was ...', 'い -> かったです', '昨日は寒かったです。', 'Yesterday was cold.'),
      g('な-adjective + N', 'na-adjective modifies a noun', 'な-adjective + な + noun', '静かな町です。', 'It is a quiet town.'),
      g('な-adjective negative', 'is not ...', 'な-adjective/noun + じゃありません', 'この町は静かじゃありません。', 'This town is not quiet.'),
      q('＿＿本を読みました。', ['新しい', '新しいな', '新しく', '新し'], 0, 'い-adjectives directly modify nouns.', undefined, 'grammar'),
      q('静か＿＿町です。', ['な', 'い', 'く', 'の'], 0, 'な-adjectives use な before a noun.', undefined, 'grammar'),
      q('この切符は高＿＿です。', ['くない', 'じゃない', 'ないく', 'ありません'], 0, '高い becomes 高くない in the negative.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Te-form for useful actions',
    description: 'Use て-form for requests, permission, prohibition, and ongoing actions.',
    mission: 'Ask someone to repeat, check permission, and understand simple rules.',
    canDo: 'I can understand common N5 て-form patterns in signs and short conversations.',
    items: [
      info('Why te-form matters', 'て-form is the connector form. N5 learners do not need every advanced use yet, but these patterns appear constantly.', [
        'てください makes a polite request.',
        'てもいいです asks or gives permission.',
        'てはいけません means something is not allowed.',
      ]),
      g('Vてください', 'please do V', 'て-form + ください', 'もう一度言ってください。', 'Please say it one more time.'),
      g('Vてもいいです', 'may do V', 'て-form + もいいです', 'ここで写真を撮ってもいいです。', 'You may take photos here.'),
      g('Vてはいけません', 'must not do V', 'て-form + はいけません', 'ここでたばこを吸ってはいけません。', 'You must not smoke here.'),
      g('Vています', 'is doing / ongoing state', 'て-form + います', '今、日本語を勉強しています。', 'I am studying Japanese now.'),
      g('Vてから', 'after doing V', 'て-form + から', '朝ごはんを食べてから、学校へ行きます。', 'After eating breakfast, I go to school.'),
      q('もう一度言っ＿＿ください。', ['て', 'た', 'ます', 'ない'], 0, 'てください uses the て-form.', undefined, 'grammar'),
      q('ここで写真を撮ってもいいですか。What is being asked?', ['May I take photos here?', 'Did you take photos?', 'Where is the photo?', 'Do not take photos'], 0, 'てもいいですか asks permission.', undefined, 'grammar'),
      q('図書館で話してはいけません。What does it mean?', ['You must not talk in the library.', 'Please talk in the library.', 'You may talk in the library.', 'You talked in the library.'], 0, 'てはいけません means must not.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Wanting, inviting, and offering',
    description: 'Use たい, ましょう, ませんか, and ましょうか for simple social actions.',
    mission: 'Invite a friend, say what you want to do, and offer help.',
    canDo: 'I can understand beginner invitation and desire patterns.',
    items: [
      info('Social endings', 'N5 does not only test statements. It also checks whether you understand invitations and offers.', [
        'たいです attaches to a verb stem for your own wants.',
        'ませんか is a polite invitation.',
        'ましょう and ましょうか suggest doing something together or offering help.',
      ]),
      g('Vたいです', 'want to do V', 'ます-stem + たいです', '日本へ行きたいです。', 'I want to go to Japan.'),
      g('Vたくないです', 'do not want to do V', 'たい -> たくないです', '今日は出かけたくないです。', 'I do not want to go out today.'),
      g('Vませんか', 'would you like to V?', 'ます-stem + ませんか', '一緒に昼ごはんを食べませんか。', 'Would you like to eat lunch together?'),
      g('Vましょう', "let's V", 'ます-stem + ましょう', '駅で会いましょう。', "Let's meet at the station."),
      g('Vましょうか', 'shall I V?', 'ます-stem + ましょうか', '荷物を持ちましょうか。', 'Shall I carry your luggage?'),
      q('日本へ行き＿＿です。', ['たい', 'ますたい', 'ましょう', 'ませんか'], 0, 'たい attaches to the verb stem 行き.', undefined, 'grammar'),
      q('一緒に映画を見＿＿。', ['ませんか', 'たいですか', 'ありますか', 'でしたか'], 0, 'ませんか is a natural invitation.', undefined, 'grammar'),
      q('荷物を持ちましょうか。What is the speaker doing?', ['Offering help', 'Refusing help', 'Asking where luggage is', 'Saying they dislike luggage'], 0, 'ましょうか can offer to do something for someone.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Reasons, sequence, and contrast',
    description: 'Connect short sentences with から, そして, でも, and けど.',
    mission: 'Explain a simple reason and follow a two-sentence message.',
    canDo: 'I can understand basic connectors in N5 reading and listening.',
    items: [
      info('Sentence glue', 'JLPT grammar is not just filling particles. Even N5 asks how ideas connect.', [
        'から gives a reason: because.',
        'そして adds the next action or fact.',
        'でも and けど mark contrast.',
      ]),
      g('Sentence から', 'because / so', 'Reason sentence + から', '雨ですから、バスで行きます。', 'Because it is raining, I will go by bus.'),
      g('そして', 'and then / and also', 'Sentence. そして sentence.', '朝ごはんを食べます。そして、学校へ行きます。', 'I eat breakfast. Then I go to school.'),
      g('でも', 'but / however', 'Sentence. でも sentence.', 'この店は安いです。でも、遠いです。', 'This shop is cheap. But it is far.'),
      g('けど / が', 'but / although', 'Clause + けど/が', '高いけど、おいしいです。', 'It is expensive, but delicious.'),
      g('もう / まだ', 'already / not yet', 'もう + affirmative; まだ + negative for not yet', 'もう昼ごはんを食べました。', 'I already ate lunch.'),
      q('雨です＿＿、バスで行きます。', ['から', 'まで', 'と', 'を'], 0, 'から gives the reason.', undefined, 'grammar'),
      q('この店は安いです。＿＿、遠いです。', ['でも', 'そして', 'もう', 'まで'], 0, 'でも shows contrast.', undefined, 'grammar'),
      q('まだ宿題をし＿＿。', ['ていません', 'ました', 'ます', 'たいです'], 0, 'まだ with "not yet" uses a negative ongoing/completed expression.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Comparisons and preferences',
    description: 'Answer common N5 comparison questions using より, ほうが, 一番, and 好き.',
    mission: 'Say which route, food, or subject you prefer.',
    canDo: 'I can understand basic comparison and preference questions.',
    items: [
      info('Comparison frame', 'N5 comparison items are predictable, but only if you know the frame.', [
        'A は B より adjective means A is more adjective than B.',
        'A と B と どちらが asks which of two.',
        '一番 asks for the most among three or more.',
      ]),
      g('A は B より Adj です', 'A is more Adj than B', 'A + は + B + より + adjective + です', '電車はバスより速いです。', 'The train is faster than the bus.'),
      g('A より B のほうが Adj です', 'B is more Adj than A', 'A + より + B + のほうが + adjective + です', 'バスより電車のほうが速いです。', 'The train is faster than the bus.'),
      g('A と B と どちらが Adj ですか', 'which is more Adj, A or B?', 'A + と + B + と + どちらが + adjective + ですか', '水とお茶とどちらが好きですか。', 'Which do you like, water or tea?'),
      g('N が好きです', 'like N', 'Noun + が + 好きです', '日本語が好きです。', 'I like Japanese.'),
      g('N の中で A が一番 Adj です', 'A is the most Adj among N', 'Group + の中で + item + が一番 + adjective', '一年の中で七月が一番暑いです。', 'July is the hottest month of the year.'),
      q('電車はバス＿＿速いです。', ['より', 'まで', 'から', 'を'], 0, 'より marks the comparison baseline.', undefined, 'grammar'),
      q('日本語＿＿好きです。', ['が', 'を', 'に', 'で'], 0, '好きです takes が for the liked thing.', undefined, 'grammar'),
      q('クラスの中で、田中さんが＿＿背が高いです。', ['一番', 'より', 'まだ', 'でも'], 0, '一番 marks the superlative: the most.', undefined, 'grammar'),
    ],
  },
]

const N5_LISTENING: LessonDef[] = [
  {
    title: 'Greeting on board',
    description: 'Slow short exchanges about names and roles.',
    mission: 'Understand a first meeting on the train.',
    canDo: 'I can pick out names, roles, and greetings from a slow dialogue.',
    items: [
      q('Listen: 「はじめまして。私はアリです。」What does the speaker say?', ['Nice to meet you. I am Ari.', 'Where is Ari?', 'Ari is a teacher.', 'This is Ari’s ticket.'], 0, 'はじめまして is used when meeting someone for the first time.', 'はじめまして。私はアリです。', 'listening'),
      q('Listen: 「田中さんは先生ですか。」What is being asked?', ['Is Tanaka a teacher?', 'Is Tanaka a student?', 'Where is Tanaka?', 'What is Tanaka’s name?'], 0, '先生 = teacher; ですか makes it a question.', '田中さんは先生ですか。', 'listening'),
      q('Listen: 「いいえ、学生です。」What is the answer?', ['No, a student.', 'Yes, a teacher.', 'No, Japan.', 'Yes, a name.'], 0, 'いいえ = no; 学生です = is a student.', 'いいえ、学生です。', 'listening'),
    ],
  },
  {
    title: 'Station audio',
    description: 'Short announcements about platforms, time, and tickets.',
    items: [
      q('Listen: 「電車は二番線です。」Where is the train?', ['Platform 1', 'Platform 2', 'Platform 3', 'Platform 5'], 1, '二番線 means platform two.', '電車は二番線です。', 'listening'),
      q('Listen: 「三時に会いましょう。」When will they meet?', ['At 2:00', 'At 3:00', 'At 4:00', 'At 5:00'], 1, '三時 = three o’clock.', '三時に会いましょう。', 'listening'),
      q('Listen: 「切符は五百円です。」How much is the ticket?', ['100 yen', '300 yen', '500 yen', '1,000 yen'], 2, '五百円 = 500 yen.', '切符は五百円です。', 'listening'),
    ],
  },
]

const N5_READING: LessonDef[] = [
  {
    title: 'Name cards and signs',
    description: 'Read very short identity texts and station signs.',
    mission: 'Read the first signs on the Kanji Express platform.',
    canDo: 'I can understand names, roles, and platform signs.',
    items: [
      q('What is Ari?', ['Student', 'Teacher', 'Company worker', 'Station staff'], 0, 'アリ says 私は学生です, so Ari is a student.', 'アリ\n日本語の学生です。', 'reading'),
      q('Which platform should you use?', ['Platform 1', 'Platform 2', 'Platform 3', 'Platform 4'], 1, '二番線 means platform two.', '京都行き\n二番線', 'reading'),
      q('What language does Tanaka teach?', ['Japanese', 'English', 'Chinese', 'Korean'], 0, '日本語の先生 means Japanese-language teacher.', '田中先生\n日本語の先生', 'reading'),
    ],
  },
  {
    title: 'Simple schedules',
    description: 'Read time, day, and place from short messages.',
    items: [
      q('When will they meet?', ['Today at 3', 'Tomorrow at 3', 'Tomorrow at 5', 'On the weekend'], 1, '明日 = tomorrow; 三時 = three o’clock.', '明日、三時に駅で会いましょう。', 'reading'),
      q('Where is the shop?', ['In the station', 'In the school', 'In the hospital', 'In the company'], 0, '駅に店があります means there is a shop at the station.', '駅に店があります。水とパンを買います。', 'reading'),
    ],
  },
]

const N5_TESTS_EXPANDED: LessonDef[] = [
  {
    title: 'Checkpoint 1: sentence roles',
    description: 'JLPT-style review of topics, demonstratives, particles, and existence.',
    mission: 'Pass the first N5 grammar gate before moving into verb tense.',
    canDo: 'I can choose basic particles and sentence frames in short N5 questions.',
    items: [
      q('私は学生＿＿ありません。', ['じゃ', 'を', 'で', 'に'], 0, 'じゃありません is the polite negative for nouns and な-adjectives.', undefined, 'grammar'),
      q('＿＿切符はいくらですか。', ['この', 'これ', 'ここ', 'だれ'], 0, 'この must attach to a noun: この切符.', undefined, 'grammar'),
      q('駅＿＿水を買いました。', ['で', 'に', 'を', 'へ'], 0, 'で marks where an action happens.', undefined, 'grammar'),
      q('机の上に本が＿＿。', ['あります', 'います', 'です', '行きます'], 0, '本 is a thing, so あります is correct.', undefined, 'grammar'),
      q('田中さんは教室＿＿います。', ['に', 'で', 'を', 'と'], 0, 'に marks the location where someone exists.', undefined, 'grammar'),
      q('日本語＿＿先生です。', ['の', 'で', 'へ', 'まで'], 0, 'の links nouns: 日本語の先生.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Checkpoint 2: forms and functions',
    description: 'JLPT-style review of verbs, adjectives, te-form, connectors, and comparisons.',
    mission: 'Prove you can pick forms by meaning, not by memorized English labels.',
    canDo: 'I can answer N5 grammar questions involving tense, requests, desire, reasons, and comparisons.',
    items: [
      q('昨日、映画を見＿＿。', ['ました', 'ます', 'ません', 'でしょう'], 0, '昨日 requires a past form.', undefined, 'grammar'),
      q('この町は静か＿＿町です。', ['な', 'い', 'の', 'く'], 0, '静か is a な-adjective, so 静かな町 is correct.', undefined, 'grammar'),
      q('ここで写真を撮っ＿＿いけません。', ['ては', 'ても', 'てから', 'たい'], 0, 'てはいけません means must not do.', undefined, 'grammar'),
      q('日本へ行き＿＿です。', ['たい', 'ましょう', 'ませんか', 'ますたい'], 0, 'たい attaches to the verb stem.', undefined, 'grammar'),
      q('雨です＿＿、バスで行きます。', ['から', 'けど', 'より', 'まで'], 0, 'から gives the reason.', undefined, 'grammar'),
      q('電車はバス＿＿速いです。', ['より', 'から', 'まで', 'と'], 0, 'より marks the comparison baseline.', undefined, 'grammar'),
      q('水とお茶と、どちら＿＿好きですか。', ['が', 'を', 'で', 'に'], 0, '好きです uses が for the liked/preferred item.', undefined, 'grammar'),
    ],
  },
]

const N5_OVERVIEW_COMPLETE: LessonDef[] = [
  ...N5_OVERVIEW,
  {
    title: 'N5 readiness map',
    description: 'See how vocabulary, kanji, grammar, reading, and listening connect before test prep.',
    mission: 'Understand the whole N5 route as one test-readiness system.',
    canDo: 'I can explain what each N5 course section contributes to JLPT readiness.',
    items: [
      info('End-to-end route', 'N5 readiness is not built by memorizing isolated lists. Each section feeds the next one.', [
        'Vocabulary gives the nouns, verbs, adjectives, time words, and question words used in every drill.',
        'Kanji lessons prioritize high-frequency forms that appear in signs, schedules, dates, places, and people words.',
        'Grammar turns those words into sentence patterns, then reading/listening reuse the same situations.',
      ]),
      info('What the real test checks', 'At N5, the exam checks language knowledge, reading, and listening through short, controlled Japanese.', [
        'Language knowledge: word meaning, readings, orthography, particles, verb/adjective forms, and sentence assembly.',
        'Reading: short notices, messages, schedules, and everyday passages.',
        'Listening: slow task-based prompts, point questions, short expressions, and immediate responses.',
      ]),
      q('Why does this N5 course reuse the same words across sections?', ['To make vocabulary, kanji, grammar, reading, and listening reinforce each other', 'To avoid teaching grammar', 'To make every quiz identical', 'To skip test practice'], 0, 'A coherent beginner course reuses language across skills so students can recognize it in context.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Before the N5 mock test',
    description: 'Know the practical abilities you should have before attempting a full practice test.',
    mission: 'Use a readiness checklist instead of guessing whether you are prepared.',
    canDo: 'I can identify the weak skill area that would block my N5 score.',
    items: [
      info('You are ready when', 'A student should not take a full N5 mock test just because they finished a few flashcards.', [
        'You can read kana comfortably and recognize the most common beginner kanji in context.',
        'You can choose particles and polite verb/adjective endings in short sentences.',
        'You can understand slow short audio about names, places, time, prices, invitations, and simple rules.',
      ]),
      info('Warning signs', 'These are the gaps that usually make N5 feel harder than expected.', [
        'You know a word on a flashcard but cannot recognize it inside a sentence.',
        'You can translate examples but cannot choose the missing particle or verb ending.',
        'You understand a reading passage only after looking up every word.',
      ]),
      q('What is the best signal that you are ready for N5 reading practice?', ['You can find who, where, when, and why in short Japanese messages', 'You memorized one kanji story', 'You can write essays', 'You can read native editorials'], 0, 'N5 reading focuses on extracting concrete information from short texts.', undefined, 'grammar'),
    ],
  },
  {
    title: 'How to study N5 efficiently',
    description: 'Use short sessions, retrieval, and mixed review to avoid fragile memorization.',
    mission: 'Set the right study loop before finishing N5.',
    canDo: 'I can choose an effective N5 review method for vocabulary, kanji, grammar, reading, and listening.',
    items: [
      info('Daily loop', 'N5 benefits from lightweight repetition, but the repetition must include real sentence use.', [
        'Review vocabulary with example sentences, not only English meanings.',
        'Review kanji through compounds that appear in vocab, reading, and listening transcripts.',
        'Mix grammar quizzes with short reading/listening so forms become usable.',
      ]),
      info('Express rule', 'Keep lessons short, but make the connections strong.', [
        'One topic should appear first as vocabulary/kanji, then as grammar, then inside reading/listening.',
        'Every checkpoint should ask both recognition and sentence-function questions.',
        'A wrong answer should tell the student what rule or signal they missed.',
      ]),
      q('Which review plan is strongest for N5?', ['Review words inside sentences and mix them with grammar, reading, and listening', 'Only copy kanji 100 times', 'Only watch dramas without study', 'Only memorize English translations'], 0, 'Mixed retrieval makes beginner knowledge usable in JLPT-style questions.', undefined, 'grammar'),
    ],
  },
]

const N5_VOCAB_COMPLETE: LessonDef[] = [
  ...N5_VOCAB,
  {
    title: 'Family and people',
    description: 'Recognize family, friends, and people words used in basic conversations.',
    mission: 'Understand a short conversation about who is at home, school, or work.',
    canDo: 'I can identify common people words in simple N5 sentences.',
    items: [
      v('家族', 'かぞく', 'family', '家族は四人です。', 'My family has four people.', 'noun'),
      v('父', 'ちち', 'my father', '父は会社にいます。', 'My father is at the company.', 'noun'),
      v('母', 'はは', 'my mother', '母は店で働きます。', 'My mother works at a shop.', 'noun'),
      v('友だち', 'ともだち', 'friend', '友だちと学校へ行きます。', 'I go to school with a friend.', 'noun'),
      v('子ども', 'こども', 'child', '公園に子どもがいます。', 'There is a child in the park.', 'noun'),
      v('男の人', 'おとこのひと', 'man', 'あの男の人は先生です。', 'That man is a teacher.', 'noun phrase'),
      v('女の人', 'おんなのひと', 'woman', '女の人が駅にいます。', 'There is a woman at the station.', 'noun phrase'),
      v('だれ', 'だれ', 'who', 'これはだれの本ですか。', 'Whose book is this?', 'question word'),
      q('家族 means what?', ['family', 'ticket', 'station', 'time'], 0, '家族 means family.', undefined, 'vocab'),
      q('友だち＿＿学校へ行きます。', ['と', 'を', 'で', 'まで'], 0, 'と marks doing something with a person.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Daily routine verbs',
    description: 'Use the basic verbs that appear in N5 schedules and listening prompts.',
    mission: 'Describe one school day from morning to night.',
    canDo: 'I can understand common routine verbs in polite present and past forms.',
    items: [
      v('起きる', 'おきる', 'to wake up', '七時に起きます。', 'I wake up at seven.', 'verb'),
      v('寝る', 'ねる', 'to sleep / go to bed', '十一時に寝ます。', 'I go to bed at eleven.', 'verb'),
      v('食べる', 'たべる', 'to eat', '朝ごはんを食べます。', 'I eat breakfast.', 'verb'),
      v('飲む', 'のむ', 'to drink', '水を飲みます。', 'I drink water.', 'verb'),
      v('見る', 'みる', 'to see / watch', 'テレビを見ました。', 'I watched TV.', 'verb'),
      v('聞く', 'きく', 'to listen / ask', '日本語を聞きます。', 'I listen to Japanese.', 'verb'),
      v('読む', 'よむ', 'to read', '本を読みます。', 'I read a book.', 'verb'),
      v('書く', 'かく', 'to write', '名前を書いてください。', 'Please write your name.', 'verb'),
      q('昨日、本を＿＿。', ['読みました', '読みます', '読ません', '読むです'], 0, '昨日 requires the past polite form 読みました.', undefined, 'grammar'),
      q('名前を＿＿ください。', ['書いて', '書きます', '書いた', '書く'], 0, 'てください uses the te-form: 書いてください.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Adjectives for everyday choices',
    description: 'Describe places, tickets, weather, and food with common N5 adjectives.',
    mission: 'Choose a route, shop, or meal using simple descriptions.',
    canDo: 'I can recognize common い-adjectives and な-adjectives in N5 questions.',
    items: [
      v('大きい', 'おおきい', 'big', '大きい駅です。', 'It is a big station.', 'い-adjective'),
      v('小さい', 'ちいさい', 'small', '小さい店があります。', 'There is a small shop.', 'い-adjective'),
      v('新しい', 'あたらしい', 'new', '新しい本を買いました。', 'I bought a new book.', 'い-adjective'),
      v('古い', 'ふるい', 'old', 'この車は古いです。', 'This car is old.', 'い-adjective'),
      v('高い', 'たかい', 'expensive / tall', 'この切符は高いです。', 'This ticket is expensive.', 'い-adjective'),
      v('安い', 'やすい', 'cheap', 'あの店は安いです。', 'That shop is cheap.', 'い-adjective'),
      v('静か', 'しずか', 'quiet', '静かな町です。', 'It is a quiet town.', 'な-adjective'),
      v('便利', 'べんり', 'convenient', '駅は便利です。', 'The station is convenient.', 'な-adjective'),
      q('静か＿＿町です。', ['な', 'い', 'の', 'く'], 0, '静か is a な-adjective, so it uses な before a noun.', undefined, 'grammar'),
      q('高い means what in この切符は高いです?', ['expensive', 'quiet', 'small', 'new'], 0, 'For a ticket, 高い means expensive.', undefined, 'vocab'),
    ],
  },
  {
    title: 'Question words and counters',
    description: 'Answer who, what, where, when, how much, and how many in beginner contexts.',
    mission: 'Handle ticket counter questions without losing the key detail.',
    canDo: 'I can recognize common N5 question words and simple counters.',
    items: [
      v('何', 'なに / なん', 'what', 'これは何ですか。', 'What is this?', 'question word'),
      v('どこ', 'どこ', 'where', '駅はどこですか。', 'Where is the station?', 'question word'),
      v('いつ', 'いつ', 'when', 'テストはいつですか。', 'When is the test?', 'question word'),
      v('いくら', 'いくら', 'how much', 'この本はいくらですか。', 'How much is this book?', 'question word'),
      v('いくつ', 'いくつ', 'how many / how old', 'りんごはいくつありますか。', 'How many apples are there?', 'question word'),
      v('一つ', 'ひとつ', 'one thing', 'お茶を一つください。', 'One tea, please.', 'counter'),
      v('二つ', 'ふたつ', 'two things', 'パンを二つ買います。', 'I buy two breads.', 'counter'),
      v('何人', 'なんにん', 'how many people', '家族は何人ですか。', 'How many people are in your family?', 'question word'),
      q('この本は＿＿ですか。', ['いくら', 'どこ', 'だれ', 'いつ'], 0, 'いくら asks the price.', undefined, 'vocab'),
      q('家族は＿＿ですか。', ['何人', '何時', 'いくら', 'どこ'], 0, '何人 asks how many people.', undefined, 'vocab'),
    ],
  },
  {
    title: 'Rules, invitations, and classroom actions',
    description: 'Recognize high-frequency classroom and rule words used with te-form grammar.',
    mission: 'Understand teacher instructions and simple public rules.',
    canDo: 'I can follow short N5 instructions such as please write, please listen, and do not enter.',
    items: [
      v('言う', 'いう', 'to say', 'もう一度言ってください。', 'Please say it one more time.', 'verb'),
      v('話す', 'はなす', 'to speak', '教室で話してはいけません。', 'You must not speak in the classroom.', 'verb'),
      v('待つ', 'まつ', 'to wait', '五分待ってください。', 'Please wait five minutes.', 'verb'),
      v('入る', 'はいる', 'to enter', 'ここに入ってはいけません。', 'You must not enter here.', 'verb'),
      v('写真', 'しゃしん', 'photo', '写真を撮ってもいいですか。', 'May I take a photo?', 'noun'),
      v('宿題', 'しゅくだい', 'homework', 'まだ宿題をしていません。', 'I have not done my homework yet.', 'noun'),
      v('一緒に', 'いっしょに', 'together', '一緒に映画を見ませんか。', 'Would you like to watch a movie together?', 'adverb'),
      v('大丈夫', 'だいじょうぶ', 'all right / okay', 'ここで待っても大丈夫です。', 'It is okay to wait here.', 'な-adjective'),
      q('もう一度＿＿ください。', ['言って', '言います', '言いました', '言う'], 0, 'A request uses te-form + ください.', undefined, 'grammar'),
      q('一緒に映画を見ませんか。What is this?', ['An invitation', 'A prohibition', 'A price question', 'A location question'], 0, 'ませんか is a polite invitation.', undefined, 'grammar'),
    ],
  },
]

const N5_KANJI_COMPLETE: LessonDef[] = [
  ...N5_KANJI,
  {
    title: 'Numbers 六 to 十 and yen',
    description: 'Complete the most common N5 number kanji used in dates, times, prices, and counters.',
    mission: 'Read prices and times on a ticket machine.',
    canDo: 'I can recognize six through ten and yen in beginner notices.',
    items: [
      k('六', 'ロク', 'む / むい', 'six', 4, '六月 (June)'),
      k('七', 'シチ', 'なな / なの', 'seven', 2, '七時 (seven o’clock)'),
      k('八', 'ハチ', 'や / よう', 'eight', 2, '八月 (August)'),
      k('九', 'キュウ / ク', 'ここの', 'nine', 2, '九時 (nine o’clock)'),
      k('十', 'ジュウ', 'とお', 'ten', 2, '十人 (ten people)'),
      k('円', 'エン', 'まる.い', 'yen / circle', 4, '五百円 (500 yen)'),
    ],
  },
  {
    title: 'Days and dates',
    description: 'Kanji that anchor N5 schedules, dates, and daily routine passages.',
    mission: 'Read a basic calendar and meeting note.',
    canDo: 'I can recognize day, week, year, morning, noon, and evening words.',
    items: [
      k('火', 'カ', 'ひ', 'fire / Tuesday', 4, '火曜日 (Tuesday)'),
      k('木', 'モク / ボク', 'き', 'tree / Thursday', 4, '木曜日 (Thursday)'),
      k('金', 'キン', 'かね', 'gold / money / Friday', 8, '金曜日 (Friday)'),
      k('土', 'ド / ト', 'つち', 'earth / Saturday', 3, '土曜日 (Saturday)'),
      k('曜', 'ヨウ', '', 'weekday', 18, '水曜日 (Wednesday)'),
      k('年', 'ネン', 'とし', 'year', 6, '一年 (one year)'),
      k('午', 'ゴ', '', 'noon', 4, '午前 (morning / a.m.)'),
      k('前', 'ゼン', 'まえ', 'before / front', 9, '駅の前 (in front of the station)'),
    ],
  },
  {
    title: 'Places and movement',
    description: 'Kanji that appear in N5 signs and simple travel passages.',
    mission: 'Read a station-area notice without relying only on kana.',
    canDo: 'I can recognize common place and movement kanji in N5 texts.',
    items: [
      k('駅', 'エキ', '', 'station', 14, '駅前 (in front of the station)'),
      k('車', 'シャ', 'くるま', 'car / vehicle', 7, '電車 (train)'),
      k('電', 'デン', '', 'electricity', 13, '電車 (train)'),
      k('校', 'コウ', '', 'school', 10, '学校 (school)'),
      k('店', 'テン', 'みせ', 'shop', 8, '店員 (shop staff)'),
      k('行', 'コウ / ギョウ', 'い.く', 'go', 6, '行きます (go)'),
      k('来', 'ライ', 'く.る', 'come', 7, '来ます (come)'),
      k('帰', 'キ', 'かえ.る', 'return home', 10, '帰ります (return)'),
    ],
  },
  {
    title: 'Daily life objects',
    description: 'Kanji for books, food, drink, writing, and common study objects.',
    mission: 'Recognize classroom and daily-life nouns inside simple sentences.',
    canDo: 'I can connect common object kanji to vocabulary used in N5 reading.',
    items: [
      k('何', 'カ', 'なに / なん', 'what', 7, '何時 (what time)'),
      k('食', 'ショク', 'た.べる', 'eat / food', 9, '食べます (eat)'),
      k('飲', 'イン', 'の.む', 'drink', 12, '飲みます (drink)'),
      k('見', 'ケン', 'み.る', 'see', 7, '見ます (see)'),
      k('聞', 'ブン / モン', 'き.く', 'hear / ask', 14, '聞きます (listen / ask)'),
      k('読', 'ドク', 'よ.む', 'read', 14, '読みます (read)'),
      k('書', 'ショ', 'か.く', 'write', 10, '書きます (write)'),
      k('友', 'ユウ', 'とも', 'friend', 4, '友だち (friend)'),
    ],
  },
  {
    title: 'People and family',
    description: 'Kanji for people, family, and basic social roles.',
    mission: 'Read a short self-introduction or family note.',
    canDo: 'I can recognize beginner people and family kanji in context.',
    items: [
      k('父', 'フ', 'ちち', 'father', 4, '父 (my father)'),
      k('母', 'ボ', 'はは', 'mother', 5, '母 (my mother)'),
      k('子', 'シ', 'こ', 'child', 3, '子ども (child)'),
      k('女', 'ジョ', 'おんな', 'woman', 3, '女の人 (woman)'),
      k('男', 'ダン / ナン', 'おとこ', 'man', 7, '男の人 (man)'),
      k('名', 'メイ / ミョウ', 'な', 'name', 6, '名前 (name)'),
      k('先', 'セン', 'さき', 'previous / ahead', 6, '先生 (teacher)'),
      k('会', 'カイ', 'あ.う', 'meet', 6, '会社 (company)'),
    ],
  },
  {
    title: 'Adjectives and directions',
    description: 'Kanji that support common N5 descriptions and location phrases.',
    mission: 'Understand simple signs and descriptions such as big station, cheap shop, and under the desk.',
    canDo: 'I can recognize common descriptive and position kanji.',
    items: [
      k('大', 'ダイ / タイ', 'おお.きい', 'big', 3, '大きい (big)'),
      k('小', 'ショウ', 'ちい.さい', 'small', 3, '小さい (small)'),
      k('新', 'シン', 'あたら.しい', 'new', 13, '新しい (new)'),
      k('古', 'コ', 'ふる.い', 'old', 5, '古い (old)'),
      k('高', 'コウ', 'たか.い', 'expensive / tall', 10, '高い (expensive / tall)'),
      k('安', 'アン', 'やす.い', 'cheap / peaceful', 6, '安い (cheap)'),
      k('上', 'ジョウ', 'うえ', 'above / up', 3, '机の上 (on the desk)'),
      k('下', 'カ / ゲ', 'した', 'below / down', 3, '机の下 (under the desk)'),
    ],
  },
  {
    title: 'N5 kanji readiness checkpoint',
    description: 'Practice readings and meanings the way N5 language knowledge questions ask them.',
    mission: 'Confirm that the kanji lessons are usable in test-style prompts.',
    canDo: 'I can choose common readings and meanings for beginner kanji compounds.',
    items: [
      q('Choose the correct reading: 学生', ['がくせい', 'がっこう', 'せんせい', 'にほんご'], 0, '学生 is read がくせい.', undefined, 'vocab'),
      q('Choose the correct reading: 電車', ['でんしゃ', 'でんき', 'くるま', 'えき'], 0, '電車 is read でんしゃ.', undefined, 'vocab'),
      q('「駅」の meaning is what?', ['station', 'school', 'shop', 'book'], 0, '駅 means station.', undefined, 'vocab'),
      q('Choose the correct kanji for みず.', ['水', '木', '火', '金'], 0, 'みず is 水.', undefined, 'vocab'),
      q('Choose the correct reading: 名前', ['なまえ', 'なんにん', 'まえ', 'なに'], 0, '名前 is read なまえ.', undefined, 'vocab'),
    ],
  },
]

const N5_LISTENING_COMPLETE: LessonDef[] = [
  ...N5_LISTENING,
  {
    title: 'Classroom instructions',
    description: 'Understand short teacher directions using てください and てはいけません.',
    mission: 'Follow basic classroom audio before a test starts.',
    canDo: 'I can understand simple requests and rules in slow N5 audio.',
    items: [
      q('Listen: 「名前を書いてください。」What should you do?', ['Write your name', 'Read a book', 'Buy a ticket', 'Go home'], 0, '書いてください means please write.', '名前を書いてください。', 'listening'),
      q('Listen: 「ここで話してはいけません。」What is not allowed?', ['Talking here', 'Waiting here', 'Writing here', 'Eating here'], 0, '話してはいけません means must not talk.', 'ここで話してはいけません。', 'listening'),
      q('Listen: 「もう一度聞いてください。」What is requested?', ['Listen one more time', 'Write one more name', 'Buy one more ticket', 'Go one more time'], 0, 'もう一度 means one more time, and 聞いてください means please listen.', 'もう一度聞いてください。', 'listening'),
    ],
  },
  {
    title: 'Daily routine audio',
    description: 'Catch time, frequency, and verb tense in slow everyday statements.',
    mission: 'Understand a short morning routine.',
    canDo: 'I can identify when an action happens and whether it is past or habitual.',
    items: [
      q('Listen: 「毎朝、七時に起きます。」When does the speaker wake up?', ['Every morning at seven', 'Every night at seven', 'Yesterday at seven', 'Tomorrow at nine'], 0, '毎朝 = every morning; 七時に = at seven.', '毎朝、七時に起きます。', 'listening'),
      q('Listen: 「昨日、映画を見ました。」When did the speaker watch a movie?', ['Yesterday', 'Today', 'Tomorrow', 'Every week'], 0, '昨日 plus 見ました shows past time.', '昨日、映画を見ました。', 'listening'),
      q('Listen: 「あまりテレビを見ません。」What does the speaker say?', ['They do not watch much TV', 'They watched TV yesterday', 'They want to watch TV', 'The TV is expensive'], 0, 'あまり pairs with a negative verb: not much.', 'あまりテレビを見ません。', 'listening'),
    ],
  },
  {
    title: 'Shopping and price audio',
    description: 'Understand short exchanges about food, quantity, and money.',
    mission: 'Buy food from a counter using slow Japanese.',
    canDo: 'I can catch item, quantity, and price in a simple transaction.',
    items: [
      q('Listen: 「パンを二つください。」What does the customer want?', ['Two breads', 'Two teas', 'One bread', 'Five tickets'], 0, '二つ is two general items.', 'パンを二つください。', 'listening'),
      q('Listen: 「この本は八百円です。」How much is the book?', ['800 yen', '500 yen', '80 yen', '8,000 yen'], 0, '八百円 means 800 yen.', 'この本は八百円です。', 'listening'),
      q('Listen: 「水とお茶と、どちらが好きですか。」What is being asked?', ['Which do you like, water or tea?', 'Where is the tea?', 'How much is water?', 'Do you have water?'], 0, 'どちらが好きですか asks preference between two things.', '水とお茶と、どちらが好きですか。', 'listening'),
    ],
  },
  {
    title: 'Immediate response practice',
    description: 'Choose the natural reply to short N5-level prompts.',
    mission: 'React to simple questions without translating every word.',
    canDo: 'I can choose an appropriate beginner response to a short spoken prompt.',
    items: [
      q('Listen: 「お名前は何ですか。」Choose the best response.', ['アリです。', '駅です。', '五百円です。', '明日です。'], 0, 'A name question should be answered with a name.', 'お名前は何ですか。', 'listening'),
      q('Listen: 「一緒に昼ごはんを食べませんか。」Choose the best response.', ['いいですね。食べましょう。', '机の上です。', '八時です。', '水を二つください。'], 0, 'ませんか is an invitation, so accepting with ましょう fits.', '一緒に昼ごはんを食べませんか。', 'listening'),
      q('Listen: 「ここで写真を撮ってもいいですか。」Choose the best response.', ['はい、いいです。', '昨日でした。', '本を読みます。', '七人です。'], 0, 'てもいいですか asks permission; はい、いいです grants it.', 'ここで写真を撮ってもいいですか。', 'listening'),
    ],
  },
]

const N5_READING_COMPLETE: LessonDef[] = [
  ...N5_READING,
  {
    title: 'Classroom note',
    description: 'Read a short instruction note with names, time, and actions.',
    mission: 'Understand what to do before class starts.',
    canDo: 'I can extract action, time, and rule from a short school note.',
    items: [
      q('What should students write?', ['Their name', 'Their address', 'The price', 'The station name'], 0, '名前を書いてください says please write your name.', 'テストの前に、名前を書いてください。九時に始めます。', 'reading'),
      q('When does the test start?', ['At 9:00', 'At 7:00', 'At 5:00', 'Tomorrow'], 0, '九時に始めます means it starts at nine.', 'テストの前に、名前を書いてください。九時に始めます。', 'reading'),
      q('What is not allowed?', ['Talking in the classroom', 'Writing a name', 'Reading a book', 'Listening again'], 0, '教室で話してはいけません means talking in the classroom is not allowed.', '教室で話してはいけません。静かにしてください。', 'reading'),
    ],
  },
  {
    title: 'Store notice',
    description: 'Read a simple shop notice with price, item, and location information.',
    mission: 'Find what to buy and how much it costs.',
    canDo: 'I can understand simple price and item information in a notice.',
    items: [
      q('What is cheap today?', ['Bread', 'Fish', 'A ticket', 'A book'], 0, 'パン is bread, and 安い means cheap.', '今日はパンが安いです。一つ百円です。', 'reading'),
      q('How much is one bread?', ['100 yen', '200 yen', '500 yen', '800 yen'], 0, '一つ百円 means one item is 100 yen.', '今日はパンが安いです。一つ百円です。', 'reading'),
      q('Where is the shop?', ['In front of the station', 'Inside the school', 'Under the desk', 'Next to the hospital'], 0, '駅の前 means in front of the station.', '店は駅の前にあります。水とお茶を売っています。', 'reading'),
    ],
  },
  {
    title: 'Daily schedule',
    description: 'Read a beginner schedule and distinguish yesterday, today, and tomorrow.',
    mission: 'Understand a learner’s day from a short message.',
    canDo: 'I can identify time, action, and sequence in a short N5 passage.',
    items: [
      q('What does the writer do at seven?', ['Wake up', 'Sleep', 'Go shopping', 'Watch a movie'], 0, '七時に起きます means wake up at seven.', '毎朝、七時に起きます。朝ごはんを食べてから、学校へ行きます。', 'reading'),
      q('What happens after breakfast?', ['The writer goes to school', 'The writer goes to bed', 'The writer buys a ticket', 'The writer watches TV'], 0, '食べてから、学校へ行きます means after eating, go to school.', '毎朝、七時に起きます。朝ごはんを食べてから、学校へ行きます。', 'reading'),
      q('When did the writer watch a movie?', ['Yesterday', 'Tomorrow', 'Every morning', 'Next week'], 0, '昨日、映画を見ました means watched a movie yesterday.', '昨日、友だちと映画を見ました。でも、今日は宿題をします。', 'reading'),
    ],
  },
  {
    title: 'Invitation message',
    description: 'Read a short invitation and understand time, place, and response.',
    mission: 'Decide whether you can meet a friend.',
    canDo: 'I can understand an N5-level invitation message.',
    items: [
      q('What is the invitation?', ['Eat lunch together', 'Take a photo', 'Go to the hospital', 'Write a name'], 0, '昼ごはんを食べませんか is an invitation to eat lunch.', '明日、駅の前で会いませんか。一緒に昼ごはんを食べましょう。', 'reading'),
      q('Where will they meet?', ['In front of the station', 'At school', 'At a shop', 'Inside the train'], 0, '駅の前で means in front of the station.', '明日、駅の前で会いませんか。一緒に昼ごはんを食べましょう。', 'reading'),
      q('When will they meet?', ['Tomorrow', 'Today', 'Yesterday', 'Every morning'], 0, '明日 means tomorrow.', '明日、駅の前で会いませんか。一緒に昼ごはんを食べましょう。', 'reading'),
    ],
  },
]

const N5_TESTS_COMPLETE: LessonDef[] = [
  ...N5_TESTS_EXPANDED,
  {
    title: 'Checkpoint 3: vocabulary and kanji',
    description: 'JLPT-style review of N5 word meaning, readings, and kanji recognition.',
    mission: 'Check whether the N5 words and kanji are recognizable in test format.',
    canDo: 'I can answer common N5 vocabulary and kanji questions without seeing translations first.',
    items: [
      q('Choose the correct reading: 学校', ['がっこう', 'がくせい', 'こうしゃ', 'せんせい'], 0, '学校 is read がっこう.', undefined, 'vocab'),
      q('Choose the correct kanji for でんしゃ.', ['電車', '駅車', '車電', '会社'], 0, 'でんしゃ is 電車.', undefined, 'vocab'),
      q('「便利」の meaning is what?', ['convenient', 'expensive', 'quiet', 'old'], 0, '便利 means convenient.', undefined, 'vocab'),
      q('家族は四人です。What does 四人 show?', ['Four people', 'Four tickets', 'Four days', 'Four yen'], 0, '四人 means four people.', undefined, 'vocab'),
      q('Choose the correct reading: 名前', ['なまえ', 'なんえん', 'まいにち', 'なに'], 0, '名前 is read なまえ.', undefined, 'vocab'),
      q('「昨日」の meaning is what?', ['yesterday', 'today', 'tomorrow', 'weekend'], 0, '昨日 means yesterday.', undefined, 'vocab'),
    ],
  },
  {
    title: 'Checkpoint 4: reading and listening',
    description: 'Mixed N5 practice using short passages, notices, and spoken prompts.',
    mission: 'Prove you can extract concrete information across input types.',
    canDo: 'I can answer who, where, when, what, and why questions from short N5 input.',
    items: [
      q('What should the student do?', ['Write their name', 'Buy water', 'Go to the station', 'Watch a movie'], 0, '名前を書いてください means please write your name.', 'テストの前に、名前を書いてください。', 'reading'),
      q('Where is the shop?', ['In front of the station', 'Under the desk', 'At school', 'Inside the hospital'], 0, '駅の前にあります means it is in front of the station.', '店は駅の前にあります。', 'reading'),
      q('When will they meet?', ['Tomorrow', 'Yesterday', 'Every morning', 'At nine yesterday'], 0, '明日 means tomorrow.', '明日、駅で会いましょう。', 'reading'),
      q('Listen: 「パンを二つください。」What does the speaker want?', ['Two breads', 'Two tickets', 'One tea', 'Five books'], 0, 'パンを二つ means two breads/items.', 'パンを二つください。', 'listening'),
      q('Listen: 「ここで写真を撮ってもいいですか。」What is being asked?', ['Permission to take a photo here', 'The price of a photo', 'Where the photo is', 'A rule against photos'], 0, 'てもいいですか asks permission.', 'ここで写真を撮ってもいいですか。', 'listening'),
      q('Listen: 「毎朝、七時に起きます。」What time is mentioned?', ['7:00 every morning', '9:00 tomorrow', '5:00 yesterday', '7:00 tonight'], 0, '毎朝、七時に means every morning at seven.', '毎朝、七時に起きます。', 'listening'),
    ],
  },
]

const N5_KANJI_TARGET_COMPLETE: LessonDef[] = [
  ...N5_KANJI_COMPLETE,
  {
    title: 'Directions and body basics',
    description: 'Kanji that appear in simple signs, directions, and beginner descriptions.',
    mission: 'Read basic direction and body words that often appear in N5 examples.',
    canDo: 'I can recognize direction and body kanji in short N5 phrases.',
    items: [
      k('中', 'チュウ', 'なか', 'inside / middle', 4, '中 (inside)'),
      k('外', 'ガイ / ゲ', 'そと', 'outside', 5, '外 (outside)'),
      k('右', 'ウ / ユウ', 'みぎ', 'right', 5, '右 (right)'),
      k('左', 'サ', 'ひだり', 'left', 5, '左 (left)'),
      k('東', 'トウ', 'ひがし', 'east', 8, '東京 (Tokyo)'),
      k('西', 'セイ / サイ', 'にし', 'west', 6, '西口 (west exit)'),
      k('南', 'ナン', 'みなみ', 'south', 9, '南口 (south exit)'),
      k('北', 'ホク', 'きた', 'north', 5, '北口 (north exit)'),
    ],
  },
  {
    title: 'Nature and common objects',
    description: 'High-frequency kanji that support weather, food, and simple object descriptions.',
    mission: 'Recognize simple kanji in daily-life words and short notices.',
    canDo: 'I can connect common object and nature kanji to N5 vocabulary.',
    items: [
      k('山', 'サン', 'やま', 'mountain', 3, '山 (mountain)'),
      k('川', 'セン', 'かわ', 'river', 3, '川 (river)'),
      k('田', 'デン', 'た', 'rice field', 5, '田中 (Tanaka)'),
      k('雨', 'ウ', 'あめ', 'rain', 8, '雨 (rain)'),
      k('空', 'クウ', 'そら', 'sky / empty', 8, '空 (sky)'),
      k('白', 'ハク', 'しろ.い', 'white', 5, '白い (white)'),
      k('魚', 'ギョ', 'さかな', 'fish', 11, '魚 (fish)'),
      k('犬', 'ケン', 'いぬ', 'dog', 4, '犬 (dog)'),
    ],
  },
  {
    title: 'Quantities and school life',
    description: 'Kanji for quantities, studying, rest, and everyday school contexts.',
    mission: 'Read basic quantity and school-life words before mixed practice.',
    canDo: 'I can recognize common N5 quantity and study kanji in context.',
    items: [
      k('百', 'ヒャク', '', 'hundred', 6, '百円 (100 yen)'),
      k('千', 'セン', 'ち', 'thousand', 3, '千円 (1,000 yen)'),
      k('万', 'マン / バン', '', 'ten thousand', 3, '一万円 (10,000 yen)'),
      k('半', 'ハン', 'なか.ば', 'half', 5, '三時半 (3:30)'),
      k('週', 'シュウ', '', 'week', 11, '週末 (weekend)'),
      k('間', 'カン / ケン', 'あいだ', 'interval / between', 12, '時間 (time)'),
      k('休', 'キュウ', 'やす.む', 'rest', 6, '休み (day off)'),
      k('買', 'バイ', 'か.う', 'buy', 12, '買います (buy)'),
    ],
  },
]

const N5_TESTS_MANIFESTED: LessonDef[] = [
  ...N5_TESTS_COMPLETE,
  {
    title: 'Mock section: language knowledge',
    description: 'A denser N5-style set for vocabulary, readings, particles, and verb/adjective forms.',
    mission: 'Handle a mixed language-knowledge block without relying on lesson order.',
    canDo: 'I can answer mixed vocabulary, kanji, and grammar questions in one sitting.',
    items: [
      q('Choose the correct reading: 休み', ['やすみ', 'よみ', 'のみ', 'なかみ'], 0, '休み is read やすみ.', undefined, 'vocab'),
      q('Choose the correct kanji for ひゃくえん.', ['百円', '白円', '千円', '万円'], 0, 'ひゃくえん is 百円.', undefined, 'vocab'),
      q('「北口」の meaning is what?', ['north exit', 'west exit', 'inside the shop', 'school gate'], 0, '北 means north and 口 can mean entrance/exit.', undefined, 'vocab'),
      q('学校＿＿行きます。', ['へ', 'を', 'で', 'と'], 0, 'へ marks direction with movement verbs.', undefined, 'grammar'),
      q('パン＿＿二つください。', ['を', 'に', 'の', 'から'], 0, 'を marks the thing requested/bought/eaten.', undefined, 'grammar'),
      q('この本は新し＿＿です。', ['くない', 'じゃない', 'ないく', 'では'], 0, '新しい becomes 新しくない in the negative.', undefined, 'grammar'),
      q('昨日は雨＿＿。', ['でした', 'です', 'ます', 'ません'], 0, '昨日 requires the past copula でした.', undefined, 'grammar'),
      q('三時半 means what?', ['3:30', '3:00', 'half a day', 'three weeks'], 0, '半 means half; 三時半 is half past three.', undefined, 'vocab'),
      q('あの人は先生＿＿ありません。', ['じゃ', 'を', 'に', 'と'], 0, 'じゃありません is the noun negative.', undefined, 'grammar'),
      q('Choose the correct reading: 買います', ['かいます', 'いきます', 'かえります', 'ききます'], 0, '買います is read かいます.', undefined, 'vocab'),
    ],
  },
  {
    title: 'Mock section: sentence assembly',
    description: 'Practice JLPT-style sentence order and connector logic with short N5 sentences.',
    mission: 'Build correct sentence order instead of only choosing isolated particles.',
    canDo: 'I can identify the best N5 sentence order and connector.',
    items: [
      q('Choose the best sentence.', ['私は毎日日本語を勉強します。', '私はを日本語毎日勉強します。', '毎日を私は日本語勉強します。', '日本語は毎日を勉強します。'], 0, 'A natural order is topic + time + object + verb.', undefined, 'grammar'),
      q('Choose the best sentence.', ['駅に店があります。', '駅を店があります。', '店に駅があります。', '駅で店がいます。'], 0, 'Place に thing が あります expresses existence.', undefined, 'grammar'),
      q('Choose the best sentence.', ['朝ごはんを食べてから学校へ行きます。', '朝ごはんから食べて学校へ行きます。', '学校を食べてから朝ごはんへ行きます。', '食べて学校から朝ごはんへ行きます。'], 0, 'Vてから means after doing V.', undefined, 'grammar'),
      q('Choose the best connector: 高いです＿＿、おいしいです。', ['けど', 'まで', 'より', 'を'], 0, 'けど shows contrast: expensive but delicious.', undefined, 'grammar'),
      q('Choose the best sentence.', ['バスより電車のほうが速いです。', '電車よりバスのほうが速いです。', 'バスを電車より速いです。', '電車にバスより速いです。'], 0, 'A より B のほうが marks B as more adjective.', undefined, 'grammar'),
      q('Choose the best sentence.', ['ここで写真を撮ってもいいですか。', 'ここを写真で撮ってもいいですか。', '写真にここで撮ってもいいですか。', '撮って写真をここにいいですか。'], 0, 'Place で + object を + te-form + てもいいですか is natural.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Mock section: reading',
    description: 'A longer reading block that mixes notices, schedules, invitations, and simple descriptions.',
    mission: 'Read several short N5 passages in sequence and retain key facts.',
    canDo: 'I can answer concrete information questions from multiple N5 text types.',
    items: [
      q('Why will the writer take the bus?', ['Because it is raining', 'Because the train is cheap', 'Because school is closed', 'Because the bus is new'], 0, '雨ですから gives the reason.', '今日は雨ですから、バスで学校へ行きます。七時半に家を出ます。', 'reading'),
      q('When does the writer leave home?', ['7:30', '7:00', '8:30', 'Tomorrow'], 0, '七時半に家を出ます means leave home at 7:30.', '今日は雨ですから、バスで学校へ行きます。七時半に家を出ます。', 'reading'),
      q('What is near the west exit?', ['A small shop', 'A hospital', 'A school', 'A river'], 0, '西口の近くに小さい店があります means there is a small shop near the west exit.', '駅の西口の近くに小さい店があります。パンとお茶が安いです。', 'reading'),
      q('What is cheap?', ['Bread and tea', 'Books and tickets', 'Fish and meat', 'Cars and photos'], 0, 'パンとお茶が安いです means bread and tea are cheap.', '駅の西口の近くに小さい店があります。パンとお茶が安いです。', 'reading'),
      q('What does Maria want to do tomorrow?', ['Watch a movie with a friend', 'Study at school', 'Buy a train ticket', 'Write her name'], 0, '友だちと映画を見たいです means wants to watch a movie with a friend.', 'マリアさんは明日、友だちと映画を見たいです。でも、宿題がたくさんあります。', 'reading'),
      q('What problem does Maria have?', ['She has a lot of homework', 'The station is far', 'The movie is expensive', 'She cannot read kanji'], 0, '宿題がたくさんあります means there is a lot of homework.', 'マリアさんは明日、友だちと映画を見たいです。でも、宿題がたくさんあります。', 'reading'),
    ],
  },
  {
    title: 'Mock section: listening',
    description: 'A compact listening block with task, point, and response-style N5 questions.',
    mission: 'Answer several audio-style prompts without seeing a grammar label first.',
    canDo: 'I can extract action, time, place, price, permission, and response from slow N5 prompts.',
    items: [
      q('Listen: 「電車は九時に来ます。」When does the train come?', ['At 9:00', 'At 7:00', 'At 9:30', 'Tomorrow'], 0, '九時に marks the time.', '電車は九時に来ます。', 'listening'),
      q('Listen: 「北口で待ってください。」Where should you wait?', ['At the north exit', 'At the west exit', 'In the classroom', 'Under the desk'], 0, '北口 means north exit.', '北口で待ってください。', 'listening'),
      q('Listen: 「この本は千円です。」How much is the book?', ['1,000 yen', '100 yen', '10,000 yen', '500 yen'], 0, '千円 means 1,000 yen.', 'この本は千円です。', 'listening'),
      q('Listen: 「今日は休みです。」What is today?', ['A day off', 'A test day', 'A school day', 'A shopping day'], 0, '休み means a day off.', '今日は休みです。', 'listening'),
      q('Listen: 「一緒に日本語を勉強しませんか。」Choose the best response.', ['いいですね。勉強しましょう。', '百円です。', '机の下です。', '父です。'], 0, 'ませんか invites someone to do something together.', '一緒に日本語を勉強しませんか。', 'listening'),
      q('Listen: 「ここに入ってはいけません。」What does it mean?', ['You must not enter here', 'Please enter here', 'You may take a photo here', 'Please wait here'], 0, '入ってはいけません means must not enter.', 'ここに入ってはいけません。', 'listening'),
    ],
  },
  {
    title: 'Readiness diagnosis',
    description: 'Use the final N5 checklist to decide what to review before a real mock test.',
    mission: 'Turn checkpoint results into a focused review plan.',
    canDo: 'I can identify which N5 skill to review next based on missed question types.',
    items: [
      info('How to diagnose misses', 'A wrong N5 answer usually points to a specific weak layer, not a vague lack of talent.', [
        'Missed reading/meaning questions point to vocabulary or kanji recognition.',
        'Missed blanks and sentence-order questions point to particles, endings, or sentence structure.',
        'Missed audio prompts point to listening memory, question words, or response patterns.',
      ]),
      q('If you miss many readings like 学校 and 休み, what should you review first?', ['Kanji compounds and vocabulary readings', 'Only listening speed', 'Only sentence connectors', 'Only app navigation'], 0, 'Reading misses usually mean kanji/vocab recognition needs review.', undefined, 'vocab'),
      q('If you miss questions with は, を, に, and で, what should you review first?', ['Particle roles in short sentences', 'Kanji stroke count only', 'Long essays', 'Native slang'], 0, 'Particle errors require targeted grammar review.', undefined, 'grammar'),
      q('If you understand transcripts but miss audio prompts, what should you practice?', ['Audio-first listening and immediate response drills', 'Only kanji writing', 'Only English translation', 'Skipping listening'], 0, 'Audio-first practice trains memory and recognition under listening conditions.', undefined, 'grammar'),
    ],
  },
]

export const N5_SYLLABUS_MANIFEST = {
  level: 'N5',
  goal: 'Prepare a beginner to handle JLPT N5-style language knowledge, reading, and listening through a compact but coherent route.',
  minimumLessonCounts: {
    overview: 4,
    vocab: 10,
    kanji: 13,
    grammar: 10,
    listening: 6,
    reading: 6,
    tests: 9,
  },
  vocabThemes: [
    'Start the journey',
    'Numbers on the platform',
    'Time and schedules',
    'Food car orders',
    'Places around town',
    'Family and people',
    'Daily routine verbs',
    'Adjectives for everyday choices',
    'Question words and counters',
    'Rules, invitations, and classroom actions',
  ],
  grammarPoints: [
    { id: 'topic-copula-question', tokens: ['A は B です', 'A は B じゃありません', 'A も B です', 'A は B ですか'] },
    { id: 'demonstratives-no', tokens: ['これ / それ / あれ', 'この / その / あの + N', 'A の B'] },
    { id: 'particles', tokens: ['N を Vます', 'Place で Vます', 'Time に Vます', 'A から B まで'] },
    { id: 'existence', tokens: ['Place に Thing が あります', 'Place に Person が います'] },
    { id: 'verb-tense', tokens: ['Vます', 'Vません', 'Vました', 'Vませんでした'] },
    { id: 'adjectives', tokens: ['い-adjective + N', 'い-adjective negative', 'な-adjective + N'] },
    { id: 'te-form', tokens: ['Vてください', 'Vてもいいです', 'Vてはいけません', 'Vています'] },
    { id: 'desire-invitation', tokens: ['Vたいです', 'Vませんか', 'Vましょう', 'Vましょうか'] },
    { id: 'connectors', tokens: ['Sentence から', 'そして', 'でも', 'けど / が'] },
    { id: 'comparison-preference', tokens: ['A は B より Adj です', 'N が好きです', 'N の中で A が一番 Adj です'] },
  ],
  kanji: [
    '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '円',
    '人', '日', '本', '語', '学', '生', '先', '名', '父', '母', '子', '女', '男', '友', '会',
    '時', '分', '今', '毎', '月', '火', '水', '木', '金', '土', '曜', '年', '午', '前', '半', '週', '間',
    '駅', '車', '電', '校', '店', '行', '来', '帰', '食', '飲', '見', '聞', '読', '書', '買', '休',
    '何', '大', '小', '新', '古', '高', '安', '上', '下', '中', '外', '右', '左', '東', '西', '南', '北',
    '山', '川', '田', '雨', '空', '白', '魚', '犬',
  ],
  readingTasks: ['signs', 'schedules', 'classroom note', 'store notice', 'daily schedule', 'invitation message'],
  listeningTasks: ['greetings', 'station audio', 'classroom instructions', 'daily routine audio', 'shopping and price audio', 'immediate response practice'],
  practiceSkillMinimums: {
    vocab: 12,
    grammar: 24,
    reading: 9,
    listening: 9,
  },
} as const

// ===========================================================================
// N4 - Everyday autonomy
// ===========================================================================

const N4_OVERVIEW: LessonDef[] = [
  {
    title: 'N4 handover: everyday autonomy',
    description: 'See how N4 expands N5 into routine daily-life communication.',
    mission: 'Prepare for the shift from single facts to connected daily actions.',
    canDo: 'I can describe what N4 adds and how it changes my study load.',
    items: [
      info('Scope', 'N4 makes beginner Japanese more flexible. You start handling plans, reasons, obligations, permission, and routine events.', [
        'Plain forms, te-form expansion, nai/ta/dictionary forms, comparisons, intentions, and conditionals.',
        'Short messages and slow multi-turn daily conversations.',
        'Recognition target: roughly 300 total kanji and about 1,500 total vocabulary items.',
      ]),
      info('By the end', 'You should be able to handle routine daily life with basic connected sentences.', [
        'Explain plans, reasons, and simple experiences.',
        'Read practical messages about errands, schedules, and travel.',
        'Follow slow daily conversations with more than one exchange.',
      ]),
      info('Study focus', 'N4 is where form control matters. Do not only memorize meanings; practice changing verbs accurately.', [
        'Review verb forms until they feel automatic.',
        'Pair each grammar pattern with one useful personal sentence.',
        'Use listening to reinforce common daily phrases.',
      ]),
      q('What does N4 mainly add after N5?', ['More flexible daily sentences', 'Only rare kanji', 'Literary grammar', 'Native-speed news'], 0, 'N4 expands beginner Japanese into connected everyday communication.', undefined, 'grammar'),
    ],
  },
]

const N4_VOCAB: LessonDef[] = [
  {
    title: 'Plans and errands',
    description: 'Words for daily plans, shopping, and obligations.',
    items: [
      v('予定', 'よてい', 'plan / schedule', '明日の予定を確認します。', 'I check tomorrow’s schedule.'),
      v('用事', 'ようじ', 'errand / business', '午後、用事があります。', 'I have an errand in the afternoon.'),
      v('買い物', 'かいもの', 'shopping', '駅の近くで買い物をします。', 'I shop near the station.'),
      v('必要', 'ひつよう', 'necessary', 'パスポートが必要です。', 'A passport is necessary.'),
      v('予約', 'よやく', 'reservation', 'レストランを予約しました。', 'I reserved a restaurant.'),
      v('急ぐ', 'いそぐ', 'to hurry', '電車に乗るので急ぎます。', 'I hurry because I will take the train.'),
    ],
  },
]

const N4_KANJI: LessonDef[] = [
  {
    title: 'Daily movement',
    description: 'Kanji for plans, errands, and transportation.',
    items: [
      k('予', 'ヨ', 'あらかじ.め', 'beforehand', 4, '予定 (plan)'),
      k('定', 'テイ / ジョウ', 'さだ.める', 'decide / fixed', 8, '予定 (plan)'),
      k('用', 'ヨウ', 'もち.いる', 'use / business', 5, '用事 (errand)'),
      k('事', 'ジ', 'こと', 'thing / matter', 8, '用事 (errand)'),
      k('近', 'キン', 'ちか.い', 'near', 7, '近く (nearby)'),
      k('乗', 'ジョウ', 'の.る', 'ride', 9, '電車に乗る (ride a train)'),
    ],
  },
]

const N4_GRAMMAR: LessonDef[] = [
  {
    title: 'Plans and reasons',
    description: 'Use dictionary form, つもり, and ので for everyday planning.',
    items: [
      g('Vるつもりです', 'intend to do', 'Dictionary verb + つもりです', '明日、京都へ行くつもりです。', 'I intend to go to Kyoto tomorrow.'),
      g('Vないつもりです', 'intend not to do', 'ない-form + つもりです', '今日は出かけないつもりです。', 'I do not plan to go out today.'),
      g('...ので', 'because / since', 'Clause + ので', '雨なので、タクシーで行きます。', 'Because it is raining, I will go by taxi.'),
      g('Vる前に', 'before doing', 'Dictionary verb + 前に', '寝る前に日本語を復習します。', 'Before sleeping, I review Japanese.'),
    ],
  },
]

const N4_LISTENING: LessonDef[] = [
  {
    title: 'Changing plans',
    description: 'Understand slow daily conversations about plans.',
    items: [
      q('Listen: 「雨なので、バスで行くつもりです。」Why will the speaker take the bus?', ['Because it is raining', 'Because it is cheap', 'Because the train stopped', 'Because it is nearby'], 0, '雨なので gives the reason.', '雨なので、バスで行くつもりです。', 'listening'),
      q('Listen: 「予約する前に、時間を確認してください。」What should be checked first?', ['The time', 'The price', 'The name', 'The address'], 0, '前に means before; 時間を確認してください = please check the time.', '予約する前に、時間を確認してください。', 'listening'),
    ],
  },
]

const N4_READING: LessonDef[] = [
  {
    title: 'Short messages',
    description: 'Read practical messages about errands and plans.',
    items: [
      q('Why will the writer hurry?', ['They have a reservation', 'They lost money', 'They are at school', 'They do not like trains'], 0, '予約があるので explains the reason.', '六時に予約があるので、少し急ぎます。', 'reading'),
      q('What will the writer do before shopping?', ['Go to the bank', 'Go home', 'Call a teacher', 'Study kanji'], 0, '買い物の前に銀行へ行きます means before shopping, I will go to the bank.', '買い物の前に銀行へ行きます。', 'reading'),
    ],
  },
]

const N4_TESTS: LessonDef[] = [
  {
    title: 'N4 planning drill',
    description: 'Mixed review of plans, reasons, and practical reading.',
    items: [
      q('明日、京都へ＿＿つもりです。', ['行く', '行きます', '行って', '行った'], 0, 'つもりです uses the dictionary form.', undefined, 'grammar'),
      q('雨＿＿、バスで行きます。', ['なので', 'ながら', 'だけ', 'より'], 0, 'ので gives a reason.', undefined, 'grammar'),
      q('「予約」の意味は何ですか。', ['reservation', 'station', 'homework', 'weather'], 0, '予約 means reservation.', undefined, 'vocab'),
    ],
  },
]

// ===========================================================================
// N3 - The bridge
// ===========================================================================

const N3_OVERVIEW: LessonDef[] = [
  {
    title: 'N3 handover: the bridge',
    description: 'Understand the jump from beginner control to intermediate comprehension.',
    mission: 'Prepare for nuance, longer input, and less translated thinking.',
    canDo: 'I can explain why N3 feels different from N4 and how to study it.',
    items: [
      info('Scope', 'N3 is the bridge level. You move from sentence forms into speaker intent, implication, and connected passages.', [
        'Everyday intermediate vocabulary, discourse connectors, expectations, contrast, appearance, hearsay, and reasons.',
        'Short articles, practical explanations, and near-natural familiar conversations.',
        'Recognition target: roughly 650 total kanji and about 3,700 total vocabulary items.',
      ]),
      info('By the end', 'You should understand everyday Japanese at a practical intermediate level.', [
        'Identify the main point of short articles and notices.',
        'Understand why something happened, what changed, and what the speaker expects.',
        'Handle common intermediate grammar without translating every word.',
      ]),
      info('Study focus', 'N3 needs more input volume. Single flashcards are not enough.', [
        'Read and listen to short passages repeatedly.',
        'Track nuance pairs like はず, ばかり, ように, and のに.',
        'Review weak grammar through full sentences, not isolated labels.',
      ]),
      q('Why is N3 called the bridge?', ['It connects beginner forms to intermediate comprehension', 'It is only kana practice', 'It removes reading', 'It is the final JLPT level'], 0, 'N3 bridges basic form knowledge and practical intermediate understanding.', undefined, 'grammar'),
    ],
  },
]

const N3_VOCAB: LessonDef[] = [
  {
    title: 'Work and experience',
    description: 'Intermediate words for everyday work and social topics.',
    items: [
      v('経験', 'けいけん', 'experience', 'この仕事には経験が必要です。', 'Experience is necessary for this job.'),
      v('確認', 'かくにん', 'confirmation / check', '予定を確認してください。', 'Please check the schedule.'),
      v('連絡', 'れんらく', 'contact', 'あとで連絡します。', 'I will contact you later.'),
      v('状況', 'じょうきょう', 'situation', '今の状況を説明します。', 'I will explain the current situation.'),
      v('原因', 'げんいん', 'cause', '遅れた原因を調べます。', 'I will investigate the cause of the delay.'),
      v('解決', 'かいけつ', 'solution / resolution', '問題を解決しました。', 'I solved the problem.'),
    ],
  },
]

const N3_KANJI: LessonDef[] = [
  {
    title: 'Intermediate work kanji',
    description: 'Kanji common in notices and workplace messages.',
    items: [
      k('経', 'ケイ', 'へ.る', 'pass through / manage', 11, '経験 (experience)'),
      k('験', 'ケン', 'ため.す', 'test / experience', 18, '経験 (experience)'),
      k('確', 'カク', 'たし.か', 'certain', 15, '確認 (confirmation)'),
      k('認', 'ニン', 'みと.める', 'recognize', 14, '確認 (confirmation)'),
      k('状', 'ジョウ', 'すがた', 'condition', 7, '状況 (situation)'),
      k('況', 'キョウ', 'ありさま', 'condition', 8, '状況 (situation)'),
    ],
  },
]

const N3_GRAMMAR: LessonDef[] = [
  {
    title: 'Nuance and explanation',
    description: 'Patterns that explain expectations, reasons, and contrast.',
    items: [
      g('Vたばかり', 'just did', 'た-form + ばかり', '駅に着いたばかりです。', 'I just arrived at the station.'),
      g('...はずです', 'is supposed to / expected to', 'Plain form + はずです', '電車はもう来るはずです。', 'The train should arrive soon.'),
      g('...のに', 'even though', 'Plain form + のに', '予約したのに、席がありません。', 'Even though I reserved, there are no seats.'),
      g('...ように', 'so that', 'Verb + ように', '忘れないようにメモします。', 'I write a note so I do not forget.'),
    ],
  },
]

const N3_LISTENING: LessonDef[] = [
  {
    title: 'Near-natural notices',
    description: 'Understand key points in practical announcements.',
    items: [
      q('Listen: 「事故のため、電車が十分ほど遅れています。」What happened?', ['The train is delayed about ten minutes', 'The train arrived early', 'The station is closed', 'Tickets are cheaper'], 0, '遅れています means is delayed; 十分ほど means about ten minutes.', '事故のため、電車が十分ほど遅れています。', 'listening'),
      q('Listen: 「予約したのに、名前が見つかりませんでした。」What is the problem?', ['The name was not found', 'The price changed', 'The seat is large', 'The schedule is easy'], 0, '名前が見つかりませんでした means the name was not found.', '予約したのに、名前が見つかりませんでした。', 'listening'),
    ],
  },
]

const N3_READING: LessonDef[] = [
  {
    title: 'Practical explanations',
    description: 'Read short explanations and identify the reason or main point.',
    items: [
      q('Why is the service changing?', ['To solve crowding', 'To reduce staff', 'To raise prices', 'To close the station'], 0, '混雑を解決するため means to solve crowding.', '混雑を解決するため、来月から予約方法を変更します。', 'reading'),
      q('What should customers do?', ['Check the latest information', 'Buy a new phone', 'Arrive tomorrow only', 'Call a school'], 0, '最新情報を確認してください means please check the latest information.', '天気の状況により、予定が変わる場合があります。最新情報を確認してください。', 'reading'),
    ],
  },
]

const N3_TESTS: LessonDef[] = [
  {
    title: 'N3 bridge drill',
    description: 'Mixed review of intermediate vocabulary and grammar.',
    items: [
      q('駅に着いた＿＿です。', ['ばかり', 'はず', 'ように', 'ために'], 0, 'Vたばかり means just did.', undefined, 'grammar'),
      q('予約した＿＿、席がありません。', ['のに', 'ので', 'ため', 'ながら'], 0, 'のに means even though.', undefined, 'grammar'),
      q('「確認」の意味は何ですか。', ['confirmation / check', 'experience', 'cause', 'solution'], 0, '確認 means to check or confirm.', undefined, 'vocab'),
    ],
  },
]

// ===========================================================================
// N2 - Independent fluency
// ===========================================================================

const N2_OVERVIEW: LessonDef[] = [
  {
    title: 'N2 handover: independent fluency',
    description: 'Understand the shift into broad topics, formal prose, and faster listening.',
    mission: 'Prepare for reading and listening that assumes you can follow argument structure.',
    canDo: 'I can explain the N2 scope and the study habits required for independent comprehension.',
    items: [
      info('Scope', 'N2 trains broad everyday, workplace, and social comprehension.', [
        'Formal written grammar, abstract nouns, workplace terms, reports, essays, and opinion paragraphs.',
        'Natural-speed explanations and discussions on familiar but broader topics.',
        'Recognition target: roughly 1,000 total kanji and about 6,000 total vocabulary items.',
      ]),
      info('By the end', 'You should be able to study, work, and read practical Japanese with much less scaffolding.', [
        'Follow claims, reasons, contrast, and implications in longer passages.',
        'Understand workplace announcements and formal explanations.',
        'Distinguish author stance from supporting detail.',
      ]),
      info('Study focus', 'N2 rewards consistency with authentic-style input.', [
        'Read opinion paragraphs and summarize the claim in one sentence.',
        'Track formal grammar by function: basis, contrast, condition, emphasis.',
        'Use kanji compounds as vocabulary families instead of isolated words.',
      ]),
      q('What is a core N2 reading skill?', ['Identifying claim, support, and implication', 'Only reading hiragana', 'Memorizing greetings', 'Avoiding formal text'], 0, 'N2 reading often tests argument structure and implied meaning.', undefined, 'grammar'),
    ],
  },
]

const N2_VOCAB: LessonDef[] = [
  {
    title: 'Society and work',
    description: 'Formal words common in news, reports, and workplace Japanese.',
    items: [
      v('傾向', 'けいこう', 'tendency', '利用者が増える傾向があります。', 'There is a tendency for users to increase.'),
      v('提供', 'ていきょう', 'provision / offer', '新しいサービスを提供します。', 'We provide a new service.'),
      v('効率', 'こうりつ', 'efficiency', '作業の効率を上げます。', 'We improve work efficiency.'),
      v('課題', 'かだい', 'issue / task', '大きな課題が残っています。', 'A major issue remains.'),
      v('従来', 'じゅうらい', 'conventional / until now', '従来の方法を見直します。', 'We review the conventional method.'),
      v('慎重', 'しんちょう', 'careful / cautious', '慎重に判断する必要があります。', 'It is necessary to judge carefully.'),
    ],
  },
]

const N2_KANJI: LessonDef[] = [
  {
    title: 'Formal report kanji',
    description: 'Kanji often seen in reports and news articles.',
    items: [
      k('傾', 'ケイ', 'かたむ.く', 'lean / tendency', 13, '傾向 (tendency)'),
      k('提', 'テイ', 'さ.げる', 'present / propose', 12, '提供 (provision)'),
      k('供', 'キョウ', 'そな.える', 'offer / supply', 8, '提供 (provision)'),
      k('効', 'コウ', 'き.く', 'effect', 8, '効率 (efficiency)'),
      k('率', 'リツ / ソツ', 'ひき.いる', 'rate / ratio', 11, '効率 (efficiency)'),
      k('課', 'カ', '', 'section / lesson / task', 15, '課題 (issue)'),
    ],
  },
]

const N2_GRAMMAR: LessonDef[] = [
  {
    title: 'Formal reasoning',
    description: 'Patterns for reports, essays, and workplace explanations.',
    items: [
      g('Nに基づいて', 'based on', 'Noun + に基づいて', '調査結果に基づいて判断します。', 'We decide based on the survey results.'),
      g('Nにおいて', 'in / at (formal)', 'Noun + において', '会議において方針を説明します。', 'We explain the policy at the meeting.'),
      g('...どころか', 'far from / let alone', 'Plain form + どころか', '休むどころか、夜まで働きました。', 'Far from resting, I worked until night.'),
      g('...上で', 'after / for the purpose of', 'Verb dictionary/past + 上で', '内容を確認した上で返信します。', 'I will reply after checking the contents.'),
    ],
  },
]

const N2_LISTENING: LessonDef[] = [
  {
    title: 'Workplace briefings',
    description: 'Understand the key decision in formal spoken explanations.',
    items: [
      q('Listen: 「調査結果に基づいて、従来の方法を見直します。」What will they do?', ['Review the old method based on survey results', 'Cancel the survey', 'Open a new station', 'Ignore the results'], 0, '見直します means review or reconsider.', '調査結果に基づいて、従来の方法を見直します。', 'listening'),
    ],
  },
]

const N2_READING: LessonDef[] = [
  {
    title: 'Opinion paragraphs',
    description: 'Read a short formal argument and identify the claim.',
    items: [
      q('What is the writer’s main claim?', ['Efficiency matters, but quality checks are also necessary', 'Only speed matters', 'Quality checks should stop', 'The old method is perfect'], 0, 'The paragraph contrasts efficiency with quality checks.', '作業の効率を上げることは重要だ。しかし、品質を確認する仕組みがなければ、長期的には大きな問題につながる。', 'reading'),
    ],
  },
]

const N2_TESTS: LessonDef[] = [
  {
    title: 'N2 formal drill',
    description: 'Mixed review of formal vocabulary and grammar.',
    items: [
      q('調査結果＿＿判断します。', ['に基づいて', 'に比べて', 'に対して', 'について'], 0, 'に基づいて means based on.', undefined, 'grammar'),
      q('「慎重」の意味は何ですか。', ['careful / cautious', 'fast', 'famous', 'cheap'], 0, '慎重 means careful or cautious.', undefined, 'vocab'),
    ],
  },
]

// ===========================================================================
// N1 - Advanced mastery
// ===========================================================================

const N1_OVERVIEW: LessonDef[] = [
  {
    title: 'N1 handover: advanced mastery',
    description: 'Understand the scope of dense, abstract, nuanced Japanese.',
    mission: 'Prepare for high-density input, register control, and implicit meaning.',
    canDo: 'I can explain what N1 requires beyond memorizing advanced word lists.',
    items: [
      info('Scope', 'N1 tests advanced comprehension across abstract, specialized, literary, and editorial Japanese.', [
        'Dense argument, register shifts, idioms, advanced grammar, and nuanced vocabulary.',
        'Longer texts where relationships are often implied rather than stated directly.',
        'Recognition target: 2,000+ kanji and 10,000+ vocabulary items over the long term.',
      ]),
      info('By the end', 'You should be able to handle complex Japanese with nuance and stamina.', [
        'Follow abstract arguments and identify subtle author stance.',
        'Understand formal, literary, and specialized language when context is available.',
        'Recover meaning from dense sentences without needing a translation of every part.',
      ]),
      info('Study focus', 'N1 is not solved by flashcards alone. You need sustained reading/listening plus deliberate review.', [
        'Read complex passages and mark argument structure.',
        'Study vocabulary by register, domain, and collocation.',
        'Use AI explanations for nuance, but keep curated syllabus content as the source of truth.',
      ]),
      q('What makes N1 different from lower levels?', ['Dense nuance and implicit relationships', 'Only basic greetings', 'No kanji', 'Only handwriting speed'], 0, 'N1 focuses on advanced comprehension, nuance, register, and dense language.', undefined, 'grammar'),
    ],
  },
]

const N1_VOCAB: LessonDef[] = [
  {
    title: 'Advanced abstractions',
    description: 'Nuanced words for editorials, critiques, and academic prose.',
    items: [
      v('把握', 'はあく', 'grasp / comprehension', '状況を正確に把握する必要があります。', 'It is necessary to grasp the situation accurately.'),
      v('顕著', 'けんちょ', 'remarkable / conspicuous', '顕著な変化が見られます。', 'A remarkable change can be observed.'),
      v('妥当', 'だとう', 'valid / appropriate', 'その判断は妥当だと思われます。', 'That judgment appears valid.'),
      v('緻密', 'ちみつ', 'meticulous / precise', '緻密な計画が求められます。', 'A meticulous plan is required.'),
      v('葛藤', 'かっとう', 'conflict / inner struggle', '主人公の葛藤が描かれています。', 'The protagonist’s inner conflict is depicted.'),
      v('概念', 'がいねん', 'concept', 'この概念を理解するのは難しいです。', 'It is difficult to understand this concept.'),
    ],
  },
]

const N1_KANJI: LessonDef[] = [
  {
    title: 'Advanced abstract kanji',
    description: 'Kanji found in dense written Japanese.',
    items: [
      k('把', 'ハ', '', 'grasp', 7, '把握 (grasp)'),
      k('握', 'アク', 'にぎ.る', 'grip', 12, '把握 (grasp)'),
      k('顕', 'ケン', 'あき.らか', 'clear / evident', 18, '顕著 (remarkable)'),
      k('著', 'チョ', 'あらわ.す', 'renowned / write', 11, '顕著 (remarkable)'),
      k('妥', 'ダ', '', 'gentle / valid', 7, '妥当 (validity)'),
      k('概', 'ガイ', 'おおむ.ね', 'outline / general', 14, '概念 (concept)'),
    ],
  },
]

const N1_GRAMMAR: LessonDef[] = [
  {
    title: 'Advanced written patterns',
    description: 'Emphatic and formal expressions for dense prose.',
    items: [
      g('Nをものともせず', 'in defiance of', 'Noun + をものともせず', '困難をものともせず研究を続けた。', 'They continued the research in defiance of hardship.'),
      g('NであれNであれ', 'whether...or...', 'Noun + であれ + noun + であれ', '賛成であれ反対であれ、理由を述べるべきだ。', 'Whether for or against, one should state a reason.'),
      g('Vずにはいられない', 'cannot help but do', 'ない-form stem + ずにはいられない', 'その話を聞いて笑わずにはいられなかった。', 'Hearing that story, I could not help laughing.'),
      g('Nに至るまで', 'down to / extending to', 'Noun + に至るまで', '細部に至るまで確認した。', 'I checked down to the smallest detail.'),
    ],
  },
]

const N1_LISTENING: LessonDef[] = [
  {
    title: 'Dense spoken argument',
    description: 'Track stance and implication in natural-speed explanations.',
    items: [
      q('Listen: 「表面的な数字だけでは、状況を正確に把握したとは言えません。」What is the speaker’s point?', ['Numbers alone are not enough to grasp the situation', 'Numbers are always wrong', 'The situation is simple', 'No data is needed'], 0, 'だけでは...とは言えません means cannot say only with...', '表面的な数字だけでは、状況を正確に把握したとは言えません。', 'listening'),
    ],
  },
]

const N1_READING: LessonDef[] = [
  {
    title: 'Editorial stance',
    description: 'Identify nuanced claims in abstract prose.',
    items: [
      q('What is the author’s stance?', ['The reform is valid but needs careful execution', 'The reform is meaningless', 'The reform must stop immediately', 'The reform has no risks'], 0, '妥当だが...必要がある gives a balanced stance.', 'この改革の方向性は妥当だ。しかし、現場への影響を緻密に把握した上で実行する必要がある。', 'reading'),
    ],
  },
]

const N1_TESTS: LessonDef[] = [
  {
    title: 'N1 advanced drill',
    description: 'Mixed review of nuanced vocabulary and advanced grammar.',
    items: [
      q('困難＿＿研究を続けた。', ['をものともせず', 'に基づいて', 'に比べて', 'というより'], 0, 'をものともせず means in defiance of.', undefined, 'grammar'),
      q('「把握」の意味は何ですか。', ['grasp / comprehend', 'postpone', 'decorate', 'translate'], 0, '把握 means to grasp or understand.', undefined, 'vocab'),
    ],
  },
]

export const LESSON_DEFS: Record<CourseLevelId, Partial<Record<SectionId, LessonDef[]>>> = {
  STARTER: {
    orientation: STARTER_ORIENTATION,
    kana: STARTER_KANA,
    phrases: STARTER_PHRASES,
    sentences: STARTER_SENTENCES,
    study: STARTER_STUDY,
  },
  N5: { overview: N5_OVERVIEW_COMPLETE, vocab: N5_VOCAB_COMPLETE, kanji: N5_KANJI_TARGET_COMPLETE, grammar: N5_GRAMMAR_EXPANDED, listening: N5_LISTENING_COMPLETE, reading: N5_READING_COMPLETE, tests: N5_TESTS_MANIFESTED },
  N4: { overview: N4_OVERVIEW, vocab: N4_VOCAB, kanji: N4_KANJI, grammar: N4_GRAMMAR, listening: N4_LISTENING, reading: N4_READING, tests: N4_TESTS },
  N3: { overview: N3_OVERVIEW, vocab: N3_VOCAB, kanji: N3_KANJI, grammar: N3_GRAMMAR, listening: N3_LISTENING, reading: N3_READING, tests: N3_TESTS },
  N2: { overview: N2_OVERVIEW, vocab: N2_VOCAB, kanji: N2_KANJI, grammar: N2_GRAMMAR, listening: N2_LISTENING, reading: N2_READING, tests: N2_TESTS },
  N1: { overview: N1_OVERVIEW, vocab: N1_VOCAB, kanji: N1_KANJI, grammar: N1_GRAMMAR, listening: N1_LISTENING, reading: N1_READING, tests: N1_TESTS },
}

export interface KanjiEntry {
  char: string
  on: string
  kun: string
  meaning: string
  strokes: number
  example: string
  level: CourseLevelId
}

export function allKanji(): KanjiEntry[] {
  const seen = new Set<string>()
  const out: KanjiEntry[] = []
  for (const level of ['N5', 'N4', 'N3', 'N2', 'N1'] as CourseLevelId[]) {
    for (const def of LESSON_DEFS[level].kanji ?? []) {
      for (const it of def.items) {
        if (it.kind !== 'kanji' || seen.has(it.char)) continue
        seen.add(it.char)
        out.push({ char: it.char, on: it.on, kun: it.kun, meaning: it.meaning, strokes: it.strokes, example: it.example, level })
      }
    }
  }
  return out
}

export function lessonCount(level: CourseLevelId, section: SectionId): number {
  return LESSON_DEFS[level][section]?.length ?? 0
}

export function lessonMeta(level: CourseLevelId, section: SectionId, index: number): { title: string; description: string } | undefined {
  const def = LESSON_DEFS[level][section]?.[index]
  return def ? { title: def.title, description: def.description } : undefined
}

export function getLessonDef(level: CourseLevelId, section: SectionId, index: number): LessonDef | undefined {
  return LESSON_DEFS[level][section]?.[index]
}

type RawQuizItem = Omit<Extract<StudyItem, { kind: 'quiz' }>, 'id'>

function stableHash(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function rotateQuizChoices(item: RawQuizItem, seed: string): RawQuizItem {
  const choiceCount = item.choices.length
  if (choiceCount < 2) return item

  const shift = (stableHash(seed) % (choiceCount - 1)) + 1
  return {
    ...item,
    choices: item.choices.map((_, choiceIndex) => item.choices[(choiceIndex + shift) % choiceCount]),
    answer: (item.answer - shift + choiceCount) % choiceCount,
  }
}

export function getLessonItems(level: CourseLevelId, section: SectionId, index: number): StudyItem[] {
  const def = LESSON_DEFS[level][section]?.[index]
  if (!def) return []
  const tag = `${level}-${section}-${index}`
  return def.items.map((raw, i) => {
    const item = raw.kind === 'quiz' ? rotateQuizChoices(raw, `${tag}-${i}`) : raw
    return { ...item, id: `${tag}-${i}` } as StudyItem
  })
}
