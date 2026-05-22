---
name: contract-analyst
description: 'Deep contract review - extract clauses, map obligations, identify defined terms and gaps. Use when: review contract, extract clauses, obligation mapping, contract terms, payment terms, IP provisions, termination clause, indemnification.'
---

# Contract Analyst

Deep-dive into contract terms, clause structure, obligations, and defined terms. Identifies gaps, ambiguities, and one-sided provisions.

## Output
Save to `outputs/contract-review-[doc]-[YYYY-MM-DD].md`

## When to Use
- Reviewing a new contract before signing
- Comparing contract terms against your standard playbook
- Identifying missing clauses or one-sided provisions
- Extracting key obligations and deadlines

## What You'll Get

| Output | Description |
|--------|-------------|
| **Clause Inventory** | Every clause identified, categorized, and summarized |
| **Obligation Map** | Who owes what to whom, with deadlines |
| **Defined Terms** | All defined terms extracted with their definitions |
| **Gap Analysis** | Expected clauses that are missing |
| **Risk Flags** | One-sided provisions, ambiguous language, unusual terms |
| **Redline Suggestions** | Specific proposed changes with rationale |

## Process

### Step 1: Receive Document
I'll ask for the contract text and type (NDA, SaaS, employment, lease, etc.)

### Step 2: Extract Structure
I'll identify and categorize all clauses:
- **Core Terms**: Parties, effective date, term, payment
- **Obligations**: Performance requirements, deliverables, SLAs
- **Protections**: Indemnification, limitation of liability, insurance
- **IP**: Ownership, licensing, work product
- **Termination**: Triggers, notice periods, survival clauses
- **Miscellaneous**: Governing law, dispute resolution, assignment, force majeure

### Step 3: Analyze Each Clause
For each clause I'll assess:
- **Favorability**: Neutral / Favorable / Unfavorable (from your perspective)
- **Market Standard**: Is this typical for this contract type?
- **Ambiguity**: Is the language clear and enforceable?
- **Risk Level**: Low / Medium / High

### Step 4: Generate Redlines
For problematic clauses, I'll suggest specific language changes:
```
BEFORE: "Company may terminate for any reason with 30 days notice."
AFTER:  "Either party may terminate for any reason with 90 days written notice."
RATIONALE: One-sided termination right; 30 days insufficient for transition.
```

## Demo: SaaS Agreement Review

**Input:** A SaaS subscription agreement

**Sample Clause Analysis:**
| Clause | Category | Favorability | Risk | Issue |
|--------|----------|-------------|------|-------|
| Section 3.2 - Data Processing | Privacy | ⚠️ Unfavorable | High | No data deletion obligation on termination |
| Section 5.1 - SLA | Performance | ✅ Favorable | Low | 99.9% uptime with credits |
| Section 8.3 - Liability Cap | Protection | ⚠️ Unfavorable | Medium | Cap = 12 months fees (market standard is 24) |
| Section 11 - Auto-Renewal | Term | 🔴 Unfavorable | High | Auto-renews with 60-day opt-out; no price cap |

> ⚠️ Analysis for discussion purposes only. Not legal advice.
