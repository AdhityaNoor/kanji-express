import {
  LayoutDashboard,
  GraduationCap,
  PenLine,
  Layers,
  BookOpen,
  Brain,
  Trophy,
  User,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  /** Show in the compact mobile bottom bar. */
  primary?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, primary: true },
  { label: 'Courses', to: '/courses', icon: GraduationCap, primary: true },
  { label: 'Write', to: '/write', icon: PenLine, primary: true },
  { label: 'Flashcards', to: '/flashcards', icon: Layers, primary: true },
  { label: 'Vocabulary', to: '/vocabulary', icon: BookOpen },
  { label: 'AI Teacher', to: '/ai', icon: Brain },
  { label: 'Achievements', to: '/achievements', icon: Trophy },
  { label: 'Profile', to: '/profile', icon: User, primary: true },
]
