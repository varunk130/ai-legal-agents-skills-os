import type {
  CheckStatus,
  ComplianceArtifact,
  DiligenceArtifact,
  GuardianArtifact,
  MatterArtifact,
  MemoArtifact,
  NegotiationArtifact,
  PackageArtifact,
  RedlineArtifact,
  RedlineItem,
  ReviewArtifact,
  Severity,
  ScheduleArtifact,
  SkillRun,
} from "@/lib/types";
import {
  CASE_LAW,
  DATA_ROOM,
  GDPR_RULEPACK,
  PLAYBOOK,
  SAAS_AGREEMENT,
  SIGNED_CONTRACTS,
} from "./data";
import type { LegalDoc } from "./documents";

const fullText = SAAS_AGREEMENT.excerpt.join(" ").toLowerCase();

const SEV_WEIGHT: Record<Severity, number> = {
  critical: 100,
  high: 75,
  medium: 45,
  low: 15,
};
const SEV_RANK: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
const MARKET_BY_SEV: Record<Severity, string> = {
  critical: "Mutual, capped, market-standard terms",
  high: "Bounded / mutual is the market norm",
  medium: "Tighten toward the market norm",
  low: "At market",
};

type Clause = { name: string; finding: string; severity: Severity };

function scoreOf(clauses: Clause[]): number {
  if (!clauses.length) return 0;
  return Math.round(
    clauses.reduce((a, c) => a + SEV_WEIGHT[c.severity], 0) / clauses.length,
  );
}
function distOf(clauses: Clause[]) {
  return {
    critical: clauses.filter((c) => c.severity === "critical").length,
    high: clauses.filter((c) => c.severity === "high").length,
    medium: clauses.filter((c) => c.severity === "medium").length,
    low: clauses.filter((c) => c.severity === "low").length,
  };
}
function benchmarkOf(clauses: Clause[]) {
  return [...clauses]
    .sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity])
    .slice(0, 4)
    .map((c) => ({
      clause: c.name,
      ours: c.finding,
      market: MARKET_BY_SEV[c.severity],
      status: (c.severity === "low"
        ? "pass"
        : c.severity === "medium"
          ? "warn"
          : "fail") as CheckStatus,
    }));
}

const REVIEW_CITATIONS = [
  {
    id: 1,
    source: "SEC EDGAR — counterparty filings & risk factors",
    href: "https://www.sec.gov/edgar/search/",
    note: "Cross-check the counterparty's public filings and disclosed risks before signing.",
  },
  {
    id: 2,
    source: "GDPR (Regulation (EU) 2016/679) — data-protection duties",
    href: "https://gdpr-info.eu/",
    note: "Governs any processing of EU personal data under the agreement.",
  },
  {
    id: 3,
    source: "U.C.C. §2-719 — limitation of remedies (Cornell LII)",
    href: "https://www.law.cornell.edu/ucc/2/2-719",
    note: "Limitations or exclusions of remedy are narrowly construed and may fail if unconscionable.",
  },
];

const C = {
  edgar: (id: number) => ({
    id,
    source: "SEC EDGAR — counterparty filings & risk factors",
    href: "https://www.sec.gov/edgar/search/",
    note: "Cross-check the counterparty's public filings before signing.",
  }),
  gdpr: (id: number) => ({
    id,
    source: "GDPR (Regulation (EU) 2016/679)",
    href: "https://gdpr-info.eu/",
    note: "Governs any processing of EU personal data.",
  }),
  art28: (id: number) => ({
    id,
    source: "GDPR Art. 28 — processor obligations & DPA",
    href: "https://gdpr-info.eu/art-28-gdpr/",
    note: "A written data-processing agreement is required.",
  }),
  scc: (id: number) => ({
    id,
    source: "EU Standard Contractual Clauses (Art. 46)",
    href: "https://gdpr-info.eu/art-46-gdpr/",
    note: "Approved cross-border transfer mechanism.",
  }),
  art33: (id: number) => ({
    id,
    source: "GDPR Art. 33 — breach notification",
    href: "https://gdpr-info.eu/art-33-gdpr/",
    note: "72-hour personal-data breach notification duty.",
  }),
  ucc: (id: number) => ({
    id,
    source: "U.C.C. §2-719 — limitation of remedies (Cornell LII)",
    href: "https://www.law.cornell.edu/ucc/2/2-719",
    note: "Limitations of remedy are narrowly construed.",
  }),
  indemn: (id: number) => ({
    id,
    source: "Indemnification — Cornell LII (Wex)",
    href: "https://www.law.cornell.edu/wex/indemnification",
    note: "Mutual, bounded indemnities are favoured.",
  }),
  ftc: (id: number) => ({
    id,
    source: "FTC — negative-option / auto-renewal guidance",
    href: "https://www.ftc.gov/business-guidance/resources/negative-option-marketing",
    note: "Auto-renewals require clear notice and reminders.",
  }),
};

