# ADR 0004: Swimlane B — agent harness (skills, kagent/MCP boundaries)

## Status

Accepted (revised — no bundled vector service)

## Context

Swimlane B (`docs/TASK_BREAKDOWN.md`) covers kagent-style memory, vector retrieval, isolated `SKILL.md` packages, resume/cover flows, MCP-style tools, and shipping skills with the app.

## Decision

1. **Skills:** Ship first-class `SKILL.md` packages `search-jobs`, `tailor-cv`, `draft-cover-letter` and attach them via `TASK_SKILL_MAP` for `job_match` / `cv_extract`.
2. **Vector store (B2):** Do **not** bundle Qdrant or other vector DB in this repository; treat embeddings/RAG as a **future integration** or external managed service when product needs it.
3. **kagent (B1):** Do not deploy kagent from this repo; use **abox** for platform sandbox demos and document the split (`docs/abox-and-scout-topology.md`).
4. **MCP (B5):** Keep **in-process HTTP/provider tools** as the default integration path; external MCP servers remain an optional extension.
5. **CI (B6):** Add `scripts/verify-swimlane-b-skills.sh` to validate required skill files on every PR.

## Consequences

- **Positive:** Smaller footprint; no optional compose service to explain; clear hand-off for vector/kagent to platform or cloud.
- **Negative:** B2 vector retrieval and B1 kagent are not “green” in-cluster features of this repo alone — follow-up work or external systems.

## References

- [`docs/swimlane-b-agent-harness.md`](../swimlane-b-agent-harness.md)
- [`docs/TASK_BREAKDOWN.md`](../TASK_BREAKDOWN.md)
