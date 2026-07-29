import { useEffect, useMemo, useState } from 'react'
import { CircleNotch as Loader2, Info } from '@phosphor-icons/react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { KanjiCanvas } from '@/components/write/KanjiCanvas'
import { SpeakButton } from '@/components/ui/SpeakButton'
import { allKanji } from '@/data/content'
import type { KanjiEntry } from '@/data/content'
import { fetchJlptKanji, fetchKanjiInfo, fetchKanjiWords, type KanjiInfo, type KanjiJlptLevel, type KanjiWord } from '@/lib/kanjiApi'
import { useAuth } from '@/lib/auth'
import { isLevelUnlocked, type Completed } from '@/lib/progress'
import { cn } from '@/lib/cn'
import { firstJapaneseReading, primaryJapaneseReading } from '@/lib/japaneseSpeech'

const LEVELS: KanjiJlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']

export default function StrokeLab() {
  const { user } = useAuth()
  const completed: Completed = user?.progress.completedLessons ?? {}

  const [builtin, setBuiltin] = useState<KanjiEntry[]>([])

  useEffect(() => {
    let active = true
    allKanji().then((kanji) => {
      if (active) setBuiltin(kanji)
    })
    return () => {
      active = false
    }
  }, [])

  const builtinByChar = useMemo(() => new Map(builtin.map((k) => [k.char, k])), [builtin])
  const builtinByLevel = useMemo(() => {
    const m = new Map<KanjiJlptLevel, string[]>()
    for (const k of builtin) {
      if (k.level === 'STARTER') continue
      m.set(k.level, [...(m.get(k.level) ?? []), k.char])
    }
    return m
  }, [builtin])

  const [level, setLevel] = useState<KanjiJlptLevel>('N5')
  const [chars, setChars] = useState<string[]>(() => builtinByLevel.get('N5') ?? [])
  const [listLoading, setListLoading] = useState(false)
  const [selected, setSelected] = useState<string>(() => (builtinByLevel.get('N5') ?? ['日'])[0])

  const [info, setInfo] = useState<KanjiInfo | null>(null)
  const [words, setWords] = useState<KanjiWord[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    let active = true
    setListLoading(true)
    setChars(builtinByLevel.get(level) ?? [])
    fetchJlptKanji(level)
      .then((list) => {
        if (!active) return
        if (list.length) {
          setChars(list)
          setSelected((cur) => (list.includes(cur) ? cur : list[0]))
        }
      })
      .finally(() => active && setListLoading(false))
    return () => {
      active = false
    }
  }, [level, builtinByLevel])

  useEffect(() => {
    let active = true
    setDetailLoading(true)
    const fb = builtinByChar.get(selected)
    setInfo(
      fb ? { char: fb.char, meanings: [fb.meaning], on: [fb.on], kun: [fb.kun], strokes: fb.strokes, jlpt: null } : null,
    )
    setWords([])
    Promise.all([fetchKanjiInfo(selected), fetchKanjiWords(selected)])
      .then(([i, w]) => {
        if (!active) return
        if (i) setInfo(i)
        setWords(w)
      })
      .finally(() => active && setDetailLoading(false))
    return () => {
      active = false
    }
  }, [selected, builtinByChar])

  const expectedStrokes = info?.strokes || builtinByChar.get(selected)?.strokes || 1
  const selectedReading = firstJapaneseReading(info?.kun) || firstJapaneseReading(info?.on)

  return (
    <div className="animate-fade-up space-y-6">
      <div className="ke-panel p-5 sm:p-6">
        <div className="ke-watermark -right-4 -top-8 text-[8rem]">書</div>
        <p className="ke-section-label">Stroke lab</p>
        <h1 className="relative mt-2 text-2xl font-extrabold text-fg-strong sm:text-3xl">Handwriting practice</h1>
        <p className="relative mt-2 max-w-2xl text-sm leading-6 text-fg-muted">
          Every JLPT kanji - trace, grade, and study readings. Draw with a mouse, finger, or stylus.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardBody className="p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-accent font-jp text-3xl font-bold text-accent-on shadow-glow">
                  {selected}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="line-clamp-1 text-lg font-bold text-fg-strong">
                      {info?.meanings.slice(0, 3).join(', ') || '...'}
                    </p>
                    <SpeakButton text={selected} pronunciation={selectedReading} icon />
                  </div>
                  <p className="text-xs text-fg-muted">{expectedStrokes} strokes</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge tone="brand">{level}</Badge>
                <Badge tone="matcha">stroke order</Badge>
              </div>
            </div>

            <KanjiCanvas key={selected} char={selected} expectedStrokes={expectedStrokes} />

            <div className="mt-5 space-y-3 border-t border-line pt-4">
              <div className="grid grid-cols-2 gap-3">
                <ReadingBlock label="On'yomi" readings={info?.on ?? []} />
                <ReadingBlock label="Kun'yomi" readings={info?.kun ?? []} />
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-fg-faint">
                  Example words
                  {detailLoading && <Loader2 className="ml-2 inline h-3 w-3 animate-spin" />}
                </p>
                {words.length > 0 ? (
                  <ul className="space-y-1.5">
                    {words.map((w, i) => (
                      <li key={i} className="flex items-center gap-2 rounded-lg bg-bg-soft px-3 py-1.5">
                        <span className="font-jp text-sm font-semibold text-fg-strong">{w.written}</span>
                        <span className="font-jp text-xs text-fg-muted">{w.pronounced}</span>
                        <span className="ml-auto truncate text-xs text-fg-faint">{w.glosses.slice(0, 2).join(', ')}</span>
                        <SpeakButton text={w.written} pronunciation={primaryJapaneseReading(w.pronounced)} icon />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-fg-faint">{detailLoading ? 'Loading...' : 'No example words available.'}</p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((l) => {
              const locked = !isLevelUnlocked(l, completed) && l !== 'N5'
              return (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-semibold transition-all',
                    level === l ? 'bg-accent text-accent-on' : 'bg-bg-soft text-fg-muted hover:text-fg',
                    locked && 'opacity-60',
                  )}
                >
                  {l}
                </button>
              )
            })}
          </div>

          <Card>
            <CardBody className="p-3">
              <div className="mb-2 flex items-center justify-between px-1 text-[11px] text-fg-faint">
                <span>{chars.length} kanji</span>
                {listLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              </div>
              <div className="grid max-h-[460px] grid-cols-6 gap-1.5 overflow-y-auto sm:grid-cols-7 lg:grid-cols-6">
                {chars.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelected(c)}
                    className={cn(
                      'grid aspect-square place-items-center rounded-lg font-jp text-lg font-bold transition-all',
                      selected === c ? 'bg-accent text-accent-on' : 'bg-bg-soft text-fg hover:bg-bg-hover',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          <p className="flex items-start gap-1.5 text-[11px] text-fg-faint">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Kanji, readings & example words from{' '}
            <a href="https://kanjiapi.dev" target="_blank" rel="noreferrer" className="underline hover:text-accent-fg">
              kanjiapi.dev
            </a>{' '}
            (KANJIDIC2, CC BY-SA). Loads live; a built-in set is used offline.
          </p>
        </div>
      </div>
    </div>
  )
}

function ReadingBlock({ label, readings }: { label: string; readings: string[] }) {
  return (
    <div className="rounded-xl bg-bg-soft p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-fg-faint">{label}</p>
      {readings.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {readings.map((r, i) => (
            <span key={i} className="inline-flex items-center gap-1 font-jp text-sm text-fg-strong">
              {r}
              <SpeakButton text={r} pronunciation={primaryJapaneseReading(r)} icon />
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 font-jp text-sm text-fg-faint">-</p>
      )}
    </div>
  )
}
