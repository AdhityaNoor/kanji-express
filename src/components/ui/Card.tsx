import { Card as HCard } from '@heroui/react'
import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

// Surface container built on HeroUI's Card, restyled with our theme tokens.
// Header / Title / Body keep our exact layout so pages are unchanged.
export function Card({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <HCard
      className={cn(
        'relative overflow-hidden rounded-2xl border border-line bg-bg-card/92 text-fg shadow-card backdrop-blur-sm transition-colors',
        'before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-white/35 dark:before:bg-white/10',
        className,
      )}
    >
      {children}
    </HCard>
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-between gap-3 p-4 sm:p-5', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xs font-extrabold uppercase tracking-[0.12em] text-fg-muted', className)} {...props} />
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4 pt-0 sm:p-5 sm:pt-0', className)} {...props} />
}
