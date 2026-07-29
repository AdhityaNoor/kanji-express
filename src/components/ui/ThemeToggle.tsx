import { Button } from '@heroui/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      type="button"
      onPress={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      isIconOnly
      variant="ghost"
      className={cn(
        'h-10 min-w-10 text-fg-muted transition-colors',
        'hover:bg-bg-hover hover:text-fg data-[hover=true]:bg-bg-hover data-[hover=true]:text-fg',
        className,
      )}
    >
      <Sun className={cn('h-5 w-5 transition-all', isDark ? 'hidden' : 'block')} />
      <Moon className={cn('h-5 w-5 transition-all', isDark ? 'block' : 'hidden')} />
    </Button>
  )
}
