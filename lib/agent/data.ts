import type { Severity } from "@/lib/types";

export const SAAS_AGREEMENT = {
  id: "VND-2291",
  title: "CloudBridge Master SaaS Subscription Agreement",
  counterparty: "CloudBridge Technologies, Inc.",
  value: "$184,000 / yr",
  excerpt: [
    "8.1 Limitation of Liability. In no event shall Provider's aggregate liability be limited; Customer's liability shall be unlimited for all claims arising under this Agreement.",
    "9.2 Indemnification. Customer shall indemnify and hold harmless Provider from any and all claims, without limitation, in perpetuity.",
    "5.4 Data Protection. Provider may process Customer Personal Data in any jurisdiction at Provider's sole discretion and may engage sub-processors without notice.",
    "12.1 Term & Renewal. This Agreement renews automatically for successive twelve (12) month terms unless terminated with ninety (90) days' notice.",
    "7.3 Intellectual Property. All feedback and derived data shall become the exclusive property of Provider in perpetuity.",
    "14.6 Governing Law. This Agreement is governed by the laws of the Provider's home jurisdiction; Customer waives any objection to venue.",
  ],
};

export const NDA = {
  id: "NDA-1043",
  title: "Mutual Non-Disclosure Agreement",
  counterparty: "Northwind Analytics Ltd.",
  value: "—",
  excerpt: [
    "2.1 Confidential Information shall be held in perpetuity by the Receiving Party.",
    "3.2 The Receiving Party shall indemnify and hold harmless the Disclosing Party for any unauthorized disclosure, without limitation.",
    "4.1 Either party may assign this Agreement at its sole discretion.",
  ],
};

export type PlaybookEntry = {
  clause: string;
  detect: string[];
  severity: Severity;
  customer: {
    preferred: { text: string; why: string };
    ladder: { text: string; why: string }[];
    walkAway: string;
  };
};

export const PLAYBOOK: Record<string, PlaybookEntry> = {
  limitation_of_liability: {
    clause: "Limitation of Liability",
    detect: ["unlimited", "liability shall be limited", "in no event"],
    severity: "critical",
    customer: {
      preferred: {
        text: "Each party's aggregate liability is capped at 12 months' fees paid.",
        why: "Bound exposure to recent spend; mutual cap.",
      },
      ladder: [
        {
          text: "Cap at 24 months' fees paid.",
          why: "First fallback if vendor resists a 12-month cap.",
        },
        {
          text: "Cap at 36 months' fees, with carve-outs for data breach.",
          why: "Second fallback; preserves breach protection.",
        },
      ],
      walkAway: "Any uncapped liability owed by the Customer.",
    },
  },
  indemnification: {
    clause: "Indemnification",
    detect: ["indemnify and hold harmless", "without limitation", "in perpetuity"],
    severity: "high",
    customer: {
      preferred: {
        text: "Indemnity is mutual, capped, and limited to third-party IP and confidentiality claims.",
        why: "Remove unbounded, perpetual one-way indemnity.",
      },
      ladder: [
        {
          text: "Mutual indemnity capped at the liability cap.",
          why: "Fallback that still bounds exposure.",
        },
      ],
      walkAway: "One-way, uncapped, perpetual indemnity.",
    },
  },
  data_protection: {
    clause: "Data Protection",
    detect: ["personal data", "sub-processor", "sole discretion", "any jurisdiction"],
    severity: "critical",
    customer: {
      preferred: {
        text: "Add a GDPR-aligned DPA: documented transfer mechanism, prior notice of sub-processors with objection rights, and breach notice within 72 hours.",
        why: "Required for lawful processing of EU personal data.",
      },
      ladder: [
        {
          text: "DPA with sub-processor notice (15 days) and SCCs for transfers.",
          why: "Fallback preserving core data-protection guarantees.",
        },
      ],
      walkAway: "Unrestricted cross-border transfer with no DPA.",
    },
  },
  term_renewal: {
    clause: "Term & Renewal",
    detect: ["renews automatically", "successive", "notice"],
    severity: "medium",
    customer: {
      preferred: {
        text: "Auto-renewal requires 30 days' notice and a renewal reminder 60 days before each term end.",
        why: "Avoid silent lock-in; preserve exit.",
      },
      ladder: [
        {
          text: "Auto-renew with 60 days' notice.",
          why: "Fallback shortening the notice window.",
        },
      ],
      walkAway: "Auto-renewal with 90+ days' notice and no reminder.",
    },
  },
  ip_feedback: {
    clause: "Intellectual Property",
    detect: ["feedback", "derived data", "exclusive property", "perpetuity"],
    severity: "high",
    customer: {
      preferred: {
        text: "Customer retains ownership of its data; Provider gets only a license to feedback.",
        why: "Protect Customer IP and derived data.",
      },
      ladder: [
        {
          text: "Provider may use de-identified, aggregated data only.",
          why: "Fallback limiting Provider use.",
        },
      ],
      walkAway: "Provider owns Customer data or derived data outright.",
    },
  },
  governing_law: {
    clause: "Governing Law",
    detect: ["governed by the laws", "venue", "waives"],
    severity: "low",
    customer: {
      preferred: {
        text: "Governing law and venue set to a neutral, mutually agreed jurisdiction.",
        why: "Remove home-court advantage and venue waiver.",
      },
      ladder: [
        {
          text: "Customer's home jurisdiction, or neutral arbitration.",
          why: "Fallback ensuring fairness.",
        },
      ],
      walkAway: "Mandatory venue with waiver of all objections.",
    },
  },
};

