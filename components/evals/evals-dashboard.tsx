"use client";

import { useMemo, useRef, useState } from "react";
import {
  caseScore,
  caseVerdict,
  dimensionAverages,
  DIMENSIONS,
  EVAL_META,
  GOLDEN_SET,
  summarize,
  type GoldenCase,
  type Verdict,
} from "@/lib/evals/suites";

type Phase = "idle" | "running" | "done";

function verdictCls(v: Verdict) {
  return v === "pass"
    ? "border-verdict/40 bg-verdict/10 text-verdict"
    : v === "warn"
      ? "border-brass/40 bg-brass/10 text-brass"
      : "border-breach/40 bg-breach/10 text-breach";
}

function scoreTone(score: number) {
  return score >= 4 ? "text-verdict" : score >= 3 ? "text-brass" : "text-breach";
}

function barCls(score: number) {
  return score >= 4 ? "bg-verdict" : score >= 3 ? "bg-brass" : "bg-breach";
}

function verdictIcon(v: Verdict) {
  return v === "pass" ? "✓" : v === "warn" ? "!" : "✕";
}

function Metric({
  label,
  value,
  accent = "text-text",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface/70 p-4">
      <p className={`font-display text-3xl font-semibold ${accent}`}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-text-soft">{label}</p>
    </div>
  );
}

