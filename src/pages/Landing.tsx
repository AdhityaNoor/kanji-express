import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Headphones,
  PenLine,
  Repeat,
  Route,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/auth'

const standout = [
  {
    icon: Route,
    title: 'Express Starter before JLPT',
    body: 'A lightweight launch track teaches scripts, particles, survival phrases, and review habits before N5 begins.',
  },
  {
    icon: PenLine,
    title: 'Kanji recognition plus writing',
    body: 'Study readings, examples, mnemonics, and handwriting practice from the same learning route.',
  },
  {
    icon: Repeat,
    title: 'Review-first memory system',
    body: 'Every lesson feeds a focused review loop so weak items return before they disappear.',
  },
  {
    icon: Brain,
    title: 'AI teacher built around mistakes',
    body: 'The product is designed for explanations, sentence breakdowns, roleplay, and adaptive quiz generation.',
  },
]

const route = [
  ['Starter', 'Scripts, phrases, study loop'],
  ['N5', 'Survival foundations'],
  ['N4', 'Everyday autonomy'],
  ['N3', 'Bridge to intermediate'],
  ['N2', 'Independent fluency'],
  ['N1', 'Advanced mastery'],
]

export default function Landing() {
  const { user } = useAuth()
  const ctaHref = user ? '/dashboard' : '/login'

  return (
    <main className="min-h-screen bg-bg text-fg">
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src="/landing-hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" aria-hidden="true" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white font-display text-base font-black text-black shadow-lg">
              快
            </span>
            <span className="text-sm font-extrabold tracking-wide text-white">Kanji Express</span>
          </Link>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden min-h-11 items-center rounded-xl border border-white/20 px-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              to={ctaHref}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-black transition-colors hover:bg-white/90"
            >
              {user ? 'Open app' : 'Start free'} <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(92vh-76px)] max-w-7xl items-center px-4 pb-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl py-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/85 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> JLPT prep without the cold start
            </div>
            <h1 className="text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
              Board the fastest route to readable Japanese.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/82 sm:text-lg">
              Kanji Express combines a gentle Starter track, JLPT courses, kanji writing, spaced reviews, and AI-guided practice into one focused study route.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={ctaHref}>
                <Button size="lg" className="w-full bg-white text-black hover:bg-white/90 sm:w-auto">
                  {user ? 'Continue learning' : 'Start learning'} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 px-5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg-card/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-3 sm:px-6 lg:px-8">
          <Metric icon={Target} label="Route" value="Starter to N1" />
          <Metric icon={BookOpenCheck} label="Focus" value="JLPT + real use" />
          <Metric icon={Trophy} label="Loop" value="Daily wins" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-accent-fg">Why it stands out</p>
          <h2 className="mt-3 text-3xl font-black text-fg-strong sm:text-4xl">
            Built for learners who quit because the beginning feels too heavy.
          </h2>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {standout.map((item) => (
            <article key={item.title} className="rounded-2xl border border-line bg-bg-card/90 p-5 shadow-card transition-transform hover:-translate-y-0.5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent-fg">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-fg-strong">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-fg-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-bg-soft/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent-fg">The learning route</p>
            <h2 className="mt-3 text-3xl font-black text-fg-strong sm:text-4xl">Lightweight first. Serious after.</h2>
            <p className="mt-4 text-sm leading-6 text-fg-muted">
              The app does not throw new learners directly into formal JLPT sections. It starts with orientation, scripts, phrases, sentence signals, and review behavior, then opens the exam route.
            </p>
          </div>

          <div className="grid gap-2">
            {route.map(([name, body], index) => (
              <div key={name} className="flex items-center gap-3 rounded-2xl border border-line bg-bg-card/90 p-4 shadow-card">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-sm font-black text-accent-on">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-fg-strong">{name}</p>
                  <p className="text-sm text-fg-muted">{body}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-matcha" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <Feature icon={Headphones} title="Listen first" body="Short dialogue and prompt formats make listening less intimidating from day one." />
        <Feature icon={PenLine} title="Write kanji" body="Responsive handwriting practice supports mouse, touch, and stylus with scoring-oriented feedback." />
        <Feature icon={Brain} title="Ask why" body="The AI teacher layer is designed around mistakes, nuance, example generation, and roleplay." />
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-bg-card/90 p-6 shadow-card sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black text-fg-strong">Start with the Starter track.</h2>
            <p className="mt-1 text-sm text-fg-muted">Build momentum before the JLPT route begins.</p>
          </div>
          <Link to={ctaHref}>
            <Button size="lg">
              {user ? 'Open app' : 'Create account'} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

function Metric({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-bg-soft p-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent-fg">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-fg-faint">{label}</p>
        <p className="text-sm font-bold text-fg-strong">{value}</p>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, body }: { icon: typeof Target; title: string; body: string }) {
  return (
    <article>
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-bg-hover text-fg">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-fg-strong">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-fg-muted">{body}</p>
    </article>
  )
}
