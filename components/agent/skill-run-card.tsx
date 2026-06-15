"use client";

import { useEffect, useRef, useState } from "react";
import type { SkillRun } from "@/lib/types";
import { JTBDS } from "@/lib/brand";
import { guidanceFor, type Priority } from "@/lib/agent/guidance";
import { ArtifactCard } from "./artifact-card";

function glyphFor(skill: string) {
  return JTBDS.find((j) => j.skill === skill)?.glyph ?? "❖";
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function priorityClass(p: Priority) {
  return p === "now"
    ? "border-breach/40 bg-breach/10 text-breach"
    : p === "soon"
      ? "border-brass/40 bg-brass/10 text-brass"
      : "border-border-soft bg-surface-2 text-text-soft";
}

function GuidanceBlock({ run }: { run: SkillRun }) {
  const { recommendations, nextSteps } = guidanceFor(run.artifact);
  return (
    <div className="mt-3 rounded-xl border border-accent-2/30 bg-accent-2/[0.06] p-4">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-2">
        Recommended changes — what to change, where & to what
      </p>
      <ul className="space-y-2.5">
        {recommendations.map((r, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase ${priorityClass(r.priority)}`}
            >
              {r.priority}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text">{r.action}</p>
              <p className="text-xs leading-relaxed text-text-soft">
                Where: <span className="text-text">{r.where}</span>
                <span className="mx-1 text-accent-2">→</span>
                Change to:{" "}
                <span className="font-medium text-verdict">{r.target}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-2">
        Your next steps — end to end
      </p>
      <ol className="list-decimal space-y-1 pl-5">
        {nextSteps.map((s, i) => (
          <li key={i} className="text-sm leading-relaxed text-text">
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SkillRunCard({
  run,
  onComplete,
  speed = "normal",
}: {
  run: SkillRun;
  onComplete?: () => void;
  speed?: "normal" | "fast";
}) {
  const STEP = speed === "fast" ? 480 : 950;
  const THINK = 700;
  const GAP = 800;

  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [showArtifact, setShowArtifact] = useState(false);
  const fired = useRef(false);
  const n = run.console.length;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStarted(true), THINK));
    for (let i = 1; i <= n; i++) {
      timers.push(setTimeout(() => setCompleted(i), THINK + i * STEP));
    }
    timers.push(
      setTimeout(() => {
        setShowArtifact(true);
        if (!fired.current) {
          fired.current = true;
          onComplete?.();
        }
      }, THINK + n * STEP + GAP),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const running = !showArtifact;
  const activeIndex = completed; // step currently executing

  return (
    <div className="rounded-2xl border border-border-soft bg-surface/80 p-5 card-ring">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-xl text-ivory">
          {glyphFor(run.skill)}
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold leading-tight text-text">
            {run.title}
          </p>
          <p className="text-xs uppercase tracking-[0.16em] text-text-soft">
            {run.skill} skill
          </p>
        </div>
        <span className="ml-auto text-xs font-medium">
          {!started ? (
            <span className="inline-flex items-center gap-1.5 text-accent-2">
              <Spinner /> planning…
            </span>
          ) : running ? (
            <span className="inline-flex items-center gap-1.5 text-accent-2">
              <Spinner /> step {Math.min(activeIndex + 1, n)}/{n}
            </span>
          ) : (
            <span className="text-verdict">✓ done · {n} steps</span>
          )}
        </span>
      </div>

      {/* Plan */}
      <div className="mt-4">
        <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-text-soft">
          Plan
        </p>
        <ul className="space-y-1">
          {run.plan.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-text-soft">
              <span className="text-accent-2">·</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Console */}
      <div className="mt-4 rounded-xl border border-border-soft bg-chambers/95 p-4 font-mono text-[13px] leading-relaxed text-vellum">
        <p className="mb-2 text-[0.66rem] uppercase tracking-[0.2em] text-vellum/40">
          execution trace
        </p>
        {!started && (
          <div className="flex items-center gap-2 text-brass-bright">
            <Spinner /> <span className="animate-pulse">planning the approach…</span>
          </div>
        )}
        {started &&
          run.console.map((step, i) => {
            if (i > activeIndex) return null;
            const isDone = i < completed;
            return (
              <div key={i} className="animate-fade flex items-start gap-2 py-0.5">
                {isDone ? (
                  <span className="mt-0.5 text-verdict">✓</span>
                ) : (
                  <span className="mt-0.5 text-brass-bright">
                    <Spinner />
                  </span>
                )}
                <span className="text-parchment">{step.label}</span>
                {step.detail && (
                  <span
                    className={isDone ? "text-vellum/70" : "text-vellum/40 animate-pulse"}
                  >
                    {isDone ? step.detail : "running…"}
                  </span>
                )}
              </div>
            );
          })}
      </div>

      {/* Artifact + closing + guidance */}
      {showArtifact && (
        <div className="animate-rise">
          <ArtifactCard artifact={run.artifact} />
          <p className="mt-3 text-sm leading-relaxed text-text">{run.closing}</p>
          <GuidanceBlock run={run} />
        </div>
      )}
    </div>
  );
}
