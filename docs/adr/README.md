# Architectural Decision Records (ADR)

Use one file per decision, numbered sequentially. Current:

- `0003-abox-vs-scout-clusters.md` — no Flux in repo; Kustomize + optional Argo CD
- `0004-swimlane-b-agent-harness.md` — skills, optional Qdrant, kagent/MCP boundaries
- `0005-swimlane-c-evals-ci.md` — eval fixtures, CI gate, Vitest in API
- `0006-skills-security-ci-gate.md` — CI gate on `SKILL.md`: secret patterns, grounding, PII/data sections

Suggested template:

1. **Context** — problem and constraints  
2. **Decision** — what we chose  
3. **Consequences** — trade-offs, follow-ups  
