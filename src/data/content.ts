import type { CourseLevelId, SectionId } from './courses'
import { LESSON_INDEX } from './contentIndex'

export type {
  KanjiEntry,
  LessonDef,
  StudyItem,
} from './contentStore'

type ContentStore = typeof import('./contentStore')

let storePromise: Promise<ContentStore> | undefined

export const N5_SYLLABUS_MANIFEST = () => loadContentStore().then((store) => store.N5_SYLLABUS_MANIFEST)

export function loadContentStore(): Promise<ContentStore> {
  storePromise ??= import('./contentStore')
  return storePromise
}

export function lessonCount(level: CourseLevelId, section: SectionId): number {
  return LESSON_INDEX[level][section]?.length ?? 0
}

export function lessonMeta(level: CourseLevelId, section: SectionId, index: number) {
  return LESSON_INDEX[level][section]?.[index]
}

export async function getLessonDef(level: CourseLevelId, section: SectionId, index: number) {
  const store = await loadContentStore()
  return store.getLessonDef(level, section, index)
}

export async function getLessonItems(level: CourseLevelId, section: SectionId, index: number) {
  const store = await loadContentStore()
  return store.getLessonItems(level, section, index)
}

export async function allKanji() {
  const store = await loadContentStore()
  return store.allKanji()
}
