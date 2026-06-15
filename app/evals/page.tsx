import type { Metadata } from "next";
import { Reveal } from "@/components/home/reveal";
import { EvalFlow } from "@/components/evals/eval-flow";
import { EvalsDashboard } from "@/components/evals/evals-dashboard";
import { DIMENSIONS, EVAL_META } from "@/lib/evals/suites";

export const metadata: Metadata = {
  title: "Evals — AI Legal Agents OS",
  description:
    "A golden dataset of 20 prompts scored by an LLM-as-a-judge across six dimensions — accuracy, groundedness, completeness, relevance, safety and instruction-following.",
};

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent-2">
      <span className="h-px w-6 bg-accent-2/70" />
      {children}
    </span>
  );
}

export default function EvalsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mx-auto w-full max-w-6xl px-5 pt-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-text-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
          AI evaluations · golden set + LLM-as-a-judge
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-text">
          Evals
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-soft">
          You can&apos;t ship a legal agent you can&apos;t measure. We run a{" "}
          <strong className="text-text">
            golden dataset of {EVAL_META.size} prompts
          </strong>{" "}
          through the agent and score every output with an{" "}
          <strong className="text-text">LLM-as-a-judge</strong> across six
          dimensions — so quality, groundedness and safety are continuously
          verified against a reference answer.
        </p>
      </div>

      {/* Method */}
      <section className="mx-auto w-full max-w-6xl px-5 py-12">
        <Reveal>
          <Kicker>The method</Kicker>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Golden dataset, judged by a model
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: String(EVAL_META.size), l: "Golden prompts", s: "with reference answers" },
            { v: "6", l: "Scoring dimensions", s: "per response" },
            { v: EVAL_META.scale, l: "Judge scale", s: EVAL_META.judge },
            { v: `≥ ${EVAL_META.passThreshold.toFixed(1)}`, l: "Pass threshold", s: "overall, out of 5" },
          ].map((m, i) => (
            <Reveal
              key={m.l}
              delay={i * 70}
              className="card-ring rounded-2xl border border-border-soft bg-surface/80 p-5"
            >
              <p className="font-display text-3xl font-semibold text-accent">{m.v}</p>
              <p className="mt-1 text-sm font-medium text-text">{m.l}</p>
              <p className="text-xs text-text-soft">{m.s}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Dimensions */}
      <section className="border-y border-border-soft bg-surface/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-12">
          <Reveal>
            <Kicker>The dimensions</Kicker>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              Six things the judge checks
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DIMENSIONS.map((d, i) => (
              <Reveal
                key={d.key}
                delay={i * 60}
                className="rounded-2xl border border-border-soft bg-surface/70 p-5"
              >
                <p className="font-display text-lg font-semibold text-text">{d.key}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-soft">{d.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process flow */}
      <section className="mx-auto w-full max-w-6xl px-5 py-12">
        <Reveal>
          <Kicker>The process</Kicker>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            How an evaluation runs
          </h2>
          <p className="mb-5 mt-3 max-w-2xl text-sm leading-relaxed text-text-soft">
            Each prompt is run through the agent, its output is scored by the LLM
            judge against the golden answer on all six dimensions, then aggregated
            and gated by a pass threshold.
          </p>
          <EvalFlow />
        </Reveal>
      </section>

      {/* Interactive run */}
      <EvalsDashboard />
    </div>
  );
}
