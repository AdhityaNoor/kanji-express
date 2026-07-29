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

const N5_GRAMMAR: LessonDef[] = [
  {
    title: 'X は Y です',
    description: 'Make your first complete Japanese sentences.',
    mission: 'Introduce yourself to another passenger.',
    canDo: 'I can say what something or someone is.',
    items: [
      g('X は Y です', 'X is Y', 'Topic + は + noun + です', '私は学生です。', 'I am a student.', 'は is pronounced わ when it marks the topic.'),
      g('X は Y じゃありません', 'X is not Y', 'Topic + は + noun + じゃありません', '私は先生じゃありません。', 'I am not a teacher.'),
      g('X も Y です', 'X is also Y', 'Noun + も + noun + です', 'マリアさんも学生です。', 'Maria is also a student.'),
      g('お名前は何ですか', 'What is your name?', 'お + 名前 + は + 何 + ですか', 'お名前は何ですか。', 'What is your name?'),
      q('Choose the best translation: 私は学生です。', ['I am a student.', 'I am a teacher.', 'This is Japan.', 'What is your name?'], 0, '私は = I; 学生です = am a student.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Asking simple questions',
    description: 'Use か, 何, and どこ to get essential information.',
    mission: 'Ask for a name, place, and price.',
    canDo: 'I can ask basic yes/no and information questions.',
    items: [
      g('...ですか', 'question marker', 'Statement + か', '田中さんは先生ですか。', 'Is Tanaka a teacher?'),
      g('何ですか', 'what is it?', 'Noun + は + 何 + ですか', 'これは何ですか。', 'What is this?'),
      g('どこですか', 'where is it?', 'Place/person + は + どこ + ですか', '駅はどこですか。', 'Where is the station?'),
      g('いくらですか', 'how much is it?', 'Item + は + いくら + ですか', 'この切符はいくらですか。', 'How much is this ticket?'),
      q('駅はどこですか。What is being asked?', ['Where is the station?', 'How much is the ticket?', 'Who is the teacher?', 'What time is it?'], 0, '駅 = station; どこ = where.', undefined, 'grammar'),
    ],
  },
  {
    title: 'Going places',
    description: 'Say where you go and how you get there.',
    mission: 'Tell a friend how you will reach the station.',
    canDo: 'I can say where I go and by what transport.',
    items: [
      g('場所へ行きます', 'go to a place', 'Place + へ + 行きます', '学校へ行きます。', 'I go to school.', 'へ is pronounced え when it marks direction.'),
      g('乗り物で行きます', 'go by means of transport', 'Vehicle + で + 行きます', '電車で行きます。', 'I go by train.'),
      g('場所にいます', 'be at a place', 'Place + に + います', '先生は学校にいます。', 'The teacher is at school.'),
      g('場所にあります', 'there is a thing', 'Place + に + thing + が + あります', '駅に店があります。', 'There is a shop at the station.'),
      q('電車で行きます。What does で show here?', ['means / method', 'topic', 'possession', 'question'], 0, 'で marks the transport or method: by train.', undefined, 'grammar'),
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

const N5_TESTS: LessonDef[] = [
  {
    title: 'Checkpoint 1: first ride',
    description: 'Mixed review of introductions, numbers, questions, and signs.',
    mission: 'Pass the first Kanji Express checkpoint.',
    canDo: 'I can answer simple JLPT-style questions using the first units.',
    items: [
      q('私は＿＿です。', ['学生', '駅', '水', '三時'], 0, '学生 is a person role and fits 私は...です.', undefined, 'grammar'),
      q('「二番線」の意味は何ですか。', ['platform two', 'two tickets', 'two teachers', 'two days'], 0, '番線 is used for train platforms.', undefined, 'vocab'),
      q('Choose the correct reading for 日本語.', ['にほんご', 'にちほんご', 'ひもとご', 'にほんがく'], 0, '日本語 is read にほんご.', undefined, 'vocab'),
      q('What does the notice mean?', ['The train is on platform two.', 'The ticket is 200 yen.', 'The shop is closed.', 'Meet at two o’clock.'], 0, '電車 = train; 二番線 = platform two.', '電車は二番線です。', 'reading'),
      q('Listen: 「お名前は何ですか。」What is being asked?', ['Your name', 'Your ticket', 'Your school', 'Your country'], 0, 'お名前 means name.', 'お名前は何ですか。', 'listening'),
    ],
  },
]

// ===========================================================================
// N4 - Everyday autonomy
// ===========================================================================

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
  N5: { vocab: N5_VOCAB, kanji: N5_KANJI, grammar: N5_GRAMMAR, listening: N5_LISTENING, reading: N5_READING, tests: N5_TESTS },
  N4: { vocab: N4_VOCAB, kanji: N4_KANJI, grammar: N4_GRAMMAR, listening: N4_LISTENING, reading: N4_READING, tests: N4_TESTS },
  N3: { vocab: N3_VOCAB, kanji: N3_KANJI, grammar: N3_GRAMMAR, listening: N3_LISTENING, reading: N3_READING, tests: N3_TESTS },
  N2: { vocab: N2_VOCAB, kanji: N2_KANJI, grammar: N2_GRAMMAR, listening: N2_LISTENING, reading: N2_READING, tests: N2_TESTS },
  N1: { vocab: N1_VOCAB, kanji: N1_KANJI, grammar: N1_GRAMMAR, listening: N1_LISTENING, reading: N1_READING, tests: N1_TESTS },
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

export function getLessonItems(level: CourseLevelId, section: SectionId, index: number): StudyItem[] {
  const def = LESSON_DEFS[level][section]?.[index]
  if (!def) return []
  const tag = `${level}-${section}-${index}`
  return def.items.map((raw, i) => ({ ...raw, id: `${tag}-${i}` }) as StudyItem)
}
