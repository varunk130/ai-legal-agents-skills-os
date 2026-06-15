import type { Metadata } from "next";
import { Reveal } from "@/components/home/reveal";
import { FlowDiagram } from "@/components/how-it-works/flow-diagram";
import {
  ARCH_INTRO,
  CONNECTORS,
  LAYERS,
  LIFECYCLE,
  NOW_NEXT,
  RETRIEVAL_PIPELINE,
  SKILL_WIRING,
} from "@/lib/architecture";

export const metadata: Metadata = {
  title: "How it works — AI Legal Agents OS",
  description:
    "The architecture behind AI Legal Agents OS: a planner-orchestrated agent that calls tools and data via MCP connectors, grounds answers with retrieval/RAG, reasons with a frontier model, and verifies with a guardian.",
};

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent-2">
      <span className="h-px w-6 bg-accent-2/70" />
      {children}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12">
      <Reveal>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <div>
      {/* Intro */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-12">
        <Reveal>
          <Kicker>{ARCH_INTRO.kicker}</Kicker>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-text sm:text-5xl">
            {ARCH_INTRO.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-soft">
            {ARCH_INTRO.body}
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-brass/40 bg-brass/10 px-4 py-3">
            <span className="mt-0.5 text-brass">⚑</span>
            <p className="text-sm text-text">{ARCH_INTRO.banner}</p>
          </div>
        </Reveal>
      </section>

      {/* The stack */}
      <Section title="The stack">
        <div className="space-y-2">
          {LAYERS.map((layer, i) => (
            <div key={layer.id}>
              <Reveal
                delay={i * 50}
                className="grid items-center gap-4 rounded-2xl border border-border-soft bg-surface/70 p-4 sm:grid-cols-[220px_1fr]"
              >
                <div>
                  <p className="font-display text-lg font-semibold text-text">
                    {layer.name}
                  </p>
                  <p className="text-xs text-text-soft">{layer.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((it) => (
                    <span
                      key={it}
                      className="inline-flex items-center rounded-lg border border-border-soft bg-bg/60 px-3 py-1.5 text-sm text-text"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </Reveal>
              {i < LAYERS.length - 1 && (
                <div className="flex justify-center py-1 text-accent-2/60" aria-hidden>
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Flow diagram */}
      <Section title="How the flow works">
        <Reveal>
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-text-soft">
            The master agent plans a request and routes it to skills, which call
            tools and data through the MCP connector bus, ground their answers
            with retrieval, reason with the model, and return through the
            guardian as a verified artifact.
          </p>
          <FlowDiagram />
        </Reveal>
      </Section>

      {/* Request lifecycle */}
      <section className="border-y border-border-soft bg-surface/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-12">
          <Reveal>
            <Kicker>Request lifecycle</Kicker>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              What happens on every request
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LIFECYCLE.map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 50}
                className="rounded-xl border border-border-soft bg-surface/70 p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-ivory">
                    {s.n}
                  </span>
                  <p className="font-semibold text-text">{s.title}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-soft">
                  {s.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MCP connectors */}
      <Section title="MCP connectors — tools & data the agent calls">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CONNECTORS.map((c, i) => (
            <Reveal
              key={c.name}
              delay={i * 40}
              className="rounded-2xl border border-border-soft bg-surface/70 p-4 card-ring"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-base font-semibold text-text">
                  {c.name}
                </p>
                <span
                  className={`shrink-0 rounded-md border px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide ${
                    c.status === "Mocked today"
                      ? "border-brass/40 bg-brass/10 text-brass"
                      : "border-border-soft bg-bg/60 text-text-soft"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-soft">{c.role}</p>
              <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wide text-accent-2">
                MCP
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Retrieval / RAG */}
      <section className="border-y border-border-soft bg-surface/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-12">
          <Reveal>
            <Kicker>Retrieval · RAG</Kicker>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              How the agent grounds its answers
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-soft">
              Semantic + keyword search over the legal corpora returns passages
              the model reasons from — and the citations the guardian later
              verifies, so nothing is hallucinated.
            </p>
          </Reveal>
          <div className="mt-8 flex flex-wrap items-stretch gap-2">
            {RETRIEVAL_PIPELINE.map((p, i) => (
              <Reveal
                key={p.step}
                delay={i * 50}
                className="flex items-center gap-2"
              >
                <div className="w-44 rounded-xl border border-border-soft bg-surface/70 p-3">
                  <p className="font-mono text-xs font-semibold text-accent-2">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-semibold text-text">{p.step}</p>
                  <p className="mt-1 text-xs leading-snug text-text-soft">
                    {p.body}
                  </p>
                </div>
                {i < RETRIEVAL_PIPELINE.length - 1 && (
                  <span className="text-accent-2/60" aria-hidden>
                    →
                  </span>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skill wiring */}
      <Section title="Skills ↔ tools ↔ data">
        <Reveal className="overflow-x-auto rounded-2xl border border-border-soft bg-surface/70">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-text-soft">
                <th className="border-b border-border-soft px-4 py-3">Skill</th>
                <th className="border-b border-border-soft px-4 py-3">Tools (via MCP)</th>
                <th className="border-b border-border-soft px-4 py-3">Data sources</th>
              </tr>
            </thead>
            <tbody>
              {SKILL_WIRING.map((r) => (
                <tr key={r.skill}>
                  <td className="border-b border-border-soft px-4 py-3 font-semibold text-text">
                    {r.skill}
                  </td>
                  <td className="border-b border-border-soft px-4 py-3 text-text-soft">
                    {r.tools}
                  </td>
                  <td className="border-b border-border-soft px-4 py-3 text-text-soft">
                    {r.sources}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      {/* Now vs Next */}
      <Section title="Now vs. next">
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal className="rounded-2xl border border-verdict/30 bg-verdict/5 p-6">
            <p className="font-display text-lg font-semibold text-verdict">
              Today — this demo
            </p>
            <ul className="mt-3 space-y-2">
              {NOW_NEXT.now.map((x) => (
                <li key={x} className="flex gap-2 text-sm text-text">
                  <span className="text-verdict">✓</span>
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal
            delay={80}
            className="rounded-2xl border border-accent-2/40 bg-accent-2/10 p-6"
          >
            <p className="font-display text-lg font-semibold text-accent-2">
              Next — real wiring
            </p>
            <ul className="mt-3 space-y-2">
              {NOW_NEXT.next.map((x) => (
                <li key={x} className="flex gap-2 text-sm text-text">
                  <span className="text-accent-2">→</span>
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
