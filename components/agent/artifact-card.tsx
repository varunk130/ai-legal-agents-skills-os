import type { Artifact, CheckStatus, Citation, Severity } from "@/lib/types";

function sevColor(s: Severity) {
  return s === "critical"
    ? "text-breach border-breach/40 bg-breach/10"
    : s === "high"
      ? "text-claret border-claret/40 bg-claret/10"
      : s === "medium"
        ? "text-brass border-brass/40 bg-brass/10"
        : "text-text-soft border-border-soft bg-surface-2";
}

function statusColor(s: CheckStatus) {
  return s === "pass"
    ? "text-verdict border-verdict/40 bg-verdict/10"
    : s === "warn"
      ? "text-brass border-brass/40 bg-brass/10"
      : "text-breach border-breach/40 bg-breach/10";
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

function Shell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-border-soft bg-bg/60">
      <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2/60 px-4 py-2">
        <span className="text-accent-2">▤</span>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-soft">
          {label}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ExtLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`underline decoration-accent-2/40 underline-offset-2 transition-colors hover:text-accent-2 ${className}`}
    >
      {children}
    </a>
  );
}

function CitedText({
  text,
  citations,
  className = "",
}: {
  text: string;
  citations: Citation[];
  className?: string;
}) {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <p className={className}>
      {parts.map((p, i) => {
        const m = /^\[(\d+)\]$/.exec(p);
        if (m) {
          const c = citations.find((x) => x.id === Number(m[1]));
          if (c) {
            return (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                title={c.source}
                className="mx-0.5 inline-flex -translate-y-1 items-center rounded bg-accent-2/15 px-1 text-[0.6rem] font-bold text-accent-2 transition-colors hover:bg-accent-2/30"
              >
                {m[1]}
              </a>
            );
          }
        }
        return <span key={i}>{p}</span>;
      })}
    </p>
  );
}

function Summary({ text, citations }: { text: string; citations?: Citation[] }) {
  return (
    <div className="mt-3 rounded-lg border-l-2 border-accent-2 bg-surface/60 p-3">
      <p className="mb-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-text-soft">
        Executive summary
      </p>
      {citations && citations.length ? (
        <CitedText
          text={text}
          citations={citations}
          className="text-sm leading-relaxed text-text"
        />
      ) : (
        <p className="text-sm leading-relaxed text-text">{text}</p>
      )}
    </div>
  );
}

