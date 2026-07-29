import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="animate-fade-up">
      <h1 className="mb-4 text-2xl font-extrabold text-fg-strong">{title}</h1>
      <Card className="grid place-items-center gap-3 p-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent-fg">
          <Construction className="h-7 w-7" />
        </div>
        <p className="text-sm text-fg-muted">
          The <span className="font-semibold text-fg">{title}</span> module is next on the roadmap.
        </p>
        <p className="max-w-sm text-xs text-fg-faint">
          This is the scaffolded route shell. The Dashboard is fully built — swap this for the real module when you
          build it.
        </p>
      </Card>
    </div>
  )
}
