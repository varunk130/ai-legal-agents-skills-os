export const PRODUCT = {
  name: "AI Legal Agents OS",
  mark: "⚖",
  tagline: "The agentic operating system for legal work.",
  subtitle:
    "One master AI agent that runs the whole legal workflow — intake, review, redline, negotiate, comply, research, diligence and tracking — not just a chat box.",
  disclaimer:
    "Demonstration only. Not legal advice. All contracts, parties, regulations, metrics and outputs are synthetic and generated for showcase purposes. Runs entirely on deterministic mocks — no real LLM or external API calls.",
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/agent", label: "Agent" },
  { href: "/evals", label: "Evals" },
] as const;

export const POSITIONING = {
  pillars: [
    {
      name: "Productivity at scale",
      who: "Review, research & repeatable workflows",
      body: "Draft, review, research and run repeatable workflow agents across large document sets.",
    },
    {
      name: "Compliant-by-design",
      who: "Regulation-as-code & oversight",
      body: "Regulations encoded as machine-checkable rules, applied proactively, with every finding cited and AI-to-AI oversight.",
    },
  ],
};

export const PROBLEM = {
  kicker: "The problem",
  title: "Legal is a bottleneck of high-stakes, manual, fragmented work.",
  body: "The constraint was never drafting a clause — it is the end-to-end workflow. A contract lands, and the work scatters across review, redlining, negotiation, compliance, research and post-signature tracking. Expertise is locked in a few senior lawyers, tooling is fragmented across seven systems, and generic chat assistants stop at advice instead of doing the work.",
  pains: [
    "Manual, one-document-at-a-time review",
    "Reactive compliance discovered after the fact",
    "Negotiation positions improvised without a playbook",
    "Obligations & renewals tracked in spreadsheets",
    "Research without defensible, cited sources",
    "No audit trail for how an answer was reached",
  ],
};

export const EXTENT = {
  kicker: "The extent",
  title: "It compounds across every contract, every team, every quarter.",
  source: {
    lead: "Directional estimates, informed by",
    label: "McKinsey — The economic potential of generative AI",
    href: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier",
  },
  stats: [
    { value: "60%", label: "of in-house legal time spent on contract review & triage" },
    { value: "9 days", label: "median turnaround for a routine vendor agreement" },
    { value: "7+", label: "disconnected tools spanning the contract lifecycle" },
    { value: "$20K+/mo", label: "tooling + specialist spend for a mid-size team" },
  ],
};

export const ROI = {
  kicker: "The ROI",
  title: "What teams gain by running legal as an agent.",
  source: {
    lead: "Directional estimates, informed by",
    label: "McKinsey — Legal innovation and generative AI",
    href: "https://www.mckinsey.com/featured-insights/in-the-balance/legal-innovation-and-generative-ai-lawyers-emerging-as-pilots-content-creators-and-legal-designers",
  },
  stats: [
    { value: "$2.4M", label: "Annual legal cost avoided", sub: "tooling, outside counsel & rework" },
    { value: "94%", label: "Faster turnaround", sub: "9 days → ~4 hours per agreement" },
    { value: "12,000 hrs", label: "Lawyer hours returned / year", sub: "freed from manual review & tracking" },
    { value: "$910K", label: "Penalties & auto-renewals prevented", sub: "obligations never missed" },
    { value: "18×", label: "Throughput per reviewer", sub: "contracts handled in parallel" },
    { value: "$318K", label: "Outside-counsel fees saved", sub: "first-pass work done in-house" },
  ],
  improves: [
    "Cycle time",
    "Missed obligations",
    "Consistent positions",
    "Proactive compliance",
    "Audit readiness",
  ],
};

export const IMPACT = {
  kicker: "The impact",
  title: "Slow, reactive legal work has a hard dollar cost.",
  items: [
    {
      title: "Stalled revenue",
      body: "Deals wait days in legal review while the business and the counterparty lose momentum.",
    },
    {
      title: "Unmanaged risk",
      body: "Inconsistent positions and missed clauses expose the company to uncapped liability.",
    },
    {
      title: "Penalties & auto-renewals",
      body: "Obligations and termination windows slip through the cracks after signing.",
    },
    {
      title: "Compliance exposure",
      body: "Regulatory checks happen too late — after the contract or content is already out.",
    },
  ],
};

export const SOLUTION = {
  kicker: "The solution",
  title: "A team of AI legal skills, orchestrated by one master agent.",
  body: "AI Legal Agents OS turns the scattered workflow into a single conversation. The master agent plans the matter, routes it to the right specialist skills, runs them to produce real artifacts — redlines, reports, memos, schedules — and a guardian verifies every output before it reaches you. Compliant-by-design meets productivity at scale.",
};