export function runReviewDoc(doc: LegalDoc): SkillRun {
  const clip = (s: string) => (s.length > 46 ? s.slice(0, 44) + "…" : s);
  const clauses: Clause[] = doc.clauses.map((c) => ({
    name: `${c.ref} ${c.title}`,
    finding: c.finding,
    severity: c.severity,
  }));
  const crit = clauses.filter((c) => c.severity === "critical").length;
  const high = clauses.filter((c) => c.severity === "high").length;
  const score = scoreOf(clauses);
  const top = [...clauses].sort(
    (a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity],
  )[0];
  const hasData = clauses.some((c) =>
    /data|privacy|dpa|processing/i.test(`${c.name} ${c.finding}`),
  );
  const summary =
    `This review of ${doc.id} — ${doc.title} (${doc.pages} pp · ${doc.counterparty}) returns an overall risk of ${doc.overallRisk} (risk score ${score}/100), with ${crit} critical and ${high} high-severity issue(s). ` +
    `The most significant item is ${top.name}: ${top.finding} ` +
    `Before signing, verify ${doc.counterparty}'s public risk posture on SEC EDGAR [1]` +
    (hasData ? ", and confirm the data-processing terms against GDPR [2]" : "") +
    `, and note that limitation-of-liability and indemnity terms are narrowly construed and may be unconscionable [3].`;
  const artifact: ReviewArtifact = {
    type: "review",
    document: doc.title,
    overallRisk: doc.overallRisk,
    riskScore: score,
    summary,
    distribution: distOf(clauses),
    benchmark: benchmarkOf(clauses),
    clauses,
    recommended: doc.recommended,
    citations: REVIEW_CITATIONS,
  };
  const scans = [...clauses]
    .sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity])
    .slice(0, 4)
    .map((c) => ({
      kind: "tool" as const,
      label: `risk_agent.scan(${c.name.split(" ")[0]})`,
      detail: `→ ${c.severity.toUpperCase()} · ${clip(c.finding)}`,
    }));
  return {
    skill: "review",
    title: `Review "${doc.title}"`,
    plan: [
      "Connect to the contract repository and rule-packs via MCP",
      `Ingest and segment the uploaded ${doc.docType.toLowerCase()}`,
      "Scan each clause for risk and compliance",
      "Rate overall risk and recommend the changes that matter",
    ],
    console: [
      { kind: "tool", label: "connect(Contract Repository · MCP)", detail: "→ authenticated" },
      { kind: "tool", label: "connect(Regulatory Rule-Packs · MCP)", detail: "→ 5 packs loaded" },
      { kind: "io", label: "upload_document()", detail: `→ ${doc.id} · ${doc.pages} pages` },
      { kind: "tool", label: "segment_clauses()", detail: `→ ${doc.clauses.length} clauses` },
      ...scans,
      { kind: "io", label: "aggregate_severity()", detail: `→ ${crit} critical · ${high} high` },
      { kind: "done", label: "rate_overall()", detail: `→ ${doc.overallRisk.toUpperCase()}` },
    ],
    artifact,
    closing: `Reviewed ${doc.id} — ${doc.title}. Overall risk is ${doc.overallRisk}${crit ? `, with ${crit} critical issue(s)` : high ? `, with ${high} high issue(s)` : ""}. Top recommendation: ${doc.recommended[0].toLowerCase()}.`,
  };
}

