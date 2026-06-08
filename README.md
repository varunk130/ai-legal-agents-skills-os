<div align="center">

# ⚖️ AI Legal Team Agent

### A multi-agent AI system for legal document analysis - four specialized agents collaborate in parallel to deliver compliance assessments, risk identification, strategic recommendations, and redline suggestions

[![Agents](https://img.shields.io/badge/Agents-4_specialized-blue?style=for-the-badge)](#claude-code-skills)
[![Stack](https://img.shields.io/badge/Stack-Python_3.10%2B-orange?style=for-the-badge)](#-python-quickstart)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Built with Claude Code](https://img.shields.io/badge/Built_with-Claude_Code-D97757?logo=anthropic&logoColor=white&style=for-the-badge)](https://claude.ai/code)

**Maintained by [Varun Kulkarni](https://github.com/varunk130)** · [Quick Start ↓](#-quick-start) · [Skills ↓](#claude-code-skills) · [Python ↓](#-python-quickstart)

</div>

---

![AI Legal Team Agent Dashboard](screenshots/ai-legal-agent-team-dashboard.png)

<p align="center">
  <img src="screenshots/analysis-complete.png" width="48%" alt="Analysis Results" />
  <img src="screenshots/agent-recommendations.png" width="48%" alt="Recommendations" />
</p>

<p align="center">
  <img src="screenshots/agent-overview.png" width="48%" alt="Overview Dashboard" />
</p>

> **⚠️ Disclaimer:** This application is a technical demonstration only; it does not constitute legal advice and is not a substitute for qualified counsel. All sample contracts and analysis outputs are synthetic. Do not rely on the output of this system for legal decision-making.

---

## ⚡ Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/varunk130/ai-legal-team-agent.git

# 2. Install the four legal agents as Claude Code skills
mkdir -p ~/.claude/skills
cp -r ai-legal-team-agent/skills/* ~/.claude/skills/

# 3. In Claude Code, ask any of:
#      "Run a compliance check on this NDA against GDPR"
#      "Use the contract-analyst skill to redline this SaaS agreement"
#      "Have the legal-researcher pull case law on enforceability"
```

> 💡 For the Python CLI orchestrator (no Claude Code required), see [🐍 Python Quickstart](#-python-quickstart) below.
> For the detailed setup guide, see [docs/QUICKSTART.md](docs/QUICKSTART.md).

---

## Overview

AI Legal Team Agent simulates a virtual legal team where specialized AI agents work together to analyze contracts, NDAs, lease agreements, and other legal documents. Upload a document, select an analysis type, and receive comprehensive findings across multiple dimensions.

The project ships with the following components:

| Component | Stack | Entry Point | Status |
|-----------|-------|-------------|--------|
| **Python CLI orchestrator** | Python 3.10+ (stdlib only) | `main.py` + `orchestrator.py` | ✅ Working today |
| **Claude Code skills** | Markdown skill contracts | `skills/*/SKILL.md` | ✅ Working today |
| **Streamlit UI** (planned) | Streamlit, PyPDF2, python-docx, pandas | - | 📋 Dependencies in `requirements.txt`; UI not yet implemented |

Both surfaces ship four-agent teams, organized slightly differently: the Python orchestrator under `agents/` is split by analysis output (compliance, risk, strategy, redline), while the Claude Code skill contracts under `skills/` are split by role (team lead, contract analyst, legal researcher, legal strategist). The mapping between the two views is:

| Python agent (output-shaped) | Claude Code skill (role-shaped) | Primary deliverable |
|------------------------------|---------------------------------|---------------------|
| `agents/compliance_agent.py` | `skills/legal-researcher/`      | Regulatory / statutory compliance findings (GDPR, CCPA, etc.) |
| `agents/risk_agent.py`       | `skills/legal-strategist/`      | Risk profile with severity ratings and mitigations            |
| `agents/strategy_agent.py`   | `skills/legal-team-lead/`       | Synthesized recommendation and prioritized action plan        |
| `agents/redline_agent.py`    | `skills/contract-analyst/`      | Clause-level redlines and term-by-term review                 |

Currently runs with mock AI responses; the path from mock to a real Claude API integration is documented in [`docs/REAL_API_MODE.md`](docs/REAL_API_MODE.md), with per-agent system prompts decoupled into [`prompts/`](prompts/) and a single `analyze()` seam per backend ready to wire up. **No external API calls are wired in this codebase today** — the scaffolding is opt-in for self-hosted deployments only.

---

## Features

### Multi-Agent Collaboration

Four specialized agents collaborate on every analysis, each owning a distinct perspective:

- **Legal Team Lead** - Coordinates analysis, synthesizes findings, delivers the final report
- **Contract Analyst** - Deep-dives into contract terms, clause structure, obligations
- **Legal Researcher** - Identifies relevant case law, statutory references, regulatory frameworks
- **Legal Strategist** - Assesses risk exposure, develops strategic recommendations

→ Each agent is also available as a standalone **[Claude Code Skill](skills/)**.

### Analysis Types

- **Compliance Check** - Evaluate adherence to GDPR, CCPA, employment law
- **Contract Review** - Detailed term-by-term analysis including payment and IP provisions
- **Legal Research** - Surface relevant case law, precedents, and statutory references
- **Risk Assessment** - Risk profiling with severity ratings and mitigation strategies
- **Custom Query** - Ask any specific legal question about the document

### Result Tabs

- **Analysis** - Full agent-generated narrative with page references
- **Key Points** - Critical terms extracted and categorized by importance
- **Recommendations** - Prioritized action items with legal basis
- **Redline** - Proposed changes with before/after text and visual diff
- **Overview** - Document metrics, risk assessment summary, and charts

### Document Support

Upload and analyze **PDF**, **TXT**, and **DOCX** files. Sample contracts (NDA, SaaS agreement) included for testing.

---

## Claude Code Skills

Each agent is available as a standalone Claude Code skill:

```bash
cp -r skills/* ~/.claude/skills/
```

| Skill | What It Does |
|-------|--------------|
| [legal-team-lead](skills/legal-team-lead/SKILL.md) | Orchestrates multi-agent legal analysis, synthesizes findings |
| [contract-analyst](skills/contract-analyst/SKILL.md) | Deep contract review - clauses, obligations, defined terms |
| [legal-researcher](skills/legal-researcher/SKILL.md) | Case law, statutory references, regulatory frameworks |
| [legal-strategist](skills/legal-strategist/SKILL.md) | Risk assessment, strategic recommendations, mitigation plans |

---

## 🐍 Python Quickstart

This repo also ships a lightweight Python package (`agents/`, `orchestrator.py`, `main.py`) for running the legal-team agents directly from the command line, independent of any UI layer.

Requires **Python 3.10+** (uses `dataclasses`, PEP 604 unions, and PEP 585 generics).

```bash
# Run the orchestrator on a contract
python main.py path/to/contract.txt

# Or get JSON output
python main.py path/to/contract.txt --json
```

The Python package itself has **zero runtime dependencies** beyond the standard library; `requirements.txt` covers the optional UI/demo extras.

---

## Project Structure

```text
ai-legal-team-agent/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
├── requirements.txt
├── main.py                       # CLI entry point
├── orchestrator.py               # Coordinates the 4 specialist agents
├── agents/
│   ├── __init__.py
│   ├── compliance_agent.py
│   ├── risk_agent.py
│   ├── strategy_agent.py
│   └── redline_agent.py
├── prompts/                      # System prompts for the real-API path
│   ├── contract-analyst.md
│   ├── legal-researcher.md
│   ├── legal-strategist.md
│   └── team-lead.md
├── utils/
│   └── prompts.py
├── skills/                       # Standalone Claude Code skills
│   ├── legal-team-lead/SKILL.md
│   ├── contract-analyst/SKILL.md
│   ├── legal-researcher/SKILL.md
│   └── legal-strategist/SKILL.md
├── samples/
│   ├── sample_nda.txt
│   └── sample_saas_agreement.txt
├── docs/
│   ├── architecture.md
│   ├── EXECUTIVE_SUMMARY.md
│   ├── QUICKSTART.md
│   └── REAL_API_MODE.md
└── screenshots/
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| CLI orchestrator | Python 3.10+ (standard library only) |
| Claude Code skills | Plain Markdown skill contracts |
| Streamlit UI (planned) | Streamlit, PyPDF2, python-docx, pandas |
| AI (planned) | Claude API (Anthropic) |

---

## Related Work

Part of a portfolio of AI agent and skill libraries for product, GTM, and decision-making teams.

**Discovery & research**

- [ai-customer-discovery-skills](https://github.com/varunk130/ai-customer-discovery-skills) - Turn raw customer signal into validated product opportunities (5 of 12 shipped)
- [jtbd-extractor](https://github.com/varunk130/ai-customer-discovery-skills/tree/main/skills/jtbd-extractor) - Extract Jobs-to-be-Done statements from research, with opportunity scoring

**Strategy & decisions**

- [claude-code-skills](https://github.com/varunk130/claude-code-skills) - 29 production-grade skills for finance, product, strategy, and game theory
- [AI-Builder-Decision-Analyst](https://github.com/varunk130/AI-Builder-Decision-Analyst) - 11 skills that catch bad bets before you ship across DECIDE / BUILD / COMMUNICATE / LEARN

**Go-to-market**

- [ai-gtm-skill-library](https://github.com/varunk130/ai-gtm-skill-library) - 31 opinionated GTM skills across the full discover -> renew lifecycle
- [ai-marketing-claude-skills](https://github.com/varunk130/ai-marketing-claude-skills) - 12 marketing-ops skills with scoring algorithms and statistical frameworks
- [ai-partner-ecosystem-analysis](https://github.com/varunk130/ai-partner-ecosystem-analysis) - Deep research on any ISV, partner, or competitor with a 1-slide PPTX output

**UX & design**

- [ai-ux-skill-library](https://github.com/varunk130/ai-ux-skill-library) - 12 frameworks for designing UX for AI products, agents, and AI-powered experiences

**Multi-agent demos**

- [ai-pm-agents-suite](https://github.com/varunk130/ai-pm-agents-suite) - 6-agent pipeline plus 3 standalone PM agents (decision engine, financial analyst, stakeholder translator) that turn customer feedback into strategy, PRDs, and comms

**Evaluation & operations**

- [AI-Eval-Skills](https://github.com/varunk130/AI-Eval-Skills) - 6 skills to plan, generate, run, interpret, and triage AI agent evaluations
- [ai-workflow-playbooks](https://github.com/varunk130/ai-workflow-playbooks) - 21 playbooks + 10 skills + 4 guardians + 5 runbooks across the 7-stage delivery pipeline

---

<p align="center">
  <strong>Built by Varun Kulkarni</strong><br/>
  <sub>Powered by Claude Code Opus 4.7 + GitHub Copilot</sub>
</p>
