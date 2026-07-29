import { Chip } from '@heroui/react'
import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'brand' | 'matcha' | 'amber' | 'coral' | 'sakura' | 'neutral'

const tones: Record<Tone, string> = {
  brand: 'bg-accent/12 text-accent-fg ring-accent/25',
  matcha: 'bg-matcha/15 text-matcha ring-matcha/30',
  amber: 'bg-amber/15 text-amber ring-amber/30',
  coral: 'bg-coral/15 text-coral ring-coral/30',
  sakura: 'bg-sakura/15 text-sakura ring-sakura/30',
  neutral: 'bg-fg/10 text-fg-muted ring-line',
}

interface BadgeProps {
  tone?: Tone
  className?: string
  children?: ReactNode
}

/** Small status pill, built on HeroUI's Chip. */
export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <Chip
      size="sm"
      variant="soft"
      className={cn(
        'inline-flex h-auto items-center gap-1 px-2.5 py-1 text-xs font-bold ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </Chip>
  )
}
