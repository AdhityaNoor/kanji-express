import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={cn(
        'grid h-10 w-10 place-items-center rounded-xl text-fg-muted transition-colors',
        'hover:bg-bg-hover hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
    >
      <Sun className={cn('h-5 w-5 transition-all', isDark ? 'hidden' : 'block')} />
      <Moon className={cn('h-5 w-5 transition-all', isDark ? 'block' : 'hidden')} />
    </button>
  )
}
