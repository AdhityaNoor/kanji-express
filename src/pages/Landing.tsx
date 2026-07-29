import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenText,
  Brain,
  CardsThree,
  ChalkboardTeacher,
  ChartLineUp,
  Check,
  CheckCircle,
  Compass,
  Exam,
  Fire,
  Gauge,
  PencilLine,
  Sparkle,
  SpeakerHigh,
  Target,
  Trophy,
  type Icon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/cn'

const proof = ['Express Starter', 'JLPT N5-N1', 'Stroke lab', 'SRS reviews', 'AI teacher']

const modules = [
  {
    icon: Compass,
    title: 'Begin before N5',
    body: 'A gentle Starter track teaches scripts, phrases, sentence signals, and the review habit before formal JLPT study.',
  },
  {
    icon: PencilLine,
    title: 'Write kanji, not just recognize it',
    body: 'Trace strokes, replay attempts, compare order, and keep readings/examples close to the drawing canvas.',
  },
  {
    icon: CardsThree,
    title: 'Memory loop built in',
    body: 'Lessons feed review surfaces so vocabulary, kanji, grammar, and weak topics return at the right moment.',
  },
  {
    icon: ChalkboardTeacher,
    title: 'AI teacher for mistakes',
    body: 'Ask for sentence breakdowns, practice prompts, roleplay, and explanations around the errors you actually make.',
  },
]

const path = [
  ['Starter', 'Kana, survival phrases, sentence signals'],
  ['N5', 'Core words, beginner grammar, first kanji'],
  ['N4', 'Daily life, plans, reasons, short reading'],
  ['N3', 'Intermediate bridge, nuance, listening stamina'],
  ['N2', 'Work, news, formal material'],
  ['N1', 'Dense reading, register, native-speed practice'],
]

const productCards = [
  { icon: BookOpenText, title: 'Lesson route', body: 'Structured modules for vocab, kanji, grammar, listening, reading, and tests.' },
  { icon: SpeakerHigh, title: 'Audio-first practice', body: 'Japanese examples stay paired with listening prompts and pronunciation support.' },
  { icon: Gauge, title: 'Readiness tracking', body: 'Daily goal, weak topics, accuracy, and exam readiness stay visible.' },
  { icon: Exam, title: 'Practice tests', body: 'Move from small drills into exam-oriented checks as each level opens.' },
]

const stats = [
  ['92', 'lessons seeded'],
  ['6', 'study routes'],
  ['20x', 'kanji pass target'],
  ['1', 'daily focus loop'],
]

