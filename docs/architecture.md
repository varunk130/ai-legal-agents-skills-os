# Architecture

The AI Legal Team is composed of four specialist agents and a thin orchestrator that coordinates them.

## Pipeline

```
        ┌──────────────────┐
        │   Document       │
        │   (text input)   │
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │   Orchestrator   │
        └────────┬─────────┘
     ┌───────────┼───────────┬───────────┐
     ▼           ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
│Compliance│ │  Risk   │ │ Strategy │ │ Redline  │
│  Agent   │ │  Agent  │ │  Agent   │ │  Agent   │
└────┬─────┘ └────┬────┘ └────┬─────┘ └────┬─────┘
     │            │            │            │
     └────────────┴────┬───────┴────────────┘
                       ▼
               ┌──────────────┐
               │ LegalReport  │
               └──────────────┘
```

## Agents

### Compliance Agent

Scans the document for keywords mapped to regulatory frameworks
(GDPR, HIPAA, SOC 2 by default). Returns a list of `ComplianceFinding`s
with framework, clause, severity, excerpt, and a recommendation.

The detection layer is intentionally simple (heuristic keyword scan);
swap it for an LLM call when you need broader recall.

### Risk Agent

Weights the presence of indemnity, liability cap, termination, warranty,
force-majeure, and remedy language. Produces a numeric score and a band:

- **low** - score < 3.5
- **medium** - 3.5 ≤ score < 7.0
- **high** - score ≥ 7.0

The thresholds are configurable on `RiskAgent`.

### Strategy Agent

Consumes compliance findings and the risk score. Recommends a posture:

| Risk band | Posture | When to use |
| --------- | ------- | ----------- |
| low       | `accept-with-clarifications` | Standard MSA, low exposure |
| medium    | `targeted-redlines`          | Some risky clauses to negotiate |
| high      | `negotiate-hard`             | Cap liability, tighten indemnity |

It also returns a prioritized list of asks for counsel (top 5).

### Redline Agent

Applies a small set of rewrite rules (e.g. `in perpetuity` →
`for a term of three (3) years`) and returns concrete edit suggestions
with start/end spans, original text, replacement, and a one-sentence
justification.

## Orchestrator

`LegalTeamOrchestrator` runs all four agents on the document and
assembles a `LegalReport` containing the unified summary plus the raw
artifacts from each agent. It does not interpret the results - that is
the caller's job.

## Data flow

1. Caller passes the document text to the orchestrator.
2. Compliance and Risk agents run independently and produce structured findings.
3. Strategy agent consumes both outputs and emits a posture + priorities.
4. Redline agent runs in parallel and emits concrete edits.
5. Orchestrator wraps everything in a `LegalReport`.

## Extension points

- **Frameworks**: pass a custom tuple to `ComplianceAgent(frameworks=...)`
  to scan against your own regulatory list.
- **Risk weights**: override `RISK_SIGNALS` in `agents/risk_agent.py` or
  subclass `RiskAgent` and replace `score`.
- **Rewrite rules**: append to `REWRITE_RULES` in `agents/redline_agent.py`
  to teach the redliner new patterns.
- **LLM-backed agents**: each agent currently uses heuristics. Swap the
  `_scan` / `score` / `_priorities` / `suggest` methods for LLM calls;
  reusable system prompts live in `utils/prompts.py`.

## Non-goals

- Producing legal advice - the agent helps lawyers and PMs triage faster, not replace them.
- 100% recall on compliance findings - the heuristic layer is a first pass.
- Document parsing - the team operates on plain text; bring your own extractor.
