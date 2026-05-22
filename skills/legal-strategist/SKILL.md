---
name: legal-strategist
description: 'Risk assessment and strategic legal recommendations. Use when: assess legal risk, mitigation strategy, negotiation position, risk exposure, contract negotiation strategy, legal risk profile, compliance risk.'
---

# Legal Strategist

Assess risk exposure, develop strategic recommendations, and build mitigation plans. Provides severity-rated risk profiles with financial exposure estimates and negotiation strategies.

## Output
Save to `outputs/legal-strategy-[topic]-[YYYY-MM-DD].md`

## When to Use
- Evaluating risk before signing a contract
- Building a negotiation strategy for contract terms
- Assessing legal exposure for a business decision
- Developing mitigation plans for identified risks
- Preparing for a legal or compliance audit

## What You'll Get

| Output | Description |
|--------|-------------|
| **Risk Profile** | All risks identified with severity, likelihood, and exposure |
| **Risk Matrix** | Visual categorization (High/Medium/Low × Likely/Possible/Unlikely) |
| **Mitigation Plan** | Specific actions to reduce each risk |
| **Negotiation Strategy** | Recommended positions, fallbacks, and walk-away points |
| **Cost-Benefit Analysis** | Financial impact of accepting vs. mitigating each risk |
| **Action Items** | Prioritized next steps with owners |

## Process

### Step 1: Define the Situation
I'll ask:
> "What legal situation needs strategic assessment? Include the document/decision, your goals, and any constraints (timeline, budget, relationship importance)."

### Step 2: Identify All Risks
I'll categorize risks across dimensions:
- **Legal/Regulatory**: Non-compliance, enforcement exposure
- **Financial**: Liability caps, indemnification gaps, penalty exposure
- **Operational**: Performance obligations, SLA commitments
- **Reputational**: Public disclosure, customer impact
- **Strategic**: Lock-in, competitive restriction, IP exposure

### Step 3: Score Each Risk
| Factor | Scale | Description |
|--------|-------|-------------|
| Severity | 1-5 | Impact if the risk materializes |
| Likelihood | 1-5 | Probability of occurrence |
| Detectability | 1-5 | How quickly would you know? |
| Financial Exposure | $ range | Estimated cost range |

**Risk Score** = Severity × Likelihood (1-25 scale)

### Step 4: Build Mitigation Strategy
For each risk:
- **Accept**: Risk is within tolerance - document and monitor
- **Mitigate**: Specific contract changes or operational controls
- **Transfer**: Insurance, indemnification, or liability allocation
- **Avoid**: Walk away or restructure the deal

### Step 5: Develop Negotiation Positions
For contract negotiations:
- **Ideal position**: What you'd prefer
- **Acceptable fallback**: What you can live with
- **Walk-away point**: Where you exit the negotiation
- **Leverage points**: What strengths you can use

## Demo: SaaS Contract Risk Assessment

**Input:** "Reviewing a SaaS vendor contract. $500K annual value. 3-year term. We're concerned about data security and vendor lock-in."

**Sample Risk Matrix:**

| Risk | Severity | Likelihood | Score | Exposure | Strategy |
|---|---|---|---|---|---|
| Data breach by vendor | 5 | 3 | 15 | $2-5M | Require cyber insurance proof, breach notification SLA |
| Vendor lock-in (no data export) | 4 | 4 | 16 | $500K+ migration | Negotiate data portability clause, API access |
| Unilateral price increase at renewal | 3 | 4 | 12 | $150-250K/yr | Cap increases at CPI + 3%, add price protection |
| Service degradation (no SLA teeth) | 3 | 3 | 9 | $50-100K | Add meaningful credits, termination right at < 99.5% |
| IP contamination (broad license grant) | 4 | 2 | 8 | Varies | Narrow license to necessary scope, exclude derivatives |

**Negotiation Strategy:**
- **Lead with data portability** - highest risk score, reasonable ask
- **Bundle price cap with longer term** - vendor gets commitment, you get predictability
- **SLA credits as minimum** - easy win, establishes precedent

> ⚠️ Strategic analysis for discussion purposes only. Not legal advice. Consult qualified counsel for decisions.
