import { BookOpen, PenLine, FileText, Headphones, ScrollText, ClipboardCheck, type LucideIcon } from 'lucide-react'
import type { SectionId } from '@/data/courses'

export const SECTION_ICON: Record<SectionId, LucideIcon> = {
  vocab: BookOpen,
  kanji: PenLine,
  grammar: FileText,
  listening: Headphones,
  reading: ScrollText,
  tests: ClipboardCheck,
}
