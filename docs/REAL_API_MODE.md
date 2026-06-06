# Real-API Mode - Scaffolding & Operating Notes

This document describes how the project is structured to *prepare* for a real LLM-backed mode without enabling any live API calls. Today the project runs entirely on mock responses for both versions (Streamlit / Express). This file documents the planned env-var toggle, the prompts directory layout, and the cost guardrails - so the path from mock to live is a configuration change, not a refactor.

> **No external API calls are wired in this commit.** Every code path still serves the existing mock responses. This is scaffolding only - schema, prompt artifacts, and documentation. Anyone who later wires the actual call site has a single, well-defined seam to patch.

---

## Why Scaffold Now (and Not Wire Yet)

- The repository is intended as a public technical demonstration. Wiring a live API key would require either (a) hard-coding a key (unsafe) or (b) requiring every visitor to bring their own (high-friction).
- The mock mode is the *correct default* for a public demo. The real-API mode should be an opt-in for self-hosted deployments only.
- Decoupling prompts from code (the `prompts/` directory) is independently valuable - it lets non-engineers review, version, and iterate the agent system prompts without touching application code.

---

## The Three Modes

The codebase is structured around three operating modes, selected by environment variable. Today only `mock` is implemented end-to-end; `live` and `live-with-cache` are documented seams.

| Mode | `ANALYSIS_MODE` value | Behavior | Status |
|------|-----------------------|----------|--------|
| **Mock** (default) | unset, or `mock` | Returns the canned analyses already in the demo | ✅ Implemented |
| **Live** | `live` | Calls Claude API per request using prompts in `prompts/` | 🟡 Scaffolded - call site is a documented seam |
| **Live + Cache** | `live-with-cache` | Same as `live`, but caches by `sha256(document_content)` so repeated demos don't re-bill | 🟡 Scaffolded |

**Resolution rule:** if `ANALYSIS_MODE` is `live` or `live-with-cache` but `CLAUDE_API_KEY` is empty, the application **must** fall back to mock mode and log a single warning at startup. The demo never breaks because of a missing key.

---

## Environment Variables

| Variable | Default | Used By | Notes |
|----------|---------|---------|-------|
| `ANALYSIS_MODE` | `mock` | All adapters | One of: `mock`, `live`, `live-with-cache` |
| `CLAUDE_API_KEY` | *(unset)* | Live mode adapter | Required when mode is `live*`; absence triggers mock fallback |
| `MAX_DOCUMENT_TOKENS` | `40000` | Cost guardrail | Documents above this are rejected with a clear error before any API call |
| `MAX_TOKENS_PER_ANALYSIS` | `8000` | Cost guardrail | Hard cap on `max_tokens` passed to the model |
| `ANALYSIS_TIMEOUT_SECONDS` | `60` | Live mode adapter | Per-agent request timeout |
| `LIVE_CACHE_DIR` | `.cache/analyses` | Live + Cache mode | On-disk JSON cache keyed by `sha256(document + agent + prompt_version)` |

---

## Cost Guardrails

These run *before* any live call would be issued, so they apply even if the call site is later wired:

1. **Document size cap** - reject documents above `MAX_DOCUMENT_TOKENS` (default 40k tokens ≈ ~30k words). Most contracts and NDAs fit; very large M&A documents would need explicit chunking.
2. **Output cap** - every agent request is bounded by `MAX_TOKENS_PER_ANALYSIS` so a runaway response can't drain budget.
3. **Per-session cap** - the application should track tokens consumed per session and stop accepting new analyses if a configurable per-session ceiling is hit.
4. **Cache-by-content-hash** - `live-with-cache` mode means repeated demos of the same sample document do not re-bill. The cache is keyed by document hash *and* prompt version, so a prompt change correctly invalidates.
5. **Read-only by default** - the live mode adapter never writes to disk except into `LIVE_CACHE_DIR` and never makes more than one outbound request per agent per analysis.

---

## Prompts Directory

Each agent's system prompt lives in `prompts/`, decoupled from code. This:
- Lets prompts be reviewed and versioned independently of application logic
- Makes it possible to A/B different prompts without redeploying
- Documents the agent's intended behavior in one place

| File | Agent | Notes |
|------|-------|-------|
| `prompts/team-lead.md` | Team Lead | Coordination + final synthesis |
| `prompts/contract-analyst.md` | Contract Analyst | Clauses, obligations, defined terms |
| `prompts/legal-researcher.md` | Legal Researcher | Case law, statutes, regulatory frameworks |
| `prompts/legal-strategist.md` | Legal Strategist | Risk assessment + strategic recommendations |

Each prompt file begins with a frontmatter block carrying a `prompt_version` string. When `ANALYSIS_MODE=live-with-cache`, the cache key incorporates this version so prompt edits invalidate cached responses cleanly.

---

## The Single Documented Seam

When wiring real calls later, exactly **one** function per backend should change:

- **Python (Streamlit):** `agents.<agent_name>.analyze(document_text, prompt)` - currently returns a hard-coded analysis. The live implementation reads the prompt file, applies the cost guardrails, and issues one Claude API request.
- **Node (Express):** `agents/<agent_name>.js` `analyze({ documentText, prompt })` - same shape; same one-function seam.

Everything else - routing, response shaping, error display, mock-mode detection - is already in place. There is intentionally no orchestrator-level branching on `ANALYSIS_MODE`; that decision lives inside the adapter so a partial wire-up (live for one agent, mock for the others) works without changes elsewhere.

---

## Roadmap Beyond Scaffolding

Out of scope for this commit, but listed so future work has a clear target:

- [ ] Wire the actual Claude API request inside the four `analyze` seams
- [ ] Add a streaming response variant so the UI can show partial output (similar to the streaming pattern in [ai-pm-agents-suite](https://github.com/varunk130/ai-pm-agents-suite))
- [ ] Add a `prompts/CHANGELOG.md` so prompt versions have human-readable history
- [ ] Add per-session token accounting + a configurable per-session cap
- [ ] Add a `--smoke-test` CLI flag that issues one minimal request to verify connectivity without running a full analysis

---

## Disclaimer (Reiterated)

This project remains a technical demonstration. Even in `live` mode, outputs are not legal advice. The cost guardrails above are budget protections, not safety mechanisms - a separate review layer (human-in-the-loop) is required before any output is acted on.