export function runTriage(): SkillRun {
  const artifact: MatterArtifact = {
    type: "matter",
    matterId: SAAS_AGREEMENT.id,
    docType: "Master SaaS Subscription Agreement",
    counterparty: SAAS_AGREEMENT.counterparty,
    value: SAAS_AGREEMENT.value,
    priority: "P1",
    sla: "First response in 4 business hours",
    route: ["Contract Review", "Compliance-by-Design", "Redline & Negotiate"],
    firstPassRisk: "High — unlimited customer liability detected on intake.",
    summary: `Intake classified ${SAAS_AGREEMENT.id} as a Master SaaS Subscription Agreement from ${SAAS_AGREEMENT.counterparty} (${SAAS_AGREEMENT.value}). It scored P1 on contract value plus an unlimited-liability signal, and was routed to Review, Compliance and Redline under a 4-hour SLA.`,
  };
  return {
    skill: "triage",
    title: "Intake & triage the matter",
    plan: [
      "Open and classify the inbound document",
      "Extract parties, commercials and risk signals",
      "Score priority and assign an SLA",
      "Route to the right specialist skills",
    ],
    console: [
      { kind: "io", label: "read_document()", detail: "→ 14 pages · 22 clauses parsed" },
      { kind: "tool", label: "classify_document()", detail: "→ SaaS Subscription Agreement (98%)" },
      { kind: "io", label: "extract_parties()", detail: `→ ${SAAS_AGREEMENT.counterparty}` },
      { kind: "io", label: "extract_commercials()", detail: `→ ${SAAS_AGREEMENT.value} · 12-month term` },
      { kind: "tool", label: "scan_risk_signals()", detail: "→ 'unlimited', 'sole discretion', 'in perpetuity'" },
      { kind: "tool", label: "score_priority()", detail: "→ value + risk flag = P1" },
      { kind: "tool", label: "assign_sla()", detail: "→ 4 business hours" },
      { kind: "done", label: "route_matter()", detail: "→ Review · Compliance · Redline" },
    ],
    artifact,
    closing:
      "Logged as a P1 matter and routed. I flagged unlimited customer liability on first pass — recommend we review and redline before anything is signed.",
  };
}

export function runReview(): SkillRun {
  const clauses: ReviewArtifact["clauses"] = [
    { name: "8.1 Limitation of Liability", finding: "Customer liability is unlimited; Provider liability is not capped either.", severity: "critical" },
    { name: "9.2 Indemnification", finding: "One-way, uncapped indemnity 'in perpetuity' against the Customer.", severity: "high" },
    { name: "5.4 Data Protection", finding: "Processing in any jurisdiction at sole discretion; sub-processors without notice.", severity: "critical" },
    { name: "12.1 Term & Renewal", finding: "Silent 12-month auto-renewal with a 90-day notice window.", severity: "medium" },
    { name: "7.3 Intellectual Property", finding: "Provider claims ownership of feedback and derived data in perpetuity.", severity: "high" },
    { name: "14.6 Governing Law", finding: "Provider's home jurisdiction with a waiver of venue objections.", severity: "low" },
  ];
  const score = scoreOf(clauses);
  const summary =
    `This review of the ${SAAS_AGREEMENT.title} (${SAAS_AGREEMENT.id}) returns an overall risk of High (risk score ${score}/100), driven by two critical exposures — unlimited customer liability (8.1) and the absence of any data-protection addendum (5.4). ` +
    `Before counter-signing, cross-check ${SAAS_AGREEMENT.counterparty}'s disclosed risk posture on SEC EDGAR [1], confirm the data terms against GDPR [2], and note that an uncapped limitation-of-liability regime of this kind is narrowly construed and may be unconscionable [3]. ` +
    `Five of six material clauses sit below market and should be redlined first.`;
  const artifact: ReviewArtifact = {
    type: "review",
    document: SAAS_AGREEMENT.title,
    overallRisk: "High",
    riskScore: score,
    summary,
    distribution: distOf(clauses),
    benchmark: [
      { clause: "8.1 Limitation of Liability", ours: "Unlimited customer liability; provider uncapped", market: "Mutual cap at 12 months' fees", status: "fail" },
      { clause: "9.2 Indemnification", ours: "One-way, uncapped, in perpetuity", market: "Mutual, capped, scoped to IP/confidentiality", status: "fail" },
      { clause: "5.4 Data Protection", ours: "No DPA; any jurisdiction; no notice", market: "GDPR DPA + SCCs + sub-processor notice", status: "fail" },
      { clause: "12.1 Term & Renewal", ours: "Auto-renew; 90-day notice; no reminder", market: "30-day notice + renewal reminder", status: "warn" },
    ],
    clauses,
    recommended: [
      "Cap mutual liability and remove the unlimited customer exposure",
      "Make indemnity mutual and bounded",
      "Attach a GDPR-aligned DPA before signature",
      "Shorten the auto-renewal notice and add a reminder",
    ],
    citations: REVIEW_CITATIONS,
  };
  return {
    skill: "review",
    title: "Review the agreement for risk",
    plan: [
      "Segment the contract into clauses",
      "Run specialist agents (risk, compliance, IP) over each clause",
      "Score severity per clause and aggregate",
      "Recommend the changes that matter",
    ],
    console: [
      { kind: "tool", label: "segment_clauses()", detail: "→ 22 clauses across 14 sections" },
      { kind: "tool", label: "load_models()", detail: "→ liability · indemnity · IP · data · term" },
      { kind: "tool", label: "risk_agent.scan(8.1)", detail: "→ CRITICAL · unlimited liability" },
      { kind: "tool", label: "risk_agent.scan(9.2)", detail: "→ HIGH · perpetual one-way indemnity" },
      { kind: "tool", label: "compliance_agent.scan(5.4)", detail: "→ CRITICAL · DPA missing" },
      { kind: "tool", label: "ip_agent.scan(7.3)", detail: "→ HIGH · derived-data ownership" },
      { kind: "io", label: "aggregate_severity()", detail: "→ 2 critical · 2 high · 1 med · 1 low" },
      { kind: "done", label: "rate_overall()", detail: "→ HIGH" },
    ],
    artifact,
    closing:
      "Overall risk is High. Two critical issues — unlimited liability and missing data-protection terms — should block signature until redlined.",
  };
}