export function EvalsDashboard() {
  const cases = GOLDEN_SET;
  const total = cases.length;
  const full = useMemo(() => summarize(cases), [cases]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("running");
    setRevealed(0);
    setExpanded(null);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= total) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPhase("done");
      }
    }, 230);
  };

  const shown = cases.slice(0, revealed);
  const live = summarize(shown);
  const dims = dimensionAverages(shown);
  const logTail = shown.slice(-6);

  const toggle = (id: string) => setExpanded((e) => (e === id ? null : id));

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8">
      {/* Control bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border-soft bg-surface/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-text">
            {EVAL_META.dataset}
          </p>
          <p className="mt-1 text-sm text-text-soft">
            {EVAL_META.size} prompts · {EVAL_META.judge} · {EVAL_META.scale} · pass ≥{" "}
            {EVAL_META.passThreshold.toFixed(1)} · deterministic &amp; reproducible
          </p>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={phase === "running"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ivory transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-60"
        >
          {phase === "idle"
            ? "▶ Run evaluation"
            : phase === "running"
              ? "Running…"
              : "↻ Re-run evaluation"}
        </button>
      </div>

      {/* Progress + live log */}
      {phase !== "idle" && (
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent-2 transition-all duration-150"
                style={{ width: `${(revealed / total) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-text-soft">
              {revealed}/{total} cases judged{" "}
              {phase === "running" && (
                <span className="animate-blink text-accent-2">▋</span>
              )}
            </p>
          </div>
          <div className="rounded-lg border border-border-soft bg-chambers/95 p-3 font-mono text-[11px] leading-relaxed text-vellum">
            {logTail.map((c) => {
              const v = caseVerdict(c);
              return (
                <div key={c.id} className="animate-fade flex gap-2">
                  <span className="text-brass-bright">{c.id}</span>
                  <span className="text-vellum/60">{c.category}</span>
                  <span className="ml-auto text-parchment">{caseScore(c)}/5</span>
                  <span
                    className={
                      v === "pass"
                        ? "text-verdict"
                        : v === "warn"
                          ? "text-brass-bright"
                          : "text-breach"
                    }
                  >
                    {verdictIcon(v)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric
          label="Overall / 5"
          value={phase === "idle" ? "—" : live.overall.toFixed(1)}
          accent={phase === "idle" ? "text-text" : scoreTone(live.overall)}
        />
        <Metric
          label="Pass rate"
          value={phase === "idle" ? "—" : `${live.passRate}%`}
          accent="text-verdict"
        />
        <Metric label="Passed" value={phase === "idle" ? "—" : String(live.pass)} accent="text-verdict" />
        <Metric label="Warnings" value={phase === "idle" ? "—" : String(live.warn)} accent="text-brass" />
        <Metric label="Failed" value={phase === "idle" ? "—" : String(live.fail)} accent="text-breach" />
        <Metric
          label="Avg latency"
          value={phase === "done" ? `${full.avgLatency}ms` : "—"}
        />
      </div>

      {/* Per-dimension scores */}
      <div className="mt-6 rounded-2xl border border-border-soft bg-surface/70 p-5 card-ring">
        <p className="mb-3 font-display text-base font-semibold text-text">
          Scores by dimension{" "}
          <span className="text-sm font-normal text-text-soft">
            (LLM-as-a-judge, averaged)
          </span>
        </p>
        <div className="space-y-2.5">
          {dims.map((d) => (
            <div key={d.key} className="grid grid-cols-[160px_1fr_44px] items-center gap-3">
              <span
                className="truncate text-sm text-text"
                title={DIMENSIONS.find((x) => x.key === d.key)?.desc}
              >
                {d.key}
              </span>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barCls(d.avg)}`}
                  style={{ width: `${phase === "idle" ? 0 : (d.avg / 5) * 100}%` }}
                />
              </div>
              <span
                className={`text-right font-mono text-xs ${phase === "idle" ? "text-text-soft" : scoreTone(d.avg)}`}
              >
                {phase === "idle" ? "—" : d.avg.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-case results */}
      <div className="mt-6">
        <p className="mb-2 font-display text-base font-semibold text-text">
          Case-by-case results
        </p>
        <div className="space-y-1.5">
          {(phase === "idle" ? cases : shown).map((c: GoldenCase) => {
            const v = caseVerdict(c);
            const score = caseScore(c);
            const open = expanded === c.id;
            const judged = phase !== "idle";
            return (
              <div
                key={c.id}
                className="overflow-hidden rounded-lg border border-border-soft bg-surface/60"
              >
                <button
                  type="button"
                  onClick={() => judged && toggle(c.id)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
                >
                  <span className="font-mono text-[0.7rem] text-text-soft">{c.id}</span>
                  <span className="hidden rounded border border-border-soft bg-surface-2 px-1.5 py-0.5 text-[0.62rem] uppercase tracking-wide text-text-soft sm:inline">
                    {c.category}
                  </span>
                  <span className="flex-1 truncate text-sm text-text">{c.prompt}</span>
                  {judged ? (
                    <>
                      <span className={`font-display text-sm font-semibold ${scoreTone(score)}`}>
                        {score.toFixed(1)}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[0.62rem] font-semibold uppercase ${verdictCls(v)}`}
                      >
                        {v}
                      </span>
                      <span className="text-text-soft">{open ? "▾" : "▸"}</span>
                    </>
                  ) : (
                    <span className="animate-blink text-xs text-accent-2">•••</span>
                  )}
                </button>

                {judged && open && (
                  <div className="space-y-3 border-t border-border-soft px-3 py-3 text-sm">
                    <div>
                      <p className="text-[0.66rem] font-semibold uppercase tracking-wide text-text-soft">
                        Golden answer
                      </p>
                      <p className="mt-0.5 text-text-soft">{c.gold}</p>
                    </div>
                    <div>
                      <p className="text-[0.66rem] font-semibold uppercase tracking-wide text-text-soft">
                        Agent output
                      </p>
                      <p className="mt-0.5 text-text">{c.actual}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {DIMENSIONS.map((d) => {
                        const sv = c.scores[d.key];
                        return (
                          <span
                            key={d.key}
                            className={`rounded-md border px-2 py-0.5 text-[0.66rem] ${
                              sv >= 4
                                ? "border-verdict/40 bg-verdict/10 text-verdict"
                                : sv >= 3
                                  ? "border-brass/40 bg-brass/10 text-brass"
                                  : "border-breach/40 bg-breach/10 text-breach"
                            }`}
                          >
                            {d.key} {sv}/5
                          </span>
                        );
                      })}
                    </div>
                    <div className="rounded-lg border-l-2 border-accent-2 bg-surface/60 px-3 py-2">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-wide text-accent-2">
                        Judge rationale
                      </p>
                      <p className="mt-0.5 text-text-soft">{c.rationale}</p>
                    </div>
                    <p className="font-mono text-[0.66rem] text-text-soft">
                      latency {c.latencyMs}ms · {c.tokens} tokens
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {phase === "done" && (
        <div className="mt-6 rounded-2xl border border-verdict/30 bg-verdict/5 p-5">
          <p className="text-sm text-text">
            <span className="font-semibold text-verdict">
              Evaluation complete — overall {full.overall.toFixed(1)}/5, {full.passRate}% pass.
            </span>{" "}
            {full.pass} passed, {full.warn} warning(s), {full.fail} failed across{" "}
            {full.total} cases · {full.totalTokens.toLocaleString()} tokens judged. The
            failure (EV-08) is a real catch — the agent over-conceded past the approved
            negotiation fallback, which the Safety dimension correctly penalised.
          </p>
        </div>
      )}
    </div>
  );
}
