import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { CircleNotch as Loader2 } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'
import { ApiError } from '@/lib/api'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const { user, login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/dashboard'

  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={from} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'signup') await signup(name, email, password)
      else await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-bg px-4">
      <div
        className="absolute inset-0 bg-[linear-gradient(120deg,rgb(var(--accent)/0.16),transparent_38%,rgb(var(--bg-soft)/0.62)),linear-gradient(180deg,transparent,rgb(var(--bg)/0.72))]"
        aria-hidden="true"
      />
      <div
        className="absolute left-6 top-14 hidden font-display text-[10rem] font-bold leading-none text-fg-strong/[0.035] lg:block"
        aria-hidden="true"
      >
        日本語
      </div>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent font-display text-2xl font-bold text-accent-on shadow-glow">
            字
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-fg-strong">Kanji Express</h1>
            <p className="text-sm font-medium text-fg-muted">
              {mode === 'login' ? 'Welcome back — continue your streak.' : 'Create an account to start learning.'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-bg-card/95 p-6 shadow-card backdrop-blur-md">
          {/* Tabs */}
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-bg-soft p-1 ring-1 ring-inset ring-line">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m)
                  setError(null)
                }}
                className={
                  'rounded-lg py-2 text-sm font-semibold transition-colors ' +
                  (mode === m ? 'bg-accent text-accent-on' : 'text-fg-muted hover:text-fg')
                }
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === 'signup' && (
              <Field label="Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="ke-input"
                  placeholder="Adhitya"
                />
              </Field>
            )}

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="ke-input"
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={8}
                className="ke-input"
                placeholder="At least 8 characters"
              />
            </Field>

            {error && (
              <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Please wait…
                </>
              ) : mode === 'login' ? (
                'Log in'
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-fg-faint">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="font-semibold text-accent-fg hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-fg-muted">{label}</span>
      {children}
    </label>
  )
}