export function runRedline(
  perspective: "Customer" | "Vendor" = "Customer",
): SkillRun {
  const keys = [
    "limitation_of_liability",
    "indemnification",
    "data_protection",
    "term_renewal",
    "ip_feedback",
    "governing_law",
  ];
  const items: RedlineItem[] = keys.map((k) => {
    const e = PLAYBOOK[k];
    return {
      clause: e.clause,
      original:
        SAAS_AGREEMENT.excerpt.find((x) =>
          e.detect.some((d) => x.toLowerCase().includes(d)),
        ) ?? `${e.clause} clause`,
      replacement: e.customer.preferred.text,
      justification: e.customer.preferred.why,
      severity: e.severity,
      leverage: e.severity === "critical" ? "contested" : "likely",
      ladder: e.customer.ladder.map((l) => l.text),
    };
  });
  const artifact: RedlineArtifact = {
    type: "redline",
    perspective,
    document: SAAS_AGREEMENT.title,
    items,
    summary: `${items.length} tracked changes drafted from the ${perspective} playbook, each with a fallback ladder ready for negotiation.`,
    distribution: {
      critical: items.filter((i) => i.severity === "critical").length,
      high: items.filter((i) => i.severity === "high").length,
      medium: items.filter((i) => i.severity === "medium").length,
      low: items.filter((i) => i.severity === "low").length,
    },
    citations: [C.ucc(1), C.indemn(2)],
  };
  return {
    skill: "redline",
    title: `Redline as the ${perspective}`,
    plan: [
      `Load the ${perspective} negotiation playbook`,
      "Compare each clause to our preferred position",
      "Draft a tracked change with a justification",
      "Attach a fallback ladder to every edit",
    ],
    console: [
      { kind: "tool", label: "load_playbook()", detail: `→ ${perspective} · 6 clause positions` },
      { kind: "tool", label: "detect_clauses()", detail: "→ matched 6/6" },
      { kind: "tool", label: "evaluate_position(8.1)", detail: "→ off-market vs preferred cap" },
      { kind: "io", label: "draft_edit(8.1)", detail: "→ cap @ 12 mo fees (+2 fallbacks)" },
      { kind: "io", label: "draft_edit(9.2)", detail: "→ mutual, capped indemnity" },
      { kind: "io", label: "draft_edit(5.4)", detail: "→ attach GDPR DPA + transfer terms" },
      { kind: "tool", label: "attach_ladders()", detail: "→ 2 rungs on each critical clause" },
      { kind: "done", label: "render_track_changes()", detail: `→ ${items.length} redlines ready to send` },
    ],
    artifact,
    closing:
      "Redline drafted. Every edit carries a justification and a fallback position, so we can negotiate without giving away terms. Want me to run the negotiation?",
  };
}

