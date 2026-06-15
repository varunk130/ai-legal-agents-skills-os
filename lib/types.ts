export type SkillId =
  | "triage"
  | "review"
  | "redline"
  | "negotiate"
  | "comply"
  | "research"
  | "diligence"
  | "track"
  | "guardian";

export type Severity = "critical" | "high" | "medium" | "low";
export type CheckStatus = "pass" | "warn" | "fail";

export type ConsoleStep = {
  label: string;
  detail?: string;
  kind?: "plan" | "tool" | "io" | "done";
};

export type MatterArtifact = {
  type: "matter";
  matterId: string;
  docType: string;
  counterparty: string;
  value: string;
  priority: "P1" | "P2" | "P3";
  sla: string;
  route: string[];
  firstPassRisk: string;
  summary: string;
};

export type Citation = {
  id: number;
  source: string;
  href: string;
  note: string;
};

export type ReviewArtifact = {
  type: "review";
  document: string;
  overallRisk: "High" | "Medium" | "Low";
  riskScore: number;
  summary: string;
  distribution: { critical: number; high: number; medium: number; low: number };
  benchmark: { clause: string; ours: string; market: string; status: CheckStatus }[];
  clauses: { name: string; finding: string; severity: Severity }[];
  recommended: string[];
  citations: Citation[];
};

export type RedlineItem = {
  clause: string;
  original: string;
  replacement: string;
  justification: string;
  severity: Severity;
  leverage: "likely" | "contested";
  ladder: string[];
};

export type RedlineArtifact = {
  type: "redline";
  perspective: "Customer" | "Vendor";
  document: string;
  items: RedlineItem[];
  summary: string;
  distribution: { critical: number; high: number; medium: number; low: number };
  citations?: Citation[];
};

export type NegotiationArtifact = {
  type: "negotiation";
  clause: string;
  perspective: string;
  walkAway: string;
  preferred: string;
  fallbacks: string[];
  rounds: {
    round: number;
    counterparty: string;
    response: string;
    movedTo: string;
    withinPlaybook: boolean;
  }[];
  outcome: string;
  summary: string;
  citations?: Citation[];
};

export type ComplianceArtifact = {
  type: "compliance";
  regulation: string;
  score: number;
  summary: string;
  distribution: { pass: number; warn: number; fail: number };
  checks: {
    rule: string;
    ref: string;
    status: CheckStatus;
    evidence: string;
    remedy?: string;
    href?: string;
  }[];
  citations?: Citation[];
};

export type MemoArtifact = {
  type: "memo";
  question: string;
  answer: string;
  summary: string;
  citations: { source: string; holding: string; href?: string }[];
  confidence: "High" | "Medium" | "Low";
  caveat?: string;
};

export type DiligenceArtifact = {
  type: "diligence";
  dataRoom: string;
  columns: string[];
  rows: { contract: string; cells: string[]; flag: "red" | "amber" | "green" }[];
  redFlags: string[];
  summary: string;
  distribution: { red: number; amber: number; green: number };
  citations?: Citation[];
};

export type ScheduleArtifact = {
  type: "schedule";
  source: string;
  summary: string;
  items: {
    obligation: string;
    due: string;
    type: "renewal" | "payment" | "report" | "termination";
    owner: string;
    urgency: "soon" | "normal";
  }[];
};

export type GuardianArtifact = {
  type: "guardian";
  subject: string;
  verified: boolean;
  score: number;
  summary: string;
  checks: { name: string; status: CheckStatus; note: string }[];
};

export type PackageArtifact = {
  type: "package";
  matter: string;
  summary: string;
  produced: { label: string; skill: SkillId }[];
  obligations: number;
  risksResolved: number;
  verified: boolean;
};

export type Artifact =
  | MatterArtifact
  | ReviewArtifact
  | RedlineArtifact
  | NegotiationArtifact
  | ComplianceArtifact
  | MemoArtifact
  | DiligenceArtifact
  | ScheduleArtifact
  | GuardianArtifact
  | PackageArtifact;

export type SkillRun = {
  skill: SkillId;
  title: string;
  plan: string[];
  console: ConsoleStep[];
  artifact: Artifact;
  closing: string;
};

export type ChatRole = "user" | "agent";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text?: string;
  run?: SkillRun;
  speed?: "normal" | "fast";
  attachment?: { title: string; meta: string };
};