export default function Landing() {
  const { user } = useAuth()
  const ctaHref = user ? '/dashboard' : '/login'

  return (
    <main className="min-h-screen overflow-hidden bg-bg text-fg">
      <section className="relative min-h-[100svh]">
        <img src="/landing-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(255_255_255/0.18),transparent_34rem),linear-gradient(180deg,rgb(0_0_0/0.34),rgb(var(--bg)/0.96)_82%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/25" />

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Link to="/" className="landing-reveal flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white font-display text-sm font-black text-black shadow-lg sm:h-10 sm:w-10 sm:text-base">
              {'\u5feb'}
            </span>
            <span className="truncate text-sm font-extrabold tracking-wide text-white max-[370px]:hidden">Kanji Express</span>
          </Link>
          <nav className="landing-reveal landing-delay-1 flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle className="text-white/80 hover:bg-white/10 hover:text-white" />
            <Link
              to="/login"
              className="hidden min-h-11 items-center rounded-xl border border-white/20 px-4 text-sm font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/10 sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              to={ctaHref}
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 text-xs font-bold text-black shadow-lg transition-colors hover:bg-white/90 sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm"
            >
              {user ? 'Open app' : 'Start free'} <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-72px)] w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-12 pt-6 sm:min-h-[calc(100svh-84px)] sm:gap-10 sm:px-6 sm:pb-16 sm:pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="min-w-0 max-w-3xl">
            <div className="landing-reveal mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/18 bg-white/8 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-white/86 shadow-card backdrop-blur sm:mb-5 sm:text-xs sm:tracking-[0.14em]">
              <Sparkle className="h-3.5 w-3.5 shrink-0" weight="fill" /> <span className="truncate">JLPT study without the cold start</span>
            </div>
            <h1 className="landing-reveal landing-delay-1 max-w-[18ch] text-4xl font-black leading-[0.98] text-white min-[380px]:text-5xl sm:max-w-4xl sm:text-6xl sm:leading-[0.95] lg:text-7xl">
              Learn Japanese through one calm, guided route.
            </h1>
            <p className="landing-reveal landing-delay-2 mt-5 max-w-[36rem] text-sm leading-6 text-white/78 sm:mt-6 sm:text-lg sm:leading-7">
              Kanji Express combines a Starter track, JLPT courses, handwriting, spaced reviews, audio practice, and AI explanations into a simple daily workflow.
            </p>
            <div className="landing-reveal landing-delay-3 mt-8 grid w-full max-w-sm gap-3 md:flex md:max-w-none md:flex-row">
              <Link to={ctaHref} className="min-w-0">
                <Button size="lg" className="w-full max-w-full justify-center truncate bg-white text-black hover:bg-white/90 md:w-auto">
                  {user ? 'Continue learning' : 'Start learning'} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="#features"
                className="inline-flex min-h-12 min-w-0 items-center justify-center rounded-xl border border-white/24 px-5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10 md:w-auto"
              >
                See how it works
              </a>
            </div>

            <div className="landing-reveal landing-delay-4 mt-8 max-w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] sm:mt-10 sm:[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <div className="landing-marquee flex w-max gap-2">
                {[...proof, ...proof].map((item, index) => (
                  <span key={`${item}-${index}`} className="rounded-full border border-white/14 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/72 backdrop-blur">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <HeroPreview />
        </div>
      </section>

      <section className="border-y border-line bg-bg-card/70 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {stats.map(([value, label], index) => (
            <div key={label} className="landing-reveal py-5 sm:px-6 sm:py-6" style={{ animationDelay: `${index * 70}ms` }}>
              <p className="text-2xl font-black text-fg-strong sm:text-3xl">{value}</p>
              <p className="mt-1 text-sm font-medium text-fg-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <SectionIntro eyebrow="The product" title="A learning app that feels light, but covers the serious work." />
        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2">
          {modules.map((item, index) => (
            <FeatureCard key={item.title} {...item} featured={index === 0} delay={index * 80} />
          ))}
        </div>
      </section>

      <section className="bg-bg-soft/62">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 lg:px-8">
          <div>
            <SectionIntro eyebrow="The route" title="Start small. Unlock depth as momentum builds." />
            <p className="mt-4 text-sm leading-6 text-fg-muted sm:mt-5">
              The homepage should sell the core promise clearly: you are not buying a pile of drills. You are boarding a path from first orientation to exam-ready practice.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-5 top-4 hidden h-[calc(100%-2rem)] w-px bg-line sm:block" />
            <div className="grid gap-3">
              {path.map(([level, body], index) => (
                <div
                  key={level}
                  className="landing-reveal landing-card relative flex items-start gap-3 rounded-2xl border border-line bg-bg-card/92 p-4 shadow-card sm:gap-4"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-black text-accent-on sm:h-10 sm:w-10">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-fg-strong">{level}</p>
                    <p className="mt-1 text-sm leading-5 text-fg-muted sm:leading-6">{body}</p>
                  </div>
                  <CheckCircle className="ml-auto mt-0.5 h-5 w-5 shrink-0 text-matcha max-[370px]:hidden" weight="fill" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <SectionIntro eyebrow="Inside the app" title="Everything learners open daily, highlighted up front." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-4">
          {productCards.map((item, index) => (
            <MiniCard key={item.title} {...item} delay={index * 80} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="landing-reveal landing-card mx-auto max-w-7xl overflow-hidden rounded-3xl border border-line bg-bg-card shadow-card">
          <div className="grid gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <p className="ke-section-label">Ready when you are</p>
              <h2 className="mt-3 max-w-2xl text-2xl font-black text-fg-strong sm:text-4xl">
                Build the daily habit before the exam pressure starts.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-fg-muted">
                Start with the Starter track, then move through kanji, vocabulary, grammar, listening, reading, and tests with one consistent loop.
              </p>
            </div>
            <Link to={ctaHref} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                {user ? 'Open app' : 'Create account'} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function HeroPreview() {
  return (
    <div className="landing-reveal landing-delay-2 relative mx-auto w-full max-w-[calc(100vw-2rem)] min-w-0 sm:max-w-[34rem] lg:mr-0 lg:max-w-[38rem]">
      <div className="landing-glow absolute -inset-3 rounded-[1.75rem] border border-white/10 bg-white/6 blur-2xl sm:-inset-4 sm:rounded-[2rem]" />
      <div className="landing-float landing-card relative min-w-0 overflow-hidden rounded-[1.4rem] border border-white/14 bg-black/34 p-2.5 shadow-2xl backdrop-blur-xl sm:rounded-[1.75rem] sm:p-3">
        <span className="landing-shine" />
        <div className="min-w-0 rounded-[1.1rem] border border-white/10 bg-bg/92 p-3 sm:rounded-[1.35rem] sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-fg-muted">Today</p>
              <p className="mt-1 truncate text-base font-black text-fg-strong sm:text-lg">N5 Daily Route</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1.5 text-[0.7rem] font-bold text-fg sm:px-3 sm:text-xs">
              <Fire className="h-4 w-4 text-amber" weight="fill" /> 12 day streak
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.75fr]">
            <div className="landing-reveal landing-delay-3 rounded-2xl border border-line bg-bg-card p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-extrabold text-fg-strong">Next lesson</p>
                <span className="shrink-0 text-xs font-bold text-fg-muted">+25 XP</span>
              </div>
              <div className="mt-5 flex items-center gap-3 sm:gap-4">
                <PencilLine className="h-7 w-7 shrink-0 text-accent-fg sm:h-8 sm:w-8" weight="duotone" />
                <div className="min-w-0">
                  <p className="font-jp text-2xl font-black text-fg-strong sm:text-3xl">{'\u65e5\u672c\u8a9e'}</p>
                  <p className="truncate text-xs text-fg-muted">Kanji, readings, and examples</p>
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-bg-hover">
                <div className="landing-progress h-full w-[68%] rounded-full bg-accent" />
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-1">
              <PreviewStat icon={Target} label="Daily goal" value="68%" tone="text-accent-fg" delay={320} />
              <PreviewStat icon={ChartLineUp} label="Readiness" value="42%" tone="text-matcha" delay={420} />
            </div>
          </div>

          <div className="mt-3 grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
            <PreviewPill icon={SpeakerHigh} label="Listen" delay={440} />
            <PreviewPill icon={Brain} label="Explain" delay={520} />
            <PreviewPill icon={Trophy} label="Review" delay={600} />
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewStat({ icon: Icon, label, value, tone, delay = 0 }: { icon: Icon; label: string; value: string; tone: string; delay?: number }) {
  return (
    <div className="landing-reveal rounded-2xl border border-line bg-bg-card p-3 sm:p-4" style={{ animationDelay: `${delay}ms` }}>
      <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', tone)} weight="duotone" />
      <p className="mt-3 text-xl font-black text-fg-strong sm:mt-4 sm:text-2xl">{value}</p>
      <p className="text-xs font-medium text-fg-muted">{label}</p>
    </div>
  )
}

function PreviewPill({ icon: Icon, label, delay = 0 }: { icon: Icon; label: string; delay?: number }) {
  return (
    <div className="landing-reveal flex min-w-0 items-center justify-center gap-1.5 rounded-xl border border-line bg-bg-card px-2 py-2 text-xs font-bold text-fg sm:justify-start sm:gap-2 sm:px-3 sm:text-sm" style={{ animationDelay: `${delay}ms` }}>
      <Icon className="h-4 w-4 shrink-0 text-accent-fg" weight="duotone" />
      <span className="truncate">{label}</span>
    </div>
  )
}

function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="ke-section-label">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black leading-tight text-fg-strong sm:text-4xl">{title}</h2>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, body, featured = false, delay = 0 }: { icon: Icon; title: string; body: string; featured?: boolean; delay?: number }) {
  return (
    <article
      className={cn(
        'landing-reveal landing-card group relative overflow-hidden rounded-2xl border border-line bg-bg-card/92 p-5 shadow-card transition-all hover:-translate-y-1 hover:border-accent/35 sm:rounded-3xl sm:p-6',
        featured && 'md:row-span-2',
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="ke-watermark -right-3 -top-5 text-[5.5rem] sm:-right-4 sm:-top-7 sm:text-[7rem]">{'\u5b66'}</div>
      <Icon className="relative h-7 w-7 text-accent-fg sm:h-8 sm:w-8" weight="duotone" />
      <h3 className="relative mt-6 text-lg font-black text-fg-strong sm:mt-8 sm:text-xl">{title}</h3>
      <p className="relative mt-3 text-sm leading-6 text-fg-muted">{body}</p>
      {featured ? (
        <div className="relative mt-6 rounded-2xl border border-line bg-bg-soft p-4 sm:mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-fg-muted">
            <span>Starter track</span>
            <span>Ready for N5</span>
          </div>
          <div className="mt-4 grid gap-2">
            {['Kana sprint', 'Survival phrases', 'Sentence signals'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold text-fg">
                <Check className="h-4 w-4 shrink-0 text-matcha" weight="bold" /> {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}

function MiniCard({ icon: Icon, title, body, delay = 0 }: { icon: Icon; title: string; body: string; delay?: number }) {
  return (
    <article
      className="landing-reveal landing-card rounded-2xl border border-line bg-bg-card/90 p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/35"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon className="h-7 w-7 text-accent-fg" weight="duotone" />
      <h3 className="mt-5 text-base font-black text-fg-strong sm:mt-6">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-fg-muted">{body}</p>
    </article>
  )
}
