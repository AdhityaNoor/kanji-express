import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/lib/nav'
import { cn } from '@/lib/cn'

/** Desktop / tablet persistent sidebar. Hidden on mobile (< lg). */
export function Sidebar() {
  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:max-h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-line lg:bg-bg-soft/92 lg:backdrop-blur">
      <div className="flex h-16 shrink-0 items-center gap-2 px-6">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-display text-lg font-bold text-accent-on shadow-glow">
          字
        </div>
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-fg-strong">Kanji Express</p>
          <p className="text-[11px] text-fg-muted">JLPT Study</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                isActive
                  ? 'bg-accent text-accent-on shadow-glow'
                  : 'text-fg-muted hover:bg-bg-hover hover:text-fg',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 shrink-0 rounded-2xl border border-line bg-bg-card/80 p-4 shadow-card">
        <p className="font-display text-lg font-bold leading-none text-fg-strong">毎日</p>
        <p className="mt-2 text-xs font-semibold text-fg">N3 Sprint</p>
        <p className="mt-1 text-[11px] text-fg-faint">62% to the July goal.</p>
      </div>
    </aside>
  )
}
