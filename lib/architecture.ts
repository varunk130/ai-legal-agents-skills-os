export const ARCH_INTRO = {
  kicker: "How it works",
  title: "The architecture behind the agent.",
  body: "AI Legal Agents OS is a planner-orchestrated agent that calls tools and data through MCP connectors, grounds its answers with retrieval, reasons with a frontier model, and verifies everything with a guardian before it ships. This page shows the real wiring — and what's mocked today versus wired next.",
  banner:
    "Architecture & roadmap. Today this demo runs entirely on deterministic mocks (synthetic data, no live calls). The connectors and model below show how it attaches to real systems in a later build.",
};

export type Layer = {
  id: string;
  name: string;
  desc: string;
  items: string[];
};

export const LAYERS: Layer[] = [
  {
    id: "channels",
    name: "Channels",
    desc: "Where a matter enters",
    items: ["Chat UI", "M365 Copilot agent", "Email & intake webhook"],
  },
  {
    id: "orchestration",
    name: "Orchestration",
    desc: "Plans the work and oversees it",
    items: ["Master Agent — planner & router", "Guardian — AI-to-AI oversight"],
  },
  {
    id: "skills",
    name: "Skills",
    desc: "The nine specialist jobs",
    items: [
      "Triage",
      "Review",
      "Redline",
      "Negotiate",
      "Comply",
      "Research",
      "Diligence",
      "Track",
      "Guardian",
    ],
  },
  {
    id: "tools",
    name: "Tooling via MCP",
    desc: "Connectors to tools & systems",
    items: [
      "MCP connectors",
      "Tool schemas",
      "Auth & scopes",
      "Audit logging",
    ],
  },
  {
    id: "retrieval",
    name: "Retrieval (RAG)",
    desc: "Grounds answers in real sources",
    items: ["Semantic + keyword search", "Rerank", "Citation grounding"],
  },
  {
    id: "data",
    name: "Knowledge & data sources",
    desc: "The corpora the agent reasons over",
    items: [
      "Case law & statutes",
      "Regulatory rule-packs",
      "Contract repository (CLM)",
      "Negotiation playbook",
      "Templates & DPAs",
    ],
  },
  {
    id: "model",
    name: "Model & reasoning",
    desc: "Frontier model with guardrails",
    items: ["Claude (Anthropic)", "Policy & safety guardrails", "Structured outputs"],
  },
  {
    id: "actions",
    name: "Actions & automation",
    desc: "Where results go to work",
    items: ["E-signature", "CLM write-back", "Ticketing", "Calendar & reminders"],
  },
];

export type Lifecycle = { n: string; title: string; body: string };

export const LIFECYCLE: Lifecycle[] = [
  { n: "1", title: "Request", body: "A contract, request or question arrives via chat, Copilot or intake." },
  { n: "2", title: "Plan", body: "The master agent decomposes the job into steps." },
  { n: "3", title: "Route", body: "It selects the right specialist skill for each step." },
  { n: "4", title: "Call tools (MCP)", body: "The skill invokes tools and systems through MCP connectors." },
  { n: "5", title: "Retrieve (RAG)", body: "Semantic + keyword search grounds the work in real sources, with citations." },
  { n: "6", title: "Reason", body: "The model drafts the artifact from the grounded context." },
  { n: "7", title: "Verify", body: "The guardian checks citations, consistency and safety." },
  { n: "8", title: "Deliver", body: "An artifact + audit trail is produced; actions fire downstream." },
];

export type Connector = {
  name: string;
  role: string;
  status: "Mocked today" | "Planned";
};

export const CONNECTORS: Connector[] = [
  { name: "Legal Research", role: "Search case law & statutes", status: "Planned" },
  { name: "Regulatory Rule-Packs", role: "GDPR / CCPA / DORA as code", status: "Mocked today" },
  { name: "Contract Repository (CLM)", role: "Read & write contract versions", status: "Planned" },
  { name: "Vector Store / RAG", role: "Embeddings + semantic search", status: "Planned" },
  { name: "Negotiation Playbook", role: "Clause positions & fallback ladders", status: "Mocked today" },
  { name: "Anthropic / Claude", role: "Reasoning & drafting", status: "Planned" },
  { name: "E-signature", role: "Send execution-ready docs", status: "Planned" },
  { name: "Calendar & Obligations", role: "Deadlines, renewals, reminders", status: "Planned" },
];

export const RETRIEVAL_PIPELINE = [
  { step: "Ingest", body: "Pull documents from the CLM, research and rule-pack sources." },
  { step: "Chunk", body: "Split into clause- and section-aware passages." },
  { step: "Embed", body: "Vectorise passages and store in the index." },
  { step: "Search", body: "Hybrid semantic + keyword query at run time." },
  { step: "Rerank", body: "Score and order the most relevant passages." },
  { step: "Ground", body: "Attach citations the guardian can verify." },
];

export type SkillWiring = {
  skill: string;
  tools: string;
  sources: string;
};

export const SKILL_WIRING: SkillWiring[] = [
  { skill: "Triage", tools: "Document classifier · Intake MCP", sources: "Inbound queue" },
  { skill: "Review", tools: "Clause segmenter · Risk models", sources: "Contract repository" },
  { skill: "Redline", tools: "Playbook MCP · Track-changes", sources: "Negotiation playbook" },
  { skill: "Negotiate", tools: "Fallback ladder · Counterparty sim", sources: "Playbook · prior deals" },
  { skill: "Comply", tools: "Rule-pack engine (MCP)", sources: "Regulatory rule-packs" },
  { skill: "Research", tools: "Vector search (RAG) · Reranker", sources: "Case law & statutes" },
  { skill: "Diligence", tools: "Batch parser · Term extractor", sources: "Data room / CLM" },
  { skill: "Track", tools: "Date extractor · Calendar MCP", sources: "Executed contracts" },
  { skill: "Guardian", tools: "Citation verifier · Policy checks", sources: "All artifacts + sources" },
];

export const NOW_NEXT = {
  now: [
    "Deterministic, synthetic data — no live calls",
    "Full planner → skill → artifact flow",
    "Mocked rule-packs and playbook",
    "Guardian + evals over real engine outputs",
  ],
  next: [
    "Wire real MCP connectors (CLM, research, vector store)",
    "Live retrieval / RAG with citations",
    "Model calls via Claude (Anthropic)",
    "Write-back: e-signature, CLM, calendar",
  ],
};
