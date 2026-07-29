import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/lib/nav'
import { cn } from '@/lib/cn'

/** Desktop / tablet persistent sidebar. Hidden on mobile (< lg). */
export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-line lg:bg-bg-soft">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-sakura font-jp text-lg font-bold text-accent-on">
          字
        </div>
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-fg-strong">Kanji Express</p>
          <p className="text-[11px] text-fg-muted">JLPT Study</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent-fg ring-1 ring-inset ring-accent/25'
                  : 'text-fg-muted hover:bg-bg-hover hover:text-fg',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-2xl border border-line bg-bg-card p-4">
        <p className="text-xs font-semibold text-fg">N3 Sprint</p>
        <p className="mt-1 text-[11px] text-fg-faint">You&apos;re 62% to your July goal.</p>
      </div>
    </aside>
  )
}
