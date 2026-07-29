import { Volume2 } from 'lucide-react'
import { useSpeak } from '@/lib/useSpeak'
import { cn } from '@/lib/cn'

interface SpeakButtonProps {
  text: string
  label?: string
  className?: string
  /** Compact icon-only round button when true. */
  icon?: boolean
}

/** Tappable Japanese pronunciation button. Renders nothing if TTS is unsupported. */
export function SpeakButton({ text, label, className, icon }: SpeakButtonProps) {
  const { speak, speaking, supported } = useSpeak()
  if (!supported) return null

  const handle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    speak(text)
  }

  if (icon) {
    return (
      <button
        type="button"
        onClick={handle}
        aria-label={`Play pronunciation${label ? `: ${label}` : ''}`}
        className={cn(
          'grid h-9 w-9 place-items-center rounded-full text-fg-muted transition-colors',
          'hover:bg-bg-hover hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          speaking && 'text-accent-fg',
          className,
        )}
      >
        <Volume2 className={cn('h-4 w-4', speaking && 'animate-pulse')} />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={`Play pronunciation${label ? `: ${label}` : ''}`}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm text-fg-faint transition-colors hover:text-accent-fg',
        speaking && 'text-accent-fg',
        className,
      )}
    >
      <Volume2 className={cn('h-4 w-4', speaking && 'animate-pulse')} />
      {label}
    </button>
  )
}