export type RegRule = {
  id: string;
  ref: string;
  href: string;
  rule: string;
  test: (text: string) => "pass" | "warn" | "fail";
  evidencePass: string;
  evidenceFail: string;
  remedy: string;
};

export const GDPR_RULEPACK: { name: string; rules: RegRule[] } = {
  name: "GDPR / UK-EU Data Protection Addendum",
  rules: [
    {
      id: "art28",
      ref: "GDPR Art. 28(3)",
      href: "https://gdpr-info.eu/art-28-gdpr/",
      rule: "A written data processing agreement must bind the processor.",
      test: (t) => (t.includes("dpa") || t.includes("processing agreement") ? "pass" : "fail"),
      evidencePass: "A DPA is incorporated by reference.",
      evidenceFail: "No data processing agreement is present in the contract.",
      remedy: "Attach a GDPR Art. 28 DPA as an exhibit.",
    },
    {
      id: "art28-subproc",
      ref: "GDPR Art. 28(2)",
      href: "https://gdpr-info.eu/art-28-gdpr/",
      rule: "Sub-processors require prior authorisation and notice with objection rights.",
      test: (t) =>
        t.includes("without notice") || t.includes("sole discretion")
          ? "fail"
          : "warn",
      evidencePass: "Sub-processor changes require prior notice.",
      evidenceFail:
        "Clause 5.4 allows sub-processors 'without notice' at Provider's 'sole discretion'.",
      remedy: "Require prior notice and a right to object to new sub-processors.",
    },
    {
      id: "ch5",
      ref: "GDPR Ch. V (Art. 44-46)",
      href: "https://gdpr-info.eu/art-44-gdpr/",
      rule: "International transfers need an approved transfer mechanism (e.g. SCCs).",
      test: (t) =>
        t.includes("any jurisdiction") && !t.includes("scc") ? "fail" : "warn",
      evidencePass: "Transfers are restricted to adequate jurisdictions / SCCs.",
      evidenceFail:
        "Clause 5.4 permits processing in 'any jurisdiction' with no transfer mechanism.",
      remedy: "Add Standard Contractual Clauses and restrict transfer locations.",
    },
    {
      id: "art33",
      ref: "GDPR Art. 33",
      href: "https://gdpr-info.eu/art-33-gdpr/",
      rule: "Personal-data breaches must be notified without undue delay (≤72h).",
      test: (t) => (t.includes("72") || t.includes("breach notice") ? "pass" : "fail"),
      evidencePass: "72-hour breach notification is specified.",
      evidenceFail: "No breach-notification timeline is specified.",
      remedy: "Add a 72-hour breach-notification obligation on the Provider.",
    },
    {
      id: "art5",
      ref: "GDPR Art. 5(1)(b)",
      href: "https://gdpr-info.eu/art-5-gdpr/",
      rule: "Processing must be limited to specified, legitimate purposes.",
      test: (t) =>
        t.includes("exclusive property") || t.includes("derived data")
          ? "warn"
          : "pass",
      evidencePass: "Purpose limitation is respected.",
      evidenceFail:
        "Clause 7.3 claims ownership of 'derived data', exceeding purpose limitation.",
      remedy: "Limit Provider use to de-identified, aggregated data.",
    },
  ],
};

