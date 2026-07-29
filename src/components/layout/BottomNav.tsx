import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/lib/nav'
import { cn } from '@/lib/cn'

/** Mobile bottom navigation. Hidden on desktop (>= lg). */
export function BottomNav() {
  const items = NAV_ITEMS.filter((i) => i.primary)
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg-soft/92 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {items.map(({ label, to, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-colors',
                  isActive ? 'text-accent-fg' : 'text-fg-faint hover:text-fg',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'grid h-7 w-9 place-items-center rounded-full transition-all',
                      isActive && 'bg-accent/12 ring-1 ring-inset ring-accent/20',
                    )}
                  >
                    <Icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