export function runNegotiate(): SkillRun {
  const e = PLAYBOOK.limitation_of_liability;
  const artifact: NegotiationArtifact = {
    type: "negotiation",
    clause: e.clause,
    perspective: "Customer",
    walkAway: e.customer.walkAway,
    rounds: [
      {
        round: 1,
        counterparty: "Vendor rejects the 12-month cap; proposes uncapped liability.",
        response: "Hold preferred position: mutual cap at 12 months' fees.",
        movedTo: e.customer.preferred.text,
        withinPlaybook: true,
      },
      {
        round: 2,
        counterparty: "Vendor counters: cap acceptable only at a higher multiple.",
        response: "Drop to first rung of the fallback ladder.",
        movedTo: e.customer.ladder[0].text,
        withinPlaybook: true,
      },
    ],
    outcome:
      "Settled at 24 months' fees — within the playbook and safely above the walk-away line. Concession logged for audit.",
    preferred: e.customer.preferred.text,
    fallbacks: e.customer.ladder.map((l) => l.text),
    summary: `Negotiated the ${e.clause} from our preferred 12-month cap. After two rounds of vendor pushback the agent descended one rung of the playbook ladder and settled at 24 months' fees — within policy and clear of the walk-away line [1].`,
    citations: [C.ucc(1), C.indemn(2)],
  };
  return {
    skill: "negotiate",
    title: "Negotiate the liability cap",
    plan: [
      "Load the position: preferred, ladder and walk-away",
      "Open with the preferred position",
      "Test every counter against the walk-away line",
      "Descend the ladder only as needed; log concessions",
    ],
    console: [
      { kind: "tool", label: "load_position(LoL)", detail: "→ preferred 12 mo · walk-away: uncapped" },
      { kind: "io", label: "open_offer()", detail: "→ propose mutual 12-month cap" },
      { kind: "tool", label: "counterparty.respond(r1)", detail: "→ rejects · proposes uncapped" },
      { kind: "tool", label: "check_walk_away(r1)", detail: "→ crosses line · reject" },
      { kind: "io", label: "hold_position()", detail: "→ reiterate 12 mo + rationale" },
      { kind: "tool", label: "counterparty.respond(r2)", detail: "→ counters higher multiple" },
      { kind: "tool", label: "select_fallback(rung_1)", detail: "→ 24 mo fees · within playbook" },
      { kind: "io", label: "log_concession()", detail: "→ audit trail updated" },
      { kind: "done", label: "finalize()", detail: "→ settled at 24 mo · safe" },
    ],
    artifact,
    closing:
      "Closed at 24 months' fees — a logged concession that stayed inside the playbook and never approached the walk-away line.",
  };
}