export type CaseLawEntry = {
  source: string;
  href: string;
  holding: string;
  tags: string[];
};

export const CASE_LAW: CaseLawEntry[] = [
  {
    source: "Restatement (Synthetic) of Contracts §356",
    href: "https://www.law.cornell.edu/ucc/2/2-719",
    holding:
      "Liability limitations are generally enforceable unless unconscionable or barred by statute; a total bar on one party's recovery invites unconscionability review.",
    tags: ["liability", "cap", "unlimited", "unconscionable", "enforceable"],
  },
  {
    source: "Meridian Software v. Halcyon Corp. (Synthetic, 2021)",
    href: "https://www.law.cornell.edu/wex/indemnification",
    holding:
      "A one-sided uncapped indemnity 'in perpetuity' was struck as an unreasonable penalty; mutual, bounded indemnities were favored.",
    tags: ["indemnity", "perpetuity", "uncapped", "penalty"],
  },
  {
    source: "EU-Model Data Transfer Guidance (Synthetic)",
    href: "https://gdpr-info.eu/art-46-gdpr/",
    holding:
      "Cross-border transfers of personal data require an Article 46 safeguard such as Standard Contractual Clauses; 'any jurisdiction' clauses are non-compliant.",
    tags: ["data", "transfer", "gdpr", "scc", "jurisdiction"],
  },
  {
    source: "Consumer-Lock Auto-Renewal Act (Synthetic, §4)",
    href: "https://www.ftc.gov/business-guidance/resources/negative-option-marketing",
    holding:
      "Automatic-renewal terms require clear notice and a reminder before renewal; 90-day notice windows without reminders are presumptively unfair.",
    tags: ["renewal", "auto-renew", "term", "notice"],
  },
];

export const DATA_ROOM = {
  name: "Project Lighthouse — Data Room",
  columns: ["Liability cap", "Assignment", "Change of control", "Auto-renew"],
  rows: [
    {
      contract: "VND-2291 CloudBridge SaaS",
      cells: ["Unlimited (Customer)", "Provider only", "Silent", "Auto, 90d"],
      flag: "red" as const,
    },
    {
      contract: "VND-1180 Atlas Logistics MSA",
      cells: ["12 mo fees", "Mutual consent", "Termination right", "Auto, 30d"],
      flag: "green" as const,
    },
    {
      contract: "VND-3340 Quill Marketing SOW",
      cells: ["6 mo fees", "Either party", "Silent", "Fixed term"],
      flag: "amber" as const,
    },
    {
      contract: "NDA-1043 Northwind Mutual",
      cells: ["n/a", "Either party", "n/a", "Perpetual confidentiality"],
      flag: "amber" as const,
    },
    {
      contract: "VND-2207 Beacon Cloud DPA",
      cells: ["24 mo fees", "Consent", "Termination right", "Auto, 60d"],
      flag: "green" as const,
    },
  ],
  redFlags: [
    "VND-2291 carries unlimited Customer liability and no DPA — blocks signing.",
    "2 of 5 contracts allow free assignment without consent (change-of-control risk).",
    "Perpetual confidentiality in NDA-1043 exceeds standard 3–5 year survival.",
  ],
};

export const SIGNED_CONTRACTS = {
  name: "Executed contracts (post-signature)",
  items: [
    {
      obligation: "CloudBridge SaaS — auto-renewal notice deadline",
      due: "in 18 days",
      type: "renewal" as const,
      owner: "Legal Ops",
      urgency: "soon" as const,
    },
    {
      obligation: "Atlas Logistics MSA — annual SOC 2 report due",
      due: "in 34 days",
      type: "report" as const,
      owner: "Vendor Mgmt",
      urgency: "normal" as const,
    },
    {
      obligation: "Beacon Cloud — Q3 subscription payment",
      due: "in 9 days",
      type: "payment" as const,
      owner: "Finance",
      urgency: "soon" as const,
    },
    {
      obligation: "Quill Marketing SOW — termination-for-convenience window opens",
      due: "in 51 days",
      type: "termination" as const,
      owner: "Procurement",
      urgency: "normal" as const,
    },
  ],
};
