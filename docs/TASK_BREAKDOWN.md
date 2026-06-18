# Scout — Job Searcher AI Assistant: Engineering Harness

Hackathon breakdown for a **4-person DevOps/Platform team**. Work is organized into
**5 swimlanes** (one Epic each). Swimlanes A–D are owned by one engineer each and are
designed to run **in parallel with minimal cross-dependencies**. Swimlane E is shared:
each owner contributes their slice of the ADR/HLD.

> In Jira, set **Board → Swimlanes → Base on Epics** to see these 5 lanes.
> Each task also carries a `swimlane-*` and `owner-*` label for filtering.

---

## Swimlane A — Platform & SDLC  (Owner: Dev 1)
**Epic:** SDLC & GitOps Delivery Pipeline
Goal: commit-to-prod automation, infra and prompts as versioned code.

| ID | Task | Notes |
|----|------|-------|
| A1 | Define monorepo structure: `app/` (worker + API), `platform/`, `evals/` | Clear ownership boundaries |
| A2 | GitHub Actions CI: `lint → unit → build → push image` | Cache deps, fail fast |
| A3 | Containerize app (worker + API); pin base image digests | Reproducible builds |
| A4 | GitOps CD (e.g. Argo CD) or CI `kubectl apply`: reconcile manifests on merge to `main` | Pull-based or pipeline deploy |
| A5 | Helm/Kustomize manifests + `dev` / `staging` / `prod` overlays | Promotion via overlays |
| A6 | Treat system prompts / `SKILL.md` / model config as versioned code in PR flow | Prompt change = PR |
| A7 | Bootstrap base infra via GitHub Codespaces + `abox` agentic sandbox | Fast onboarding |

## Swimlane B — Harness & Agent Engineering  (Owner: Dev 2)
**Epic:** Agent Harness — Memory, Skills, Protocols
Goal: build the Model + Harness contour around the agent.

**Статус в репозитории:** см. [`docs/swimlane-b-agent-harness.md`](swimlane-b-agent-harness.md) и ADR `docs/adr/0004-swimlane-b-agent-harness.md`.

| ID | Task | Notes |
|----|------|-------|
| B1 | Deploy document agent (kagent) for candidate memory | CV, skills, dialog history |
| B2 | Vector store for profile + job cache (semantic matching) | Embeddings + retrieval |
| B3 | Author `SKILL.md` declarations: `search-jobs`, `tailor-cv`, `draft-cover-letter` | Each skill isolated |
| B4 | Implement custom resume-handling skills | Parse / tailor CV |
| B5 | MCP servers as tools (job boards, interviews) | Protocol layer |
| B6 | Automation to deploy updated skills to environments | Ties into Swimlane A CD |

## Swimlane C — Evals & Quality  (Owner: Dev 3)
**Epic:** Eval Suite & CI Quality Gates
Goal: measurable quality with a hard CI gate.

**Статус в репозитории:** [`docs/swimlane-c-evals.md`](swimlane-c-evals.md), ADR `docs/adr/0005-swimlane-c-evals-ci.md`.

| ID | Task | Notes |
|----|------|-------|
| C1 | Build `evals/` structure with cases: CV + jobs → expected matching | Versioned fixtures |
| C2 | Cover-letter eval on axes: relevance / tone / hallucinations vs `expected.md` | Quality axes |
| C3 | LLM-as-judge scoring harness | agentevals-style |
| C4 | CI gate: block merge if eval-score < baseline | Hard gate |
| C5 | Unit/integration tests: tool-call parsing, retry / timeout / error handling | Agent correctness |
| C6 | Skill-change review & eval workflow (eval run on every prompt PR) | Review automation |

## Swimlane D — Security & FinOps  (Owner: Dev 4)
**Epic:** Security, Secrets, Hosting & FinOps
Goal: defend PII, lock down secrets, justify hosting/provider, know unit cost.

| ID | Task | Notes |
|----|------|-------|
| D1 | Prompt-injection defense: data/instruction isolation, tool-call validation, action allow-list | CV/jobs are untrusted |
| D2 | PII / data governance: minimize data sent to LLM + redaction | CV = PII |
| D3 | Secrets management: AgentGateway / External Secrets Operator / Vault — no keys in git | |
| D4 | Output guardrails: system-prompt-leak filter + toxicity/discrimination guard | Legally sensitive |
| D5 | Prompt-injection & PII-leak regression suite (eval + security control) | **Частично:** `evals/runner` + `scripts/verify-skills-security.sh` (skills); полный injection-suite — далее |
| D6 | Supply chain: SBOM, signed images (cosign), pinned digests | Optional |
| D7 | Hosting & LLM provider selection (provider-agnostic) — ADR | Alternatives, not one |
| D8 | FinOps: cost-per-active-user model + routing / caching / batch levers + cost anomaly alerts | Unit metric |

## Swimlane E — Architecture & Delivery  (Shared, all owners)
**Epic:** Docs & Submission Deliverables
Goal: repository submission artifacts.

| ID | Task | Notes |
|----|------|-------|
| E1 | ADR — Architectural Decision Records (each owner adds their decisions) | Trade-offs |
| E2 | HLD — High-Level Design + architecture diagram | Components + interfaces |
| E3 | README — system overview | |
| E4 | Demo app files + demo script / recording | End-to-end demo |

---

### FinOps reference scenario (for D8)
5,000 MAU × ~20 interactions; ~3K input + ~800 output tokens each →
~300M input + ~80M output tokens / month. Compute load cost across candidate models;
report **cost-per-active-user** as the headline unit metric.
