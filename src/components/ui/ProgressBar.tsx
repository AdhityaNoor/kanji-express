import { cn } from '@/lib/cn'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  barClassName?: string
  height?: string
}

export function ProgressBar({ value, className, barClassName, height = 'h-2' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('w-full overflow-hidden rounded-full bg-bg-hover shadow-inner', height, className)}
    >
      <div
        className={cn(
          'h-full rounded-full bg-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.28)] transition-[width] duration-700 ease-out',
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