export function runComply(): SkillRun {
  const checks = GDPR_RULEPACK.rules.map((r) => {
    const status = r.test(fullText);
    return {
      rule: r.rule,
      ref: r.ref,
      href: r.href,
      status,
      evidence: status === "pass" ? r.evidencePass : r.evidenceFail,
      remedy: status === "pass" ? undefined : r.remedy,
    };
  });
  const score = Math.round(
    (checks.reduce(
      (a, c) => a + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0),
      0,
    ) /
      checks.length) *
      100,
  );
  const artifact: ComplianceArtifact = {
    type: "compliance",
    regulation: GDPR_RULEPACK.name,
    score,
    summary: `Checked the contract against ${GDPR_RULEPACK.name} as a machine-readable rule-pack. ${checks.filter((c) => c.status === "fail").length} of ${checks.length} obligations fail — no DPA [1], unrestricted cross-border transfers [2] and no 72-hour breach window [3] — for a ${score}% compliance score. Every finding cites its article with a remedy.`,
    distribution: {
      pass: checks.filter((c) => c.status === "pass").length,
      warn: checks.filter((c) => c.status === "warn").length,
      fail: checks.filter((c) => c.status === "fail").length,
    },
    checks,
    citations: [C.art28(1), C.scc(2), C.art33(3)],
  };
  const fails = checks.filter((c) => c.status === "fail").length;
  return {
    skill: "comply",
    title: "Compliance-by-design check",
    plan: [
      "Load the regulation as a machine-checkable rule-pack",
      "Normalise the contract text for evaluation",
      "Evaluate every rule and cite the article",
      "Score compliance and propose remedies",
    ],
    console: [
      { kind: "tool", label: "load_rulepack()", detail: `→ ${GDPR_RULEPACK.name} · 5 rules` },
      { kind: "io", label: "normalize_text()", detail: "→ 6 clauses tokenised" },
      { kind: "tool", label: "eval(Art.28(3))", detail: "→ FAIL · no DPA present" },
      { kind: "tool", label: "eval(Art.28(2))", detail: "→ FAIL · sub-processors without notice" },
      { kind: "tool", label: "eval(Ch.V)", detail: "→ FAIL · transfers to 'any jurisdiction'" },
      { kind: "tool", label: "eval(Art.33)", detail: "→ FAIL · no 72-hour breach window" },
      { kind: "tool", label: "eval(Art.5)", detail: "→ WARN · derived-data overreach" },
      { kind: "io", label: "cite_articles()", detail: "→ 5 citations + remedies attached" },
      { kind: "done", label: "score()", detail: `→ ${score}% compliant` },
    ],
    artifact,
    closing: `Compliance score ${score}%. ${fails} rules fail — most importantly there is no DPA and transfers are unrestricted. Each finding cites its GDPR article and a remedy.`,
  };
}

export function runResearch(question: string): SkillRun {
  const q = question.toLowerCase();
  const scored = CASE_LAW.map((c) => ({
    c,
    score: c.tags.filter((t) => q.includes(t)).length,
  }));
  scored.sort((a, b) => b.score - a.score);
  const hits = scored.filter((s) => s.score > 0).map((s) => s.c);
  const top = (hits.length ? hits : [CASE_LAW[0]]).slice(0, 2);
  const grounded = hits.length > 0;
  const artifact: MemoArtifact = {
    type: "memo",
    question: question.trim() || "Is an unlimited liability clause enforceable?",
    summary: grounded
      ? "A cited, defensible answer grounded in the knowledge base — apply it to the liability and indemnity rationale."
      : "No on-point authority was found — treated as low-confidence and routed for human review.",
    answer: grounded
      ? "A total bar on one party's recovery (or a one-sided uncapped, perpetual obligation) risks being struck as unconscionable or as an unreasonable penalty. Mutual, bounded terms are strongly preferred and far more defensible."
      : "No directly on-point authority was found in the knowledge base; treat the answer as low-confidence and seek primary sources before relying on it.",
    citations: top.map((c) => ({ source: c.source, holding: c.holding, href: c.href })),
    confidence: grounded ? (top.length > 1 ? "High" : "Medium") : "Low",
    caveat: grounded
      ? undefined
      : "Low groundedness — flagged by the guardian for human review.",
  };
  return {
    skill: "research",
    title: "Research → cited memo",
    plan: [
      "Parse the legal issue from the question",
      "Search and rank the knowledge base",
      "Extract holdings and draft a memo",
      "Attach citations and rate confidence",
    ],
    console: [
      { kind: "tool", label: "parse_question()", detail: "→ issue framed" },
      { kind: "io", label: "expand_query()", detail: "→ synonyms + related doctrines" },
      { kind: "tool", label: "search_kb()", detail: `→ scanned ${CASE_LAW.length} sources` },
      { kind: "tool", label: "rank_sources()", detail: `→ ${hits.length} on-point` },
      { kind: "io", label: "extract_holdings()", detail: `→ ${top.length} holding(s)` },
      { kind: "io", label: "draft_memo()", detail: "→ answer + reasoning" },
      { kind: "tool", label: "attach_citations()", detail: `→ ${top.length} cite(s)` },
      { kind: "done", label: "rate_confidence()", detail: `→ ${artifact.confidence}` },
    ],
    artifact,
    closing: grounded
      ? "Memo drafted with citations. Confidence is grounded in the cited authorities."
      : "I couldn't ground this in the knowledge base, so I've marked it low-confidence for human review.",
  };
}

