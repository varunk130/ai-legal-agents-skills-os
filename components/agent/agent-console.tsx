"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, SkillRun } from "@/lib/types";
import { JTBDS, MISSION_PROMPT, STARTERS } from "@/lib/brand";
import { GREETING, route } from "@/lib/agent/engine";
import { runReviewDoc } from "@/lib/agent/skills";
import { DOCUMENTS, type LegalDoc } from "@/lib/agent/documents";
import { BrandMark } from "@/components/brand";
import { SkillRunCard } from "./skill-run-card";
import { DocumentPicker } from "./document-picker";

let counter = 0;
const uid = () => `m${++counter}`;

function TypingBubble() {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0">
        <BrandMark size={30} />
      </span>
      <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border-soft bg-surface px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-accent-2"
            style={{ animation: `blink 1s ${i * 0.18}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

export function AgentConsole() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: uid(), role: "agent", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const queue = useRef<SkillRun[]>([]);
  const speedRef = useRef<"normal" | "fast">("normal");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pending = useRef<number | null>(null);
  const gen = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  useEffect(() => {
    return () => {
      if (pending.current) clearTimeout(pending.current);
    };
  }, []);

  const appendNextRun = useCallback(() => {
    const next = queue.current.shift();
    if (next) {
      setMessages((m) => [
        ...m,
        { id: uid(), role: "agent", run: next, speed: speedRef.current },
      ]);
    } else {
      setBusy(false);
    }
  }, []);

  const handleRunComplete = useCallback(() => {
    if (queue.current.length > 0) {
      setThinking(true);
      window.setTimeout(() => {
        setThinking(false);
        appendNextRun();
      }, 650);
    } else {
      setBusy(false);
    }
  }, [appendNextRun]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      setInput("");
      setBusy(true);
      setThinking(true);
      setMessages((m) => [...m, { id: uid(), role: "user", text }]);

      const myGen = gen.current;
      pending.current = window.setTimeout(() => {
        pending.current = null;
        if (myGen !== gen.current) return;
        const reply = route(text);
        setThinking(false);
        if (reply.kind === "text") {
          setMessages((m) => [...m, { id: uid(), role: "agent", text: reply.text }]);
          setBusy(false);
        } else {
          speedRef.current = reply.runs.length > 1 ? "fast" : "normal";
          setMessages((m) => [...m, { id: uid(), role: "agent", text: reply.intro }]);
          queue.current = [...reply.runs];
          appendNextRun();
        }
      }, 1100);
    },
    [busy, appendNextRun],
  );

  const reviewDoc = useCallback(
    (doc: LegalDoc) => {
      if (busy) return;
      setPickerOpen(false);
      setBusy(true);
      setThinking(true);
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "user",
          attachment: {
            title: doc.title,
            meta: `${doc.id} · ${doc.docType} · ${doc.pages} pp`,
          },
        },
      ]);
      const myGen = gen.current;
      pending.current = window.setTimeout(() => {
        pending.current = null;
        if (myGen !== gen.current) return;
        setThinking(false);
        speedRef.current = "normal";
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "agent",
            text: `Connecting to the document repository and running a full review of "${doc.title}"…`,
          },
        ]);
        queue.current = [runReviewDoc(doc)];
        appendNextRun();
      }, 1100);
    },
    [busy, appendNextRun],
  );

  const reset = () => {
    gen.current += 1;
    if (pending.current) {
      clearTimeout(pending.current);
      pending.current = null;
    }
    queue.current = [];
    setBusy(false);
    setThinking(false);
    setMessages([{ id: uid(), role: "agent", text: GREETING }]);
  };

  const showWelcome = messages.length === 1 && !busy && !thinking;

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* Rail */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <button
          type="button"
          onClick={() => send(MISSION_PROMPT)}
          disabled={busy}
          className="w-full rounded-xl bg-accent px-4 py-3.5 text-left text-sm font-semibold text-ivory transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-50"
        >
          ▶ Run full end-to-end mission
          <span className="mt-0.5 block text-xs font-normal text-ivory/70">
            Triage → review → redline → comply → negotiate → verify
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          disabled={busy}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm font-semibold text-text transition-colors enabled:hover:border-accent-2/60 disabled:opacity-50"
        >
          📎 Upload a document
        </button>

        <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-soft">
          Jobs to be done
        </p>
        <ul className="space-y-1.5">
          {JTBDS.map((j) => (
            <li key={j.id}>
              <button
                type="button"
                onClick={() => send(j.prompt)}
                disabled={busy}
                className="group flex w-full items-center gap-2.5 rounded-lg border border-border-soft bg-surface/70 px-3 py-2.5 text-left transition-colors enabled:hover:border-accent-2/50 disabled:opacity-50"
              >
                <span className="text-accent-2">{j.glyph}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-text">{j.title}</span>
                  <span className="block truncate text-xs text-text-soft">
                    {j.aligns}
                  </span>
                </span>
                <span className="ml-auto font-mono text-[0.65rem] text-text-soft">
                  {j.code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat */}
      <section className="flex h-[82vh] min-h-[640px] flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface/30">
        <header className="flex items-center justify-between border-b border-border-soft bg-surface/80 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <BrandMark size={30} />
            <div>
              <p className="text-sm font-semibold leading-none text-text">Master Agent</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-text-soft">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${busy ? "animate-blink bg-accent-2" : "bg-verdict"}`}
                />
                {busy ? "working…" : "ready"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-border-soft px-2.5 py-1 text-xs text-text-soft transition-colors hover:text-text"
          >
            Reset
          </button>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {showWelcome ? (
            <div className="flex min-h-full flex-col items-center justify-center text-center">
              <BrandMark size={52} />
              <h2 className="mt-4 font-display text-2xl font-semibold text-text">
                AI Legal Agents OS
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-text-soft">
                Your AI legal team. Pick a starter prompt, upload a document to
                review, or ask anything — I&apos;ll run the right skill and show
                my work.
              </p>
              <div className="mt-7 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
                {STARTERS.map((s) => (
                  <button
                    key={s.text}
                    type="button"
                    onClick={() => send(s.text)}
                    className="rounded-xl border border-border-soft bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent-2/60 card-ring"
                  >
                    <span className="text-xl text-accent-2">{s.glyph}</span>
                    <span className="mt-2 block text-sm font-medium leading-snug text-text">
                      {s.text}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-accent-2/60"
              >
                📎 Upload a document to review
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((m) => {
                if (m.role === "user" && m.attachment) {
                  return (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[78%] rounded-2xl rounded-br-sm border border-accent/30 bg-accent/10 px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-ivory">
                            📄
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-text">
                              {m.attachment.title}
                            </p>
                            <p className="truncate font-mono text-[0.7rem] text-text-soft">
                              {m.attachment.meta}
                            </p>
                          </div>
                        </div>
                        <p className="mt-1.5 text-xs text-text-soft">
                          Uploaded for review
                        </p>
                      </div>
                    </div>
                  );
                }
                if (m.role === "user") {
                  return (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-ivory">
                        {m.text}
                      </div>
                    </div>
                  );
                }
                if (m.run) {
                  return (
                    <div key={m.id} className="animate-fade">
                      <SkillRunCard
                        run={m.run}
                        speed={m.speed}
                        onComplete={handleRunComplete}
                      />
                    </div>
                  );
                }
                return (
                  <div key={m.id} className="flex gap-3">
                    <span className="mt-0.5 shrink-0">
                      <BrandMark size={30} />
                    </span>
                    <div className="max-w-[88%] whitespace-pre-line rounded-2xl rounded-tl-sm border border-border-soft bg-surface px-4 py-2.5 text-sm leading-relaxed text-text">
                      {m.text}
                    </div>
                  </div>
                );
              })}
              {thinking && <TypingBubble />}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border-soft bg-surface/70 px-5 py-3.5">
          {!showWelcome && (
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {STARTERS.map((s) => (
                <button
                  key={s.text}
                  type="button"
                  onClick={() => send(s.text)}
                  disabled={busy}
                  className="rounded-full border border-border-soft bg-bg/60 px-3 py-1 text-xs text-text-soft transition-colors enabled:hover:border-accent-2/50 enabled:hover:text-text disabled:opacity-50"
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              disabled={busy}
              aria-label="Upload a document"
              title="Upload a document"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-soft bg-surface text-base text-accent-2 transition-colors enabled:hover:border-accent-2/60 disabled:opacity-50"
            >
              📎
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
              placeholder="Ask the agent — e.g. “redline the SaaS agreement as the customer”"
              className="flex-1 rounded-full border-2 border-border-soft bg-surface px-4 py-3 text-base text-text placeholder:text-text-soft/70 outline-none transition-colors focus:border-accent-2 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-2 text-lg text-oxblood-dark transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-50"
              aria-label="Send"
            >
              ↑
            </button>
          </form>
        </div>
      </section>

      {pickerOpen && (
        <DocumentPicker
          docs={DOCUMENTS}
          onPick={reviewDoc}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
