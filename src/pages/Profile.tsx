import { useState } from 'react'
import {
  BookOpenText as BookOpenCheck,
  Calendar,
  Check,
  Coins,
  Fire as Flame,
  Lightning as Zap,
  Pencil,
  SignOut as LogOut,
  Trophy,
} from '@phosphor-icons/react'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/lib/auth'
import { api, ApiError } from '@/lib/api'

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [target, setTarget] = useState(user?.jlptTarget ?? 'N5')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) return null
  const p = user.progress

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const { user: updated } = await api.updateProfile({ name, jlptTarget: target })
      setUser(updated)
      setEditing(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const stats = [
    { icon: Zap, label: 'Total XP', value: p.xp.toLocaleString(), tone: 'text-accent-fg' },
    { icon: Trophy, label: 'Level', value: `Lv ${p.level}`, tone: 'text-accent-fg' },
    { icon: Flame, label: 'Current streak', value: `${p.streak}d`, tone: 'text-amber' },
    { icon: Flame, label: 'Longest streak', value: `${p.longestStreak}d`, tone: 'text-coral' },
    { icon: Coins, label: 'Coins', value: p.coins.toLocaleString(), tone: 'text-sakura' },
    { icon: BookOpenCheck, label: 'Lessons done', value: String(p.completedLessonCount), tone: 'text-matcha' },
  ]

  return (
    <div className="mx-auto max-w-3xl animate-fade-up space-y-6">
      <div className="ke-panel p-5 sm:p-6">
        <div className="ke-watermark -right-4 -top-8 text-[8rem]">私</div>
        <div className="relative">
          <p className="ke-section-label">Learner profile</p>
          <h1 className="mt-2 text-2xl font-extrabold text-fg-strong sm:text-3xl">Profile</h1>
        </div>
      </div>

      {/* Identity card */}
      <Card>
        <CardBody className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-2xl ring-2 ring-line shadow-card" />
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-fg-muted">Name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="ke-input max-w-xs" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-fg-muted">JLPT target</span>
                  <div className="flex flex-wrap gap-1.5">
                    {LEVELS.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setTarget(l)}
                        className={
                          'rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ' +
                          (target === l ? 'bg-accent text-accent-on' : 'bg-bg-soft text-fg-muted hover:text-fg')
                        }
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </label>
                {error && <p className="text-sm text-coral">{error}</p>}
                <div className="flex gap-2">
                  <Button size="sm" onClick={save} disabled={saving}>
                    <Check className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-xl font-extrabold text-fg-strong">{user.name}</h2>
                  <Badge tone="brand">Targeting {user.jlptTarget}</Badge>
                </div>
                <p className="truncate text-sm text-fg-muted">{user.email}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-fg-faint">
                  <Calendar className="h-3.5 w-3.5" /> Joined {joined}
                </p>
              </>
            )}
          </div>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          )}
        </CardBody>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-3 p-4 ke-pressable">
            <div className={`grid h-11 w-8 shrink-0 place-items-center ${s.tone}`}>
              <s.icon className="h-6 w-6" weight="duotone" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-fg-muted">{s.label}</p>
              <p className="text-lg font-extrabold text-fg-strong">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Account actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardBody>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