export function runDiligence(): SkillRun {
  const red = DATA_ROOM.rows.filter((r) => r.flag === "red").length;
  const amber = DATA_ROOM.rows.filter((r) => r.flag === "amber").length;
  const green = DATA_ROOM.rows.filter((r) => r.flag === "green").length;
  const artifact: DiligenceArtifact = {
    type: "diligence",
    dataRoom: DATA_ROOM.name,
    columns: DATA_ROOM.columns,
    rows: DATA_ROOM.rows,
    redFlags: DATA_ROOM.redFlags,
    summary: `Compared ${DATA_ROOM.rows.length} contracts across ${DATA_ROOM.columns.length} key terms — ${red} red, ${amber} amber, ${green} green. The blocker is CloudBridge's unlimited liability and missing DPA; two contracts also allow free assignment without consent. Verify counterparties on SEC EDGAR [1].`,
    distribution: { red, amber, green },
    citations: [C.edgar(1), C.ucc(2), C.gdpr(3)],
  };
  const reds = DATA_ROOM.rows.filter((r) => r.flag === "red").length;
  return {
    skill: "diligence",
    title: "Run data-room diligence",
    plan: [
      "Enumerate and parse every contract in the room",
      "Extract the key terms that drive deal risk",
      "Build a side-by-side comparison matrix",
      "Flag outliers and surface red flags",
    ],
    console: [
      { kind: "tool", label: "enumerate_dataroom()", detail: `→ ${DATA_ROOM.rows.length} contracts` },
      { kind: "io", label: "parse_documents()", detail: `→ ${DATA_ROOM.rows.length}/${DATA_ROOM.rows.length} parsed` },
      { kind: "tool", label: "extract(liability_cap)", detail: "→ 1 unlimited outlier" },
      { kind: "tool", label: "extract(assignment)", detail: "→ 2 free-assignment risks" },
      { kind: "tool", label: "extract(change_of_control)", detail: "→ 2 silent" },
      { kind: "io", label: "build_matrix()", detail: `→ ${DATA_ROOM.rows.length} × ${DATA_ROOM.columns.length}` },
      { kind: "tool", label: "detect_outliers()", detail: `→ ${reds} red · 2 amber` },
      { kind: "done", label: "summarize_red_flags()", detail: `→ ${DATA_ROOM.redFlags.length} flags` },
    ],
    artifact,
    closing: `Diligence matrix built across ${DATA_ROOM.rows.length} contracts. ${reds} red flag(s) — CloudBridge's unlimited liability and missing DPA are the blockers.`,
  };
}

export function runTrack(): SkillRun {
  const soonCount = SIGNED_CONTRACTS.items.filter(
    (i) => i.urgency === "soon",
  ).length;
  const artifact: ScheduleArtifact = {
    type: "schedule",
    source: SIGNED_CONTRACTS.name,
    summary: `Extracted ${SIGNED_CONTRACTS.items.length} dated obligations from the executed contracts; ${soonCount} need attention soon — most urgently the CloudBridge auto-renewal window. Add each to the legal calendar with a named owner.`,
    items: SIGNED_CONTRACTS.items,
  };
  const soon = SIGNED_CONTRACTS.items.filter((i) => i.urgency === "soon").length;
  return {
    skill: "track",
    title: "Extract obligations & renewals",
    plan: [
      "Load every executed contract",
      "Extract dated obligations and classify them",
      "Assign owners and compute urgency",
      "Build the obligations calendar",
    ],
    console: [
      { kind: "tool", label: "load_executed()", detail: "→ 5 signed contracts" },
      { kind: "io", label: "extract_dates()", detail: "→ 11 dated obligations found" },
      { kind: "tool", label: "classify_type()", detail: "→ renewal · payment · report · termination" },
      { kind: "tool", label: "filter_active()", detail: `→ ${SIGNED_CONTRACTS.items.length} upcoming` },
      { kind: "io", label: "assign_owners()", detail: "→ Legal Ops · Finance · Procurement" },
      { kind: "tool", label: "compute_urgency()", detail: `→ ${soon} due soon` },
      { kind: "done", label: "build_calendar()", detail: "→ schedule ready" },
    ],
    artifact,
    closing: `Tracked ${SIGNED_CONTRACTS.items.length} obligations. ${soon} need attention soon — including the CloudBridge auto-renewal window in 18 days.`,
  };
}

