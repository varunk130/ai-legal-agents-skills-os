export type DocClause = {
  ref: string;
  title: string;
  text: string;
  severity: "critical" | "high" | "medium" | "low";
  finding: string;
};

export type LegalDoc = {
  id: string;
  title: string;
  docType: string;
  counterparty: string;
  value: string;
  pages: number;
  summary: string;
  overallRisk: "High" | "Medium" | "Low";
  clauses: DocClause[];
  recommended: string[];
};

export const DOCUMENTS: LegalDoc[] = [
  {
    id: "VND-2291",
    title: "CloudBridge Master SaaS Subscription Agreement",
    docType: "SaaS Subscription Agreement",
    counterparty: "CloudBridge Technologies, Inc.",
    value: "$184,000 / yr",
    pages: 14,
    summary:
      "Inbound vendor paper for a cloud analytics subscription. Heavily provider-favorable: unlimited customer liability, no data-protection addendum, and provider ownership of derived data.",
    overallRisk: "High",
    clauses: [
      { ref: "8.1", title: "Limitation of Liability", text: "In no event shall Provider's aggregate liability be limited; Customer's liability shall be unlimited.", severity: "critical", finding: "Customer liability is unlimited and Provider liability is uncapped." },
      { ref: "9.2", title: "Indemnification", text: "Customer shall indemnify and hold harmless Provider from any and all claims, without limitation, in perpetuity.", severity: "high", finding: "One-way, uncapped indemnity 'in perpetuity' against the Customer." },
      { ref: "5.4", title: "Data Protection", text: "Provider may process Customer Personal Data in any jurisdiction at sole discretion; sub-processors without notice.", severity: "critical", finding: "No DPA; cross-border transfers unrestricted; sub-processors without notice." },
      { ref: "12.1", title: "Term & Renewal", text: "Renews automatically for successive 12-month terms unless terminated with 90 days' notice.", severity: "medium", finding: "Silent auto-renewal with a long 90-day notice window and no reminder." },
      { ref: "7.3", title: "Intellectual Property", text: "All feedback and derived data shall become the exclusive property of Provider in perpetuity.", severity: "high", finding: "Provider claims ownership of feedback and derived data in perpetuity." },
      { ref: "11.2", title: "Service Levels", text: "Provider targets 99.5% availability; no service credits or remedies are specified.", severity: "medium", finding: "SLA stated with no credits or remedies for breach." },
      { ref: "14.6", title: "Governing Law", text: "Governed by the laws of Provider's home jurisdiction; Customer waives venue objections.", severity: "low", finding: "Provider's home jurisdiction with a venue-objection waiver." },
    ],
    recommended: [
      "Cap mutual liability and remove unlimited customer exposure",
      "Make indemnity mutual and bounded",
      "Attach a GDPR-aligned DPA before signature",
      "Add SLA service credits and a renewal reminder",
    ],
  },
  {
    id: "MSA-3120",
    title: "Atlas Logistics Master Services Agreement",
    docType: "Master Services Agreement",
    counterparty: "Atlas Logistics Group",
    value: "$92,500 / yr",
    pages: 11,
    summary:
      "Balanced services agreement for logistics integration work. Mostly market-standard, with a couple of commercial items worth negotiating (payment terms and an IP ambiguity).",
    overallRisk: "Medium",
    clauses: [
      { ref: "6.1", title: "Limitation of Liability", text: "Each party's liability is capped at fees paid in the prior 12 months.", severity: "low", finding: "Mutual 12-month liability cap — market standard." },
      { ref: "7.0", title: "Indemnification", text: "Mutual indemnity limited to third-party IP and confidentiality claims.", severity: "low", finding: "Mutual, scoped indemnity — acceptable." },
      { ref: "9.3", title: "Payment Terms", text: "Invoices are payable net sixty (60) days from receipt.", severity: "medium", finding: "Net-60 payment terms are long and pressure cash flow." },
      { ref: "10.1", title: "Assignment", text: "Neither party may assign without the other's prior written consent.", severity: "low", finding: "Assignment requires consent — good change-of-control protection." },
      { ref: "4.5", title: "Intellectual Property", text: "Deliverables are owned by Customer; background IP and 'tooling' are retained by Provider.", severity: "medium", finding: "'Tooling' is undefined and could sweep in deliverable IP." },
      { ref: "12.2", title: "Termination", text: "Either party may terminate for convenience on 30 days' notice.", severity: "low", finding: "Mutual 30-day termination for convenience — flexible." },
      { ref: "13.1", title: "Insurance", text: "Provider maintains commercial general liability of $2,000,000.", severity: "low", finding: "Adequate insurance coverage specified." },
    ],
    recommended: [
      "Shorten payment terms to net-30 or net-45",
      "Define 'tooling' so it cannot capture deliverable IP",
      "Otherwise acceptable to proceed",
    ],
  },
  {
    id: "NDA-1043",
    title: "Northwind Mutual Non-Disclosure Agreement",
    docType: "Mutual NDA",
    counterparty: "Northwind Analytics Ltd.",
    value: "—",
    pages: 4,
    summary:
      "Mutual NDA ahead of a data-sharing pilot. Generally fine, but confidentiality survives in perpetuity and the breach indemnity is uncapped.",
    overallRisk: "Medium",
    clauses: [
      { ref: "2.1", title: "Confidentiality Term", text: "Confidential Information shall be held in perpetuity by the Receiving Party.", severity: "medium", finding: "Perpetual confidentiality exceeds the standard 3–5 year survival." },
      { ref: "3.2", title: "Indemnity", text: "The Receiving Party shall indemnify the Disclosing Party for any unauthorized disclosure, without limitation.", severity: "high", finding: "Uncapped indemnity for breach of confidentiality." },
      { ref: "4.1", title: "Assignment", text: "Either party may assign this Agreement at its sole discretion.", severity: "medium", finding: "Free assignment with no consent requirement." },
      { ref: "5.3", title: "Residuals", text: "No carve-out is provided for residual knowledge retained in memory.", severity: "low", finding: "Missing residual-knowledge carve-out." },
      { ref: "7.1", title: "Governing Law", text: "Governed by the laws of England and Wales.", severity: "low", finding: "Neutral, acceptable governing law." },
    ],
    recommended: [
      "Limit confidentiality survival to 3–5 years (perpetual for trade secrets)",
      "Cap the breach indemnity",
      "Require consent for assignment",
    ],
  },
  {
    id: "DPA-4087",
    title: "Beacon Cloud Data Processing Agreement",
    docType: "Data Processing Agreement",
    counterparty: "Beacon Cloud Services",
    value: "—",
    pages: 9,
    summary:
      "A GDPR-oriented DPA that is largely compliant: SCCs are attached, sub-processor notice and breach timelines are present. One transfer location needs attention.",
    overallRisk: "Low",
    clauses: [
      { ref: "3.1", title: "Standard Contractual Clauses", text: "EU SCCs (2021/914) are incorporated for international transfers.", severity: "low", finding: "Approved transfer mechanism in place (SCCs)." },
      { ref: "4.2", title: "Sub-processors", text: "Processor gives 15 days' prior notice of new sub-processors with a right to object.", severity: "low", finding: "Sub-processor notice and objection rights satisfied." },
      { ref: "5.1", title: "Breach Notification", text: "Processor notifies Controller of a personal-data breach within 72 hours.", severity: "low", finding: "72-hour breach notification satisfies GDPR Art. 33." },
      { ref: "6.4", title: "International Transfer", text: "Processor may host backups in a region not covered by an adequacy decision.", severity: "medium", finding: "One backup region lacks an adequacy decision or explicit SCC mapping." },
      { ref: "7.2", title: "Audit Rights", text: "Controller may audit Processor's compliance once per year.", severity: "low", finding: "Reasonable annual audit rights." },
      { ref: "8.1", title: "Data Deletion", text: "Processor deletes or returns all personal data within 30 days of termination.", severity: "low", finding: "Clear data-return/deletion obligation on termination." },
    ],
    recommended: [
      "Map the backup region explicitly to SCCs or relocate it",
      "Otherwise compliant and ready to sign",
    ],
  },
  {
    id: "EMP-5560",
    title: "Helios Robotics Executive Employment Agreement",
    docType: "Employment Agreement",
    counterparty: "Helios Robotics (employer)",
    value: "$320,000 base + equity",
    pages: 8,
    summary:
      "Executive offer for a VP Engineering. Compensation is clear; the restrictive covenants are aggressive and the IP assignment is broad enough to need narrowing.",
    overallRisk: "Medium",
    clauses: [
      { ref: "5.1", title: "Non-Compete", text: "Employee shall not compete for 24 months post-termination across all 50 states.", severity: "high", finding: "24-month, nationwide non-compete — likely overbroad / unenforceable in several states." },
      { ref: "6.2", title: "IP Assignment", text: "All inventions conceived during employment are assigned to the Company.", severity: "medium", finding: "Lacks a statutory carve-out for inventions made on personal time without company resources." },
      { ref: "3.4", title: "Severance", text: "12 months' base salary on termination without cause.", severity: "low", finding: "Reasonable severance on a without-cause termination." },
      { ref: "2.1", title: "Term & At-Will", text: "Employment is at-will, but the bonus is forfeited unless employed on the payout date.", severity: "medium", finding: "At-will with a bonus-forfeiture trap on the payout date." },
      { ref: "9.1", title: "Arbitration", text: "All disputes go to binding arbitration with a class-action waiver.", severity: "medium", finding: "Mandatory arbitration + class waiver — enforceability varies by jurisdiction." },
      { ref: "7.1", title: "Confidentiality", text: "Standard confidentiality and return-of-property obligations apply.", severity: "low", finding: "Standard, acceptable confidentiality terms." },
    ],
    recommended: [
      "Narrow the non-compete in scope, geography and duration",
      "Add a statutory invention carve-out to the IP assignment",
      "Remove the bonus-forfeiture trap or add a pro-rata payout",
    ],
  },
];