function StatBar({
  title,
  segments,
}: {
  title?: string;
  segments: { n: number; cls: string; label: string }[];
}) {
  const total = segments.reduce((a, s) => a + s.n, 0) || 1;
  return (
    <div className="rounded-lg border border-border-soft bg-surface/60 p-3">
      {title && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-soft">
          {title}
        </p>
      )}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
        {segments.map(
          (s) =>
            s.n > 0 && (
              <div
                key={s.label}
                className={s.cls}
                style={{ width: `${(s.n / total) * 100}%` }}
                title={`${s.label}: ${s.n}`}
              />
            ),
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.7rem] text-text-soft">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${s.cls}`} />
            {s.label} {s.n}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScoreTile({
  value,
  label,
  goodHigh,
}: {
  value: number;
  label: string;
  goodHigh?: boolean;
}) {
  const good = goodHigh ? value >= 70 : value < 35;
  const mid = goodHigh ? value >= 40 && value < 70 : value >= 35 && value < 60;
  const tone = good ? "text-verdict" : mid ? "text-brass" : "text-breach";
  const bar = good ? "bg-verdict" : mid ? "bg-brass" : "bg-breach";
  return (
    <div className="rounded-lg border border-border-soft bg-surface/60 p-3 text-center">
      <p className={`font-display text-4xl font-semibold ${tone}`}>
        {value}
        {goodHigh ? "%" : ""}
      </p>
      <p className="text-xs text-text-soft">{label}</p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Sources({ citations }: { citations: Citation[] }) {
  return (
    <div className="mt-4 rounded-lg border border-border-soft bg-surface/40 p-3">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-soft">
        Sources & authorities
      </p>
      <ol className="space-y-1.5">
        {citations.map((c) => (
          <li key={c.id} className="text-xs leading-relaxed">
            <span className="font-mono text-accent-2">[{c.id}]</span>{" "}
            <ExtLink href={c.href} className="font-medium text-text">
              {c.source}
            </ExtLink>
            <span className="text-text-soft"> — {c.note}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Recommended({ items }: { items: string[] }) {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
        Recommended actions
      </p>
      <ul className="mt-1.5 space-y-1">
        {items.map((r) => (
          <li key={r} className="flex gap-2 text-sm text-text">
            <span className="text-accent-2">→</span>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ArtifactCard({ artifact }: { artifact: Artifact }) {
  switch (artifact.type) {
    case "matter":
      return (
        <Shell label="Matter card">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-text">
              {artifact.matterId} · {artifact.docType}
            </p>
            <Badge className="border-breach/40 bg-breach/10 text-breach">
              {artifact.priority}
            </Badge>
          </div>
          <Summary text={artifact.summary} />
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <dt className="text-text-soft">Counterparty</dt>
              <dd className="text-text">{artifact.counterparty}</dd>
            </div>
            <div>
              <dt className="text-text-soft">Value</dt>
              <dd className="text-text">{artifact.value}</dd>
            </div>
            <div>
              <dt className="text-text-soft">SLA</dt>
              <dd className="text-text">{artifact.sla}</dd>
            </div>
            <div>
              <dt className="text-text-soft">First-pass risk</dt>
              <dd className="text-breach">{artifact.firstPassRisk}</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {artifact.route.map((r) => (
              <Badge key={r} className="border-accent-2/40 bg-accent-2/10 text-accent-2">
                {r}
              </Badge>
            ))}
          </div>
        </Shell>
      );

    case "review":
      return (
        <Shell label="Risk review">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-text">{artifact.document}</p>
            <Badge
              className={
                artifact.overallRisk === "High"
                  ? "border-breach/40 bg-breach/10 text-breach"
                  : artifact.overallRisk === "Medium"
                    ? "border-brass/40 bg-brass/10 text-brass"
                    : "border-verdict/40 bg-verdict/10 text-verdict"
              }
            >
              {artifact.overallRisk} risk
            </Badge>
          </div>

          <Summary text={artifact.summary} citations={artifact.citations} />

          <div className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr]">
            <ScoreTile value={artifact.riskScore} label="risk score / 100" />
            <StatBar
              title="Severity distribution"
              segments={[
                { n: artifact.distribution.critical, cls: "bg-breach", label: "Critical" },
                { n: artifact.distribution.high, cls: "bg-claret", label: "High" },
                { n: artifact.distribution.medium, cls: "bg-brass", label: "Medium" },
                { n: artifact.distribution.low, cls: "bg-verdict", label: "Low" },
              ]}
            />
          </div>

          {artifact.benchmark.length > 0 && (
            <div className="mt-3 overflow-x-auto rounded-lg border border-border-soft">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-[0.66rem] uppercase tracking-wide text-text-soft">
                    <th className="bg-surface-2/60 px-3 py-2">Clause</th>
                    <th className="bg-surface-2/60 px-3 py-2">Our position</th>
                    <th className="bg-surface-2/60 px-3 py-2">Market standard</th>
                    <th className="bg-surface-2/60 px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {artifact.benchmark.map((b) => (
                    <tr key={b.clause} className="align-top">
                      <td className="border-t border-border-soft px-3 py-2 font-medium text-text">
                        {b.clause}
                      </td>
                      <td className="border-t border-border-soft px-3 py-2 text-text-soft">
                        {b.ours}
                      </td>
                      <td className="border-t border-border-soft px-3 py-2 text-text-soft">
                        {b.market}
                      </td>
                      <td className="border-t border-border-soft px-3 py-2">
                        <Badge className={statusColor(b.status)}>{b.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-4 mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-soft">
            Clause-by-clause findings
          </p>
          <ul className="space-y-2">
            {artifact.clauses.map((c) => (
              <li
                key={c.name}
                className="rounded-lg border border-border-soft bg-surface/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-text">{c.name}</span>
                  <Badge className={sevColor(c.severity)}>{c.severity}</Badge>
                </div>
                <p className="mt-1 text-sm text-text-soft">{c.finding}</p>
              </li>
            ))}
          </ul>

          <Recommended items={artifact.recommended} />
          <Sources citations={artifact.citations} />
        </Shell>
      );

    case "redline":
      return (
        <Shell label={`Redline · ${artifact.perspective} perspective`}>
          <Summary text={artifact.summary} />
          <div className="mt-3">
            <StatBar
              title="Edits by severity"
              segments={[
                { n: artifact.distribution.critical, cls: "bg-breach", label: "Critical" },
                { n: artifact.distribution.high, cls: "bg-claret", label: "High" },
                { n: artifact.distribution.medium, cls: "bg-brass", label: "Medium" },
                { n: artifact.distribution.low, cls: "bg-verdict", label: "Low" },
              ]}
            />
          </div>
          <ul className="mt-3 space-y-3">
            {artifact.items.map((it) => (
              <li
                key={it.clause}
                className="rounded-lg border border-border-soft bg-surface/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-text">{it.clause}</span>
                  <span className="flex gap-1.5">
                    <Badge className={sevColor(it.severity)}>{it.severity}</Badge>
                    <Badge
                      className={
                        it.leverage === "likely"
                          ? "border-verdict/40 bg-verdict/10 text-verdict"
                          : "border-brass/40 bg-brass/10 text-brass"
                      }
                    >
                      {it.leverage}
                    </Badge>
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-breach line-through decoration-breach/50">
                  {it.original}
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-verdict underline decoration-verdict/40 underline-offset-2">
                  {it.replacement}
                </p>
                <p className="mt-2 text-xs italic text-text-soft">Why: {it.justification}</p>
                {it.ladder.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[0.68rem] uppercase tracking-wide text-text-soft">
                      Fallback ladder:
                    </span>
                    {it.ladder.map((l, i) => (
                      <Badge
                        key={l}
                        className="border-border-soft bg-surface-2 text-text-soft"
                      >
                        {i + 1}. {l}
                      </Badge>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          {artifact.citations && <Sources citations={artifact.citations} />}
        </Shell>
      );

    case "negotiation":
      return (
        <Shell label="Negotiation log">
          <Summary text={artifact.summary} citations={artifact.citations} />

          <div className="mt-3 rounded-lg border border-border-soft bg-surface/60 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-soft">
              Position ladder
            </p>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
              <Badge className="border-verdict/40 bg-verdict/10 text-verdict">
                Preferred: {artifact.preferred}
              </Badge>
              {artifact.fallbacks.map((f, i) => (
                <span key={f} className="flex items-center gap-1.5">
                  <span className="text-text-soft">→</span>
                  <Badge className="border-brass/40 bg-brass/10 text-brass">
                    Fallback {i + 1}: {f}
                  </Badge>
                </span>
              ))}
              <span className="text-text-soft">→</span>
              <Badge className="border-breach/40 bg-breach/10 text-breach">
                Walk-away: {artifact.walkAway}
              </Badge>
            </div>
          </div>

          <ol className="mt-3 space-y-3">
            {artifact.rounds.map((r) => (
              <li key={r.round} className="relative pl-6">
                <span className="absolute left-0 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[0.6rem] font-bold text-ivory">
                  {r.round}
                </span>
                <p className="text-sm text-text-soft">
                  <span className="font-semibold text-text">Counterparty:</span>{" "}
                  {r.counterparty}
                </p>
                <p className="mt-0.5 text-sm text-text">
                  <span className="font-semibold">Us:</span> {r.response}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-verdict">→ {r.movedTo}</span>
                  {r.withinPlaybook && (
                    <Badge className="border-verdict/40 bg-verdict/10 text-verdict">
                      within playbook
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded-lg border border-verdict/30 bg-verdict/5 px-3 py-2 text-sm text-text">
            {artifact.outcome}
          </p>
          {artifact.citations && <Sources citations={artifact.citations} />}
        </Shell>
      );

    case "compliance":
      return (
        <Shell label="Compliance report">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-text">{artifact.regulation}</p>
            <Badge
              className={
                artifact.score >= 70
                  ? "border-verdict/40 bg-verdict/10 text-verdict"
                  : artifact.score >= 40
                    ? "border-brass/40 bg-brass/10 text-brass"
                    : "border-breach/40 bg-breach/10 text-breach"
              }
            >
              {artifact.score}% compliant
            </Badge>
          </div>

          <Summary text={artifact.summary} citations={artifact.citations} />

          <div className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr]">
            <ScoreTile value={artifact.score} label="compliance score" goodHigh />
            <StatBar
              title="Checks"
              segments={[
                { n: artifact.distribution.pass, cls: "bg-verdict", label: "Pass" },
                { n: artifact.distribution.warn, cls: "bg-brass", label: "Warn" },
                { n: artifact.distribution.fail, cls: "bg-breach", label: "Fail" },
              ]}
            />
          </div>

          <ul className="mt-3 space-y-2">
            {artifact.checks.map((c) => (
              <li
                key={c.ref}
                className="rounded-lg border border-border-soft bg-surface/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  {c.href ? (
                    <ExtLink href={c.href} className="font-mono text-xs text-accent-2">
                      {c.ref}
                    </ExtLink>
                  ) : (
                    <span className="font-mono text-xs text-accent-2">{c.ref}</span>
                  )}
                  <Badge className={statusColor(c.status)}>{c.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-text">{c.rule}</p>
                <p className="mt-1 text-xs text-text-soft">{c.evidence}</p>
                {c.remedy && (
                  <p className="mt-1 text-xs text-verdict">Remedy: {c.remedy}</p>
                )}
              </li>
            ))}
          </ul>
          {artifact.citations && <Sources citations={artifact.citations} />}
        </Shell>
      );

    case "memo":
      return (
        <Shell label="Research memo">
          <Summary text={artifact.summary} />
          <p className="mt-3 text-sm font-semibold text-text">{artifact.question}</p>
          <p className="mt-2 text-sm leading-relaxed text-text-soft">{artifact.answer}</p>
          <div className="mt-3 space-y-2">
            {artifact.citations.map((c) => (
              <div
                key={c.source}
                className="rounded-lg border-l-2 border-accent-2 bg-surface/60 px-3 py-2"
              >
                {c.href ? (
                  <ExtLink href={c.href} className="text-xs font-semibold text-accent-2">
                    {c.source}
                  </ExtLink>
                ) : (
                  <p className="text-xs font-semibold text-accent-2">{c.source}</p>
                )}
                <p className="mt-0.5 text-sm text-text-soft">{c.holding}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-text-soft">Confidence</span>
            <Badge
              className={
                artifact.confidence === "High"
                  ? "border-verdict/40 bg-verdict/10 text-verdict"
                  : artifact.confidence === "Medium"
                    ? "border-brass/40 bg-brass/10 text-brass"
                    : "border-breach/40 bg-breach/10 text-breach"
              }
            >
              {artifact.confidence}
            </Badge>
            {artifact.caveat && (
              <span className="text-xs italic text-breach">{artifact.caveat}</span>
            )}
          </div>
        </Shell>
      );

    case "diligence":
      return (
        <Shell label="Diligence matrix">
          <Summary text={artifact.summary} citations={artifact.citations} />
          <div className="mt-3">
            <StatBar
              title="Portfolio flags"
              segments={[
                { n: artifact.distribution.red, cls: "bg-breach", label: "Red" },
                { n: artifact.distribution.amber, cls: "bg-brass", label: "Amber" },
                { n: artifact.distribution.green, cls: "bg-verdict", label: "Green" },
              ]}
            />
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-text-soft">
                  <th className="border-b border-border-soft py-2 pr-3">Contract</th>
                  {artifact.columns.map((c) => (
                    <th key={c} className="border-b border-border-soft px-3 py-2">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {artifact.rows.map((r) => (
                  <tr key={r.contract}>
                    <td className="border-b border-border-soft py-2 pr-3">
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            r.flag === "red"
                              ? "bg-breach"
                              : r.flag === "amber"
                                ? "bg-brass"
                                : "bg-verdict"
                          }`}
                        />
                        <span className="text-text">{r.contract}</span>
                      </span>
                    </td>
                    {r.cells.map((cell, i) => (
                      <td
                        key={i}
                        className="border-b border-border-soft px-3 py-2 text-text-soft"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-breach">
              Red flags
            </p>
            <ul className="mt-1.5 space-y-1">
              {artifact.redFlags.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-text">
                  <span className="text-breach">⚑</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {artifact.citations && <Sources citations={artifact.citations} />}
        </Shell>
      );

    case "schedule": {
      const soon = artifact.items.filter((i) => i.urgency === "soon").length;
      const normal = artifact.items.length - soon;
      return (
        <Shell label="Obligation schedule">
          <Summary text={artifact.summary} />
          <div className="mt-3">
            <StatBar
              title="Urgency"
              segments={[
                { n: soon, cls: "bg-breach", label: "Due soon" },
                { n: normal, cls: "bg-verdict", label: "Scheduled" },
              ]}
            />
          </div>
          <ul className="mt-3 space-y-2">
            {artifact.items.map((it) => (
              <li
                key={it.obligation}
                className="flex items-center justify-between gap-3 rounded-lg border border-border-soft bg-surface/60 p-3"
              >
                <div>
                  <p className="text-sm text-text">{it.obligation}</p>
                  <p className="text-xs text-text-soft">
                    {it.owner} · {it.type}
                  </p>
                </div>
                <Badge
                  className={
                    it.urgency === "soon"
                      ? "border-breach/40 bg-breach/10 text-breach"
                      : "border-border-soft bg-surface-2 text-text-soft"
                  }
                >
                  {it.due}
                </Badge>
              </li>
            ))}
          </ul>
        </Shell>
      );
    }

    case "guardian": {
      const pass = artifact.checks.filter((c) => c.status === "pass").length;
      const warn = artifact.checks.filter((c) => c.status === "warn").length;
      const fail = artifact.checks.filter((c) => c.status === "fail").length;
      return (
        <Shell label="Guardian verification">
          <div
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              artifact.verified
                ? "border border-verdict/30 bg-verdict/5 text-verdict"
                : "border border-breach/30 bg-breach/5 text-breach"
            }`}
          >
            {artifact.verified ? "✓ Verified" : "✕ Escalated"} — {artifact.subject}
          </div>
          <Summary text={artifact.summary} />
          <div className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr]">
            <ScoreTile value={artifact.score} label="assurance score" goodHigh />
            <StatBar
              title="Checks"
              segments={[
                { n: pass, cls: "bg-verdict", label: "Pass" },
                { n: warn, cls: "bg-brass", label: "Warn" },
                { n: fail, cls: "bg-breach", label: "Fail" },
              ]}
            />
          </div>
          <ul className="mt-3 space-y-1.5">
            {artifact.checks.map((c) => (
              <li key={c.name} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-text">{c.name}</span>
                <span className="flex items-center gap-2">
                  <span className="text-right text-xs text-text-soft">{c.note}</span>
                  <Badge className={statusColor(c.status)}>{c.status}</Badge>
                </span>
              </li>
            ))}
          </ul>
        </Shell>
      );
    }

    case "package":
      return (
        <Shell label="Execution-ready package">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-text">
              {artifact.matter}
            </p>
            {artifact.verified && (
              <Badge className="border-verdict/40 bg-verdict/10 text-verdict">
                ✓ verified
              </Badge>
            )}
          </div>
          <Summary text={artifact.summary} />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {artifact.produced.map((p) => (
              <Badge key={p.label} className="border-accent-2/40 bg-accent-2/10 text-accent-2">
                {p.label}
              </Badge>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-border-soft bg-surface/60 p-2">
              <p className="font-display text-2xl font-semibold text-text">
                {artifact.produced.length}
              </p>
              <p className="text-xs text-text-soft">artifacts</p>
            </div>
            <div className="rounded-lg border border-border-soft bg-surface/60 p-2">
              <p className="font-display text-2xl font-semibold text-text">
                {artifact.risksResolved}
              </p>
              <p className="text-xs text-text-soft">risks addressed</p>
            </div>
            <div className="rounded-lg border border-border-soft bg-surface/60 p-2">
              <p className="font-display text-2xl font-semibold text-text">
                {artifact.obligations}
              </p>
              <p className="text-xs text-text-soft">obligations tracked</p>
            </div>
          </div>
        </Shell>
      );
  }
}
