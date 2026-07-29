// ---------------------------------------------------------------------------
// Loads per-stroke kanji path data from KanjiVG at runtime.
//
// KanjiVG (https://kanjivg.tagaini.net/) is © Ulrich Apel and contributors,
// released under CC BY-SA 3.0. We fetch the per-character SVG on demand from
// the jsDelivr CDN (which serves the KanjiVG GitHub repo with permissive CORS
// headers), extract each stroke's <path d="…"> in stroke order, and cache it.
// If the fetch fails, callers fall back to the built-in starter set.
// ---------------------------------------------------------------------------

export const KANJIVG_VIEWBOX = 109

const CDN = 'https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji'

const cache = new Map<string, string[] | null>()
const inflight = new Map<string, Promise<string[] | null>>()

function fileFor(char: string): string {
  const cp = char.codePointAt(0)
  if (cp === undefined) return ''
  return `${cp.toString(16).padStart(5, '0')}.svg`
}

/** Returns each stroke's SVG path `d` in stroke order, or null if unavailable. */
export async function loadKanjiVgPaths(char: string): Promise<string[] | null> {
  if (cache.has(char)) return cache.get(char)!
  const existing = inflight.get(char)
  if (existing) return existing

  const promise = (async () => {
    try {
      const res = await fetch(`${CDN}/${fileFor(char)}`)
      if (!res.ok) {
        cache.set(char, null)
        return null
      }
      const text = await res.text()
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
      if (doc.querySelector('parsererror')) {
        cache.set(char, null)
        return null
      }
      // Stroke <path> elements are in document order = stroke order.
      const paths = Array.from(doc.querySelectorAll('path'))
        .map((p) => p.getAttribute('d'))
        .filter((d): d is string => !!d)
      const result = paths.length ? paths : null
      cache.set(char, result)
      return result
    } catch {
      cache.set(char, null)
      return null
    } finally {
      inflight.delete(char)
    }
  })()

  inflight.set(char, promise)
  return promise
}
