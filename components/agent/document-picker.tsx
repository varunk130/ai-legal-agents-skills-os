"use client";

import type { LegalDoc } from "@/lib/agent/documents";

function riskClass(r: LegalDoc["overallRisk"]) {
  return r === "High"
    ? "border-breach/40 bg-breach/10 text-breach"
    : r === "Medium"
      ? "border-brass/40 bg-brass/10 text-brass"
      : "border-verdict/40 bg-verdict/10 text-verdict";
}

export function DocumentPicker({
  docs,
  onPick,
  onClose,
}: {
  docs: LegalDoc[];
  onPick: (doc: LegalDoc) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <div className="animate-rise relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-soft bg-surface-2/60 px-5 py-4">
          <div>
            <p className="font-display text-lg font-semibold text-text">
              Upload a document to review
            </p>
            <p className="text-xs text-text-soft">
              Pick a synthetic document — the agent will connect to its
              repository and review it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border-soft px-2.5 py-1 text-sm text-text-soft transition-colors hover:text-text"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
          {docs.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onPick(d)}
              className="group flex w-full items-start gap-3 rounded-xl border border-border-soft bg-bg/50 p-4 text-left transition-colors hover:border-accent-2/60 hover:bg-surface-2/50"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-lg text-ivory">
                📄
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-text">{d.title}</span>
                  <span
                    className={`shrink-0 rounded-md border px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide ${riskClass(d.overallRisk)}`}
                  >
                    {d.overallRisk} risk
                  </span>
                </span>
                <span className="mt-0.5 block font-mono text-[0.7rem] text-text-soft">
                  {d.id} · {d.docType} · {d.counterparty} · {d.pages} pp
                </span>
                <span className="mt-1.5 block text-sm leading-snug text-text-soft">
                  {d.summary}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent-2">
                  Upload &amp; review
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>

        <p className="border-t border-border-soft bg-surface-2/40 px-5 py-3 text-xs italic text-text-soft">
          All documents are synthetic and generated for this demo.
        </p>
      </div>
    </div>
  );
}
