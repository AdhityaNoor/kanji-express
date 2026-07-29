// ---------------------------------------------------------------------------
// Runtime kanji reference loader.
//
// Loads JLPT kanji lists and per-kanji reference data from kanjiapi.dev
// (KANJIDIC2 / EDRDG, CC BY-SA) and caches responses in memory.
// ---------------------------------------------------------------------------

import type { JlptLevel } from '@/data/courses'

const BASE = 'https://kanjiapi.dev/v1'
export type KanjiJlptLevel = Exclude<JlptLevel, 'STARTER'>

const JLPT_NUM: Record<KanjiJlptLevel, number> = { N5: 5, N4: 4, N3: 3, N2: 2, N1: 1 }

export interface KanjiInfo {
  char: string
  meanings: string[]
  on: string[]
  kun: string[]
  strokes: number
  jlpt: number | null
}

export interface KanjiWord {
  written: string
  pronounced: string
  glosses: string[]
}

const listCache = new Map<KanjiJlptLevel, string[]>()
const infoCache = new Map<string, KanjiInfo | null>()
const wordsCache = new Map<string, KanjiWord[]>()

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function fetchJlptKanji(level: KanjiJlptLevel): Promise<string[]> {
  if (listCache.has(level)) return listCache.get(level)!
  const data = await getJson<string[]>(`/kanji/jlpt-${JLPT_NUM[level]}`)
  const list = Array.isArray(data) ? data : []
  if (list.length) listCache.set(level, list)
  return list
}

interface RawKanji {
  kanji: string
  meanings: string[]
  kun_readings: string[]
  on_readings: string[]
  stroke_count: number
  jlpt: number | null
}

export async function fetchKanjiInfo(char: string): Promise<KanjiInfo | null> {
  if (infoCache.has(char)) return infoCache.get(char)!
  const raw = await getJson<RawKanji>(`/kanji/${encodeURIComponent(char)}`)
  const info: KanjiInfo | null = raw
    ? {
        char: raw.kanji,
        meanings: raw.meanings ?? [],
        on: raw.on_readings ?? [],
        kun: raw.kun_readings ?? [],
        strokes: raw.stroke_count ?? 0,
        jlpt: raw.jlpt ?? null,
      }
    : null
  infoCache.set(char, info)
  return info
}

interface RawWordEntry {
  variants: { written: string; pronounced: string }[]
  meanings: { glosses: string[] }[]
}

export async function fetchKanjiWords(char: string, limit = 6): Promise<KanjiWord[]> {
  if (wordsCache.has(char)) return wordsCache.get(char)!.slice(0, limit)
  const data = await getJson<RawWordEntry[]>(`/words/${encodeURIComponent(char)}`)
  const words: KanjiWord[] = Array.isArray(data)
    ? data
        .map((entry) => {
          const variant = entry.variants?.[0]
          const glosses = entry.meanings?.flatMap((m) => m.glosses ?? []) ?? []
          return variant ? { written: variant.written, pronounced: variant.pronounced, glosses } : null
        })
        .filter((w): w is KanjiWord => !!w)
    : []
  if (words.length) wordsCache.set(char, words)
  return words.slice(0, limit)
}
