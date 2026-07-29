import { Input } from '@heroui/react'
import { Search, Bell, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function TopBar() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/78 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        {/* Mobile brand */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-display text-base font-bold text-accent-on shadow-glow">
            字
          </div>
          <span className="text-sm font-extrabold text-fg-strong">Kanji Express</span>
        </div>

        {/* Search grows on desktop */}
        <div className="ml-auto hidden max-w-md flex-1 lg:block">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-fg-faint" />
            <Input
              type="search"
              placeholder="Search kanji, vocab, grammar..."
              variant="secondary"
              className="h-10 w-full rounded-xl border border-line bg-bg-card/80 pl-9 pr-3 text-sm text-fg shadow-none placeholder:text-fg-faint hover:bg-bg-card focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <div className="flex items-center gap-1.5 rounded-xl bg-bg-card/80 px-3 py-1.5 ring-1 ring-inset ring-line">
            <Flame className="h-4 w-4 text-amber" />
            <span className="text-sm font-bold text-fg-strong">{user?.progress.streak ?? 0}</span>
          </div>
          <ThemeToggle />
          <button
            aria-label="Notifications"
            className="grid h-10 w-10 place-items-center rounded-xl text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link to="/profile" aria-label="Your profile" className="shrink-0">
            <img
              src={user?.avatar}
              alt={user?.name ?? 'Profile'}
              className="h-10 w-10 rounded-xl ring-2 ring-line transition-transform hover:scale-105"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