export const HOW_IT_WORKS = {
  kicker: "How it works",
  title: "From inbound matter to verified, execution-ready package.",
  steps: [
    {
      n: "01",
      title: "Bring the matter",
      body: "Drop in a contract, a request, or a question. The agent classifies it and sets priority and SLA.",
    },
    {
      n: "02",
      title: "The agent plans & routes",
      body: "The master agent decomposes the job and dispatches the right specialist skills — like an M365 Copilot agent running tools.",
    },
    {
      n: "03",
      title: "Skills execute",
      body: "Each skill runs deterministically and emits a real artifact: redline set, compliance report, research memo, obligation schedule.",
    },
    {
      n: "04",
      title: "Guardian verifies & ships",
      body: "An AI-to-AI guardian checks citations, consistency and safety, then assembles an audit-trailed package. Evals score it continuously.",
    },
  ],
};

export type JTBD = {
  id: string;
  code: string;
  title: string;
  jtbd: string;
  skill: string;
  glyph: string;
  prompt: string;
  aligns: string;
};

export const JTBDS: JTBD[] = [
  {
    id: "triage",
    code: "J1",
    title: "Intake & Triage",
    jtbd: "When a request comes in, classify, prioritize and route it so nothing slips and SLAs are met.",
    skill: "triage",
    glyph: "⟢",
    prompt: "A new vendor SaaS agreement just came in — triage it.",
    aligns: "Intake & routing",
  },
  {
    id: "review",
    code: "J2",
    title: "Contract Review",
    jtbd: "When a contract lands, surface the risks and required changes fast so I can respond in minutes.",
    skill: "review",
    glyph: "❖",
    prompt: "Review the SaaS agreement for risk and compliance issues.",
    aligns: "Risk analysis",
  },
  {
    id: "redline",
    code: "J3",
    title: "Redline",
    jtbd: "When I get a counterparty draft, mark it up to our standard with every edit justified.",
    skill: "redline",
    glyph: "✎",
    prompt: "Redline the SaaS agreement as the Customer.",
    aligns: "Playbook redlines",
  },
  {
    id: "negotiate",
    code: "J4",
    title: "Negotiate",
    jtbd: "When the counterparty pushes back, use approved fallback positions and never go below walk-away.",
    skill: "negotiate",
    glyph: "⇄",
    prompt: "The vendor rejected our liability cap — negotiate it.",
    aligns: "Playbook ladder",
  },
  {
    id: "comply",
    code: "J5",
    title: "Compliance-by-Design",
    jtbd: "When a regulation applies, tell me which clauses violate it and why — with citations.",
    skill: "comply",
    glyph: "§",
    prompt: "Check the SaaS agreement against GDPR / DPA rules.",
    aligns: "Regulation-as-code",
  },
  {
    id: "research",
    code: "J6",
    title: "Research → Memo",
    jtbd: "When I have a legal question, give me a citation-backed answer I can defend.",
    skill: "research",
    glyph: "📑",
    prompt: "Is an unbounded liability cap enforceable? Research it.",
    aligns: "Cited research",
  },
  {
    id: "diligence",
    code: "J7",
    title: "Data Room / Diligence",
    jtbd: "When we're in a deal, extract key terms and red flags across many contracts fast.",
    skill: "diligence",
    glyph: "▦",
    prompt: "Run diligence across the data room and flag risks.",
    aligns: "Bulk diligence",
  },
  {
    id: "track",
    code: "J8",
    title: "Obligations & Renewals",
    jtbd: "After signing, track every obligation, renewal and termination window so nothing is missed.",
    skill: "track",
    glyph: "◷",
    prompt: "Extract obligations and renewal dates from the signed contracts.",
    aligns: "Renewals & obligations",
  },
  {
    id: "guardian",
    code: "J9",
    title: "Guardian Oversight",
    jtbd: "For every output, verify citations, consistency and safety before I rely on it.",
    skill: "guardian",
    glyph: "✓",
    prompt: "Verify the last result for hallucinations and safety.",
    aligns: "AI-to-AI oversight",
  },
];

export const MISSION_PROMPT =
  "Run the full end-to-end mission on the inbound SaaS agreement.";

export const STARTERS = [
  { glyph: "⟢", text: "Triage the inbound SaaS agreement" },
  { glyph: "✎", text: "Redline the SaaS agreement as the customer" },
  { glyph: "▶", text: "Run the full end-to-end mission" },
];
