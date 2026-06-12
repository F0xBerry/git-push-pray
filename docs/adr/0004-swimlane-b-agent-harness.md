# ADR 0004: Swimlane B — agent harness (skills, optional Qdrant, kagent/MCP boundaries)

## Status

Accepted

## Context

Swimlane B (`docs/TASK_BREAKDOWN.md`) covers kagent-style memory, vector retrieval, isolated `SKILL.md` packages, resume/cover flows, MCP-style tools, and shipping skills with the app.

## Decision

1. **Skills:** Ship first-class `SKILL.md` packages `search-jobs`, `tailor-cv`, `draft-cover-letter` and attach them via `TASK_SKILL_MAP` for `job_match` / `cv_extract`.
2. **Vector store (B2):** Provide an **optional** **Qdrant** service via Docker Compose profile `vector`, `QDRANT_URL` / `VECTOR_URL` on the API, and a lightweight **`/api/health` → `vector`** probe. **No** embedding upsert/search pipeline in this increment (follow-up).
3. **kagent (B1):** Do not deploy kagent from this repo; use **abox** for platform sandbox demos and document the split (`docs/abox-and-scout-topology.md`).
4. **MCP (B5):** Keep **in-process HTTP/provider tools** as the default integration path; external MCP servers remain an optional extension.
5. **CI (B6):** Keep `scripts/verify-swimlane-b-skills.sh` to validate required skill files on every PR.

## Consequences

- **Positive:** Local dev can enable Qdrant with one compose profile; health shows when the sidecar is reachable; skills remain CI-guarded.
- **Negative:** Kubernetes manifests for Qdrant are still out of scope unless added later; RAG logic is not implemented yet.

## References

- [`docs/swimlane-b-agent-harness.md`](../swimlane-b-agent-harness.md)
- [`docs/TASK_BREAKDOWN.md`](../TASK_BREAKDOWN.md)
