import { type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

interface StatChipProps {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  tone?: string // tailwind text color class for the icon
  iconBg?: string
}

export function StatChip({ icon: Icon, label, value, sub, tone = 'text-accent-fg', iconBg = 'bg-accent/10' }: StatChipProps) {
  return (
    <Card className="flex items-center gap-3 p-3.5 hover:bg-bg-hover sm:p-4">
      <div className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', iconBg, tone)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-fg-muted">{label}</p>
        <p className="text-lg font-extrabold leading-tight text-fg-strong">{value}</p>
        {sub ? <p className="truncate text-[11px] text-fg-faint">{sub}</p> : null}
      </div>
    </Card>
  )
}
