import {
  BookOpen,
  PencilLine,
  FileText,
  Headphones,
  Scroll,
  ListChecks,
  Compass,
  Translate,
  ChatCircleText,
  TreeStructure,
  Repeat,
  MapTrifold,
  type Icon,
} from '@phosphor-icons/react'
import type { SectionId } from '@/data/courses'

export const SECTION_ICON: Record<SectionId, Icon> = {
  orientation: Compass,
  kana: Translate,
  phrases: ChatCircleText,
  sentences: TreeStructure,
  study: Repeat,
  overview: MapTrifold,
  vocab: BookOpen,
  kanji: PencilLine,
  grammar: FileText,
  listening: Headphones,
  reading: Scroll,
  tests: ListChecks,
}
