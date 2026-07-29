import {
  BookOpen,
  PenLine,
  FileText,
  Headphones,
  ScrollText,
  ClipboardCheck,
  Compass,
  Languages,
  MessageCircle,
  ListTree,
  Repeat,
  Map,
  type LucideIcon,
} from 'lucide-react'
import type { SectionId } from '@/data/courses'

export const SECTION_ICON: Record<SectionId, LucideIcon> = {
  orientation: Compass,
  kana: Languages,
  phrases: MessageCircle,
  sentences: ListTree,
  study: Repeat,
  overview: Map,
  vocab: BookOpen,
  kanji: PenLine,
  grammar: FileText,
  listening: Headphones,
  reading: ScrollText,
  tests: ClipboardCheck,
}
