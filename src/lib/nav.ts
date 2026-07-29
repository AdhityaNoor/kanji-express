import {
  SquaresFour,
  GraduationCap,
  PencilLine,
  CardsThree,
  BookOpen,
  Brain,
  Trophy,
  User,
  type Icon,
} from '@phosphor-icons/react'

export interface NavItem {
  label: string
  to: string
  icon: Icon
  /** Show in the compact mobile bottom bar. */
  primary?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: SquaresFour, primary: true },
  { label: 'Courses', to: '/courses', icon: GraduationCap, primary: true },
  { label: 'Write', to: '/write', icon: PencilLine, primary: true },
  { label: 'Flashcards', to: '/flashcards', icon: CardsThree, primary: true },
  { label: 'Vocabulary', to: '/vocabulary', icon: BookOpen },
  { label: 'AI Teacher', to: '/ai', icon: Brain },
  { label: 'Achievements', to: '/achievements', icon: Trophy },
  { label: 'Profile', to: '/profile', icon: User, primary: true },
]
