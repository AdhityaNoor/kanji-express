const READING_SPLIT_RE = /\s*(?:\/|、|,|;|；|・|\bor\b)\s*/i

/** Pick a speakable kana reading from display strings like "よん / し" or "かたむ.く". */
export function primaryJapaneseReading(reading?: string | null): string {
  if (!reading) return ''
  const first = reading
    .split(READING_SPLIT_RE)
    .map((part) => part.trim())
    .find(Boolean)

  return (first ?? '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[.\-~〜]/g, '')
    .trim()
}

export function firstJapaneseReading(readings: readonly string[] | undefined): string {
  if (!readings) return ''
  for (const reading of readings) {
    const normalized = primaryJapaneseReading(reading)
    if (normalized) return normalized
  }
  return ''
}
