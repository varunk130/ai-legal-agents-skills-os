import Link from "next/link";
import { Reveal } from "@/components/home/reveal";
import {
  EXTENT,
  HOW_IT_WORKS,
  IMPACT,
  JTBDS,
  POSITIONING,
  PROBLEM,
  PRODUCT,
  ROI,
  SOLUTION,
} from "@/lib/brand";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent-2">
      <span className="h-px w-6 bg-accent-2/70" />
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-text-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
              Agentic legal workflow · Synthetic showcase
            </span>
          </div>

          <h1 className="animate-rise mt-7 max-w-4xl font-display text-5xl font-semibold leading-[1.04] tracking-tight text-text sm:text-6xl">
            The AI legal team that{" "}
            <span className="text-accent">runs the work</span> — not just the
            chat.
          </h1>

          <p className="animate-rise mt-6 max-w-2xl text-lg leading-relaxed text-text-soft">
            {PRODUCT.subtitle}
          </p>

          <div className="animate-rise mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/agent"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ivory transition-transform hover:-translate-y-0.5"
            >
              Open the agent
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/evals"
              className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent-2/60"
            >
              Run the evals
            </Link>
          </div>

          {/* Skill chips */}
          <div className="animate-rise mt-12">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-text-soft">
              One agent · nine jobs
            </p>
            <div className="flex flex-wrap gap-2">
              {JTBDS.map((j) => (
                <span
                  key={j.id}
                  className="inline-flex items-center gap-2 rounded-lg border border-border-soft bg-surface/80 px-3 py-1.5 text-sm text-text"
                >
                  <span className="text-accent-2">{j.glyph}</span>
                  {j.title}
                </span>
              ))}
            </div>
          </div>

          {/* Positioning pillars */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {POSITIONING.pillars.map((p, i) => (
              <Reveal
                key={p.name}
                delay={i * 90}
                className="card-ring rounded-2xl border border-border-soft bg-surface/80 p-6"
              >
                <p className="font-display text-xl font-semibold text-text">
                  {p.name}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-accent-2">
                  {p.who}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-soft">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <Reveal>
          <Kicker>{PROBLEM.kicker}</Kicker>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
            {PROBLEM.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-soft">
            {PROBLEM.body}
          </p>
        </Reveal>
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEM.pains.map((pain, i) => (
            <Reveal
              key={pain}
              delay={i * 60}
              className="flex items-start gap-3 rounded-xl border border-border-soft bg-surface/60 p-4"
            >
              <span className="mt-0.5 text-accent">✕</span>
              <span className="text-sm text-text">{pain}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Extent */}
      <section className="border-y border-border-soft bg-surface/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-16">
          <Reveal>
            <Kicker>{EXTENT.kicker}</Kicker>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
              {EXTENT.title}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EXTENT.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <p className="font-display text-5xl font-semibold text-accent">
                  {s.value}
                </p>
                <p className="mt-2 text-sm leading-snug text-text-soft">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-xs italic text-text-soft">
            {EXTENT.source.lead}{" "}
            <a
              href={EXTENT.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-70"
            >
              {EXTENT.source.label}
            </a>
            .
          </p>
        </div>
      </section>

      {/* ROI */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <Reveal>
          <Kicker>{ROI.kicker}</Kicker>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
            {ROI.title}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROI.stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 70}
              className="card-ring rounded-2xl border border-border-soft bg-surface/80 p-6"
            >
              <p className="font-display text-4xl font-semibold text-verdict">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-medium text-text">{s.label}</p>
              <p className="mt-1 text-xs text-text-soft">{s.sub}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.18em] text-text-soft">
            Improves
          </span>
          {ROI.improves.map((x) => (
            <span
              key={x}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface/70 px-3 py-1 text-sm text-text"
            >
              <span className="text-verdict">✓</span>
              {x}
            </span>
          ))}
        </div>
        <p className="mt-6 text-xs italic text-text-soft">
          {ROI.source.lead}{" "}
          <a
            href={ROI.source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-70"
          >
            {ROI.source.label}
          </a>
          .
        </p>
      </section>

      {/* Impact */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <Reveal>
          <Kicker>{IMPACT.kicker}</Kicker>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
            {IMPACT.title}
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT.items.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 70}
              className="card-ring rounded-2xl border border-border-soft bg-surface/80 p-6"
            >
              <p className="font-display text-lg font-semibold text-text">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="relative overflow-hidden border-y border-border-soft bg-accent text-ivory">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-brass-bright">
              <span className="h-px w-6 bg-brass-bright/70" />
              {SOLUTION.kicker}
            </span>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {SOLUTION.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/80">
              {SOLUTION.body}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JTBDS.map((j, i) => (
              <Reveal
                key={j.id}
                delay={i * 50}
                className="rounded-2xl border border-ivory/15 bg-oxblood-dark/40 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-brass-bright">{j.glyph}</span>
                  <span className="font-mono text-xs text-ivory/50">
                    {j.code}
                  </span>
                </div>
                <p className="mt-3 font-display text-lg font-semibold">
                  {j.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory/75">
                  {j.jtbd}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-brass-bright/80">
                  {j.aligns}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <Reveal>
          <Kicker>{HOW_IT_WORKS.kicker}</Kicker>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
            {HOW_IT_WORKS.title}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 80} className="relative">
              <span className="font-display text-5xl font-semibold text-accent-2/40">
                {step.n}
              </span>
              <p className="mt-3 font-display text-xl font-semibold text-text">
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-8">
        <Reveal className="card-ring overflow-hidden rounded-3xl border border-border-soft bg-surface p-10 text-center sm:p-14">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
            Meet the master agent — and watch it work.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-text-soft">
            A single conversational agent that runs every job end to end, shows
            its skills executing, and verifies its own output.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/agent"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ivory transition-transform hover:-translate-y-0.5"
            >
              Open the agent
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/evals"
              className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent-2/60"
            >
              Open the evals dashboard
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
