import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'brand' | 'matcha' | 'amber' | 'coral' | 'sakura' | 'neutral'

const tones: Record<Tone, string> = {
  brand: 'bg-accent/10 text-accent-fg ring-accent/25',
  matcha: 'bg-matcha/15 text-matcha ring-matcha/30',
  amber: 'bg-amber/15 text-amber ring-amber/30',
  coral: 'bg-coral/15 text-coral ring-coral/30',
  sakura: 'bg-sakura/15 text-sakura ring-sakura/30',
  neutral: 'bg-fg/10 text-fg-muted ring-line',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
