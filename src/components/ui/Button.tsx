import { Button as HButton } from '@heroui/react'
import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  className?: string
  children?: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  isIconOnly?: boolean
  'aria-label'?: string
}

// Map our variants onto HeroUI's, applying our accent via className (HeroUI
// merges classes with tailwind-merge, so these win over its defaults).
const VARIANT: Record<Variant, { heroui: 'primary' | 'ghost' | 'outline'; className: string }> = {
  primary: { heroui: 'primary', className: 'bg-accent text-accent-on hover:bg-accent-strong shadow-glow' },
  ghost: { heroui: 'ghost', className: 'text-fg hover:bg-bg-hover' },
  outline: { heroui: 'outline', className: 'border-line text-fg hover:bg-bg-hover' },
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  onClick,
  disabled,
  type,
  isIconOnly,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const v = VARIANT[variant]
  return (
    <HButton
      variant={v.heroui}
      size={size}
      type={type}
      isDisabled={disabled}
      isIconOnly={isIconOnly}
      onPress={onClick}
      aria-label={ariaLabel}
      className={cn('rounded-xl font-semibold', v.className, className)}
    >
      {children}
    </HButton>
  )
}