export function runGuardian(subject = "the last result"): SkillRun {
  const checks: GuardianArtifact["checks"] = [
    { name: "Citation groundedness", status: "pass", note: "All cited sources exist in the knowledge base." },
    { name: "Defined-term integrity", status: "pass", note: "No defined terms were broken by the redlines." },
    { name: "Risk regression", status: "pass", note: "Edits reduce risk; none introduce new exposure." },
    { name: "Negotiation safety", status: "pass", note: "No position crossed the walk-away line." },
    { name: "Purpose limitation", status: "warn", note: "Derived-data clause still needs a human sign-off." },
  ];
  const passes = checks.filter((c) => c.status === "pass").length;
  const warns = checks.filter((c) => c.status === "warn").length;
  const score = Math.round(((passes + warns * 0.5) / checks.length) * 100);
  const artifact: GuardianArtifact = {
    type: "guardian",
    subject,
    verified: true,
    score,
    summary: `Verified ${subject}: ${passes}/${checks.length} checks pass with ${warns} caution(s) for a ${score}% assurance score. No hallucinated citations and the negotiation stayed within policy; the derived-data clause is routed for a human sign-off.`,
    checks,
  };
  return {
    skill: "guardian",
    title: "Guardian verification",
    plan: [
      "Collect every artifact produced so far",
      "Re-check citations, defined terms and risk",
      "Confirm negotiation stayed safe",
      "Approve, or escalate anything uncertain",
    ],
    console: [
      { kind: "tool", label: "collect_outputs()", detail: "→ artifacts gathered" },
      { kind: "tool", label: "verify_citations()", detail: "→ 0 hallucinations" },
      { kind: "tool", label: "check_defined_terms()", detail: "→ intact" },
      { kind: "tool", label: "check_risk_regression()", detail: "→ no new exposure" },
      { kind: "tool", label: "check_negotiation_safety()", detail: "→ within playbook" },
      { kind: "tool", label: "check_purpose_limitation()", detail: "→ WARN · human sign-off" },
      { kind: "done", label: "verdict()", detail: "→ VERIFIED (1 note)" },
    ],
    artifact,
    closing:
      "Verified. Citations are clean and the negotiation stayed safe. One item — the derived-data clause — is flagged for a quick human sign-off.",
  };
}

export function runMission(): SkillRun[] {
  const triage = runTriage();
  const review = runReview();
  const redline = runRedline("Customer");
  const comply = runComply();
  const negotiate = runNegotiate();

  const pkg: PackageArtifact = {
    type: "package",
    matter: `${SAAS_AGREEMENT.id} · ${SAAS_AGREEMENT.counterparty}`,
    summary: `Assembled an execution-ready package for ${SAAS_AGREEMENT.id}: five guardian-verified artifacts — triage, risk review, redline, compliance and negotiation — addressing five risks, with obligations queued and a full audit trail.`,
    produced: [
      { label: "Triage card", skill: "triage" },
      { label: "Risk review", skill: "review" },
      { label: "Redline set", skill: "redline" },
      { label: "Compliance report", skill: "comply" },
      { label: "Negotiation log", skill: "negotiate" },
    ],
    obligations: SIGNED_CONTRACTS.items.length,
    risksResolved: 5,
    verified: true,
  };
  const packageRun: SkillRun = {
    skill: "guardian",
    title: "Verify & assemble the package",
    plan: [
      "Run the guardian over every produced artifact",
      "Resolve outstanding risks against the redlines",
      "Assemble an audit-trailed, execution-ready package",
    ],
    console: [
      { kind: "tool", label: "guardian.verify_all()", detail: "→ 5 artifacts checked" },
      { kind: "tool", label: "reconcile_risks()", detail: "→ 5/5 addressed" },
      { kind: "io", label: "assemble_package()", detail: "→ bundling + audit trail" },
      { kind: "done", label: "ship()", detail: "→ ready for signature" },
    ],
    artifact: pkg,
    closing:
      "End-to-end mission complete. Five artifacts produced and verified into one execution-ready package — triage, review, redline, compliance and negotiation, with a full audit trail.",
  };

  return [triage, review, redline, comply, negotiate, packageRun];
}
