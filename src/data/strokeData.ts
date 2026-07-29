// ---------------------------------------------------------------------------
// Stroke-order paths for animated guidance, in a 0 0 100 100 viewBox. These
// are original, approximate paths for a starter set of simple kanji — enough to
// demonstrate stroke-order playback and per-stroke guidance.
//
// For the full, precise dataset, drop in KanjiVG (https://kanjivg.tagaini.net/,
// CC BY-SA 3.0 — attribution required) and map its per-stroke <path d="…"> into
// this same shape, keyed by character.
// ---------------------------------------------------------------------------

export const STROKE_PATHS: Record<string, string[]> = {
  一: ['M12,50 L88,50'],
  二: ['M22,36 L72,36', 'M12,64 L88,64'],
  三: ['M25,28 L68,28', 'M28,50 L74,50', 'M12,72 L88,72'],
  十: ['M12,44 L88,44', 'M50,14 L50,86'],
  人: ['M52,18 L24,84', 'M50,42 L82,84'],
  大: ['M16,40 L84,40', 'M50,18 L26,86', 'M52,44 L82,86'],
  口: ['M28,24 L28,80', 'M28,24 L74,24 L74,80', 'M28,80 L74,80'],
  日: ['M28,18 L28,84', 'M28,18 L72,18 L72,84', 'M28,50 L72,50', 'M28,84 L72,84'],
  木: ['M16,40 L84,40', 'M50,16 L50,86', 'M50,48 L22,84', 'M50,48 L80,84'],
  水: ['M50,16 L50,80', 'M50,40 L28,70', 'M42,52 L24,84', 'M50,44 L74,72', 'M58,52 L78,84'],
}

export function strokePathsFor(char: string): string[] | undefined {
  return STROKE_PATHS[char]
}
