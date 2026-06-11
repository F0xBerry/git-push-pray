# ADR 0004: Swimlane B — agent harness (skills, optional vector, kagent boundary)

## Status

Accepted (initial increment)

## Context

Swimlane B (see `docs/TASK_BREAKDOWN.md`) covers: kagent-style memory, vector retrieval, isolated `SKILL.md` declarations, resume/cover flows, MCP-style tools, and shipping skills with the app.

The monorepo already bundles skills into the API image and uses server-side tools (HTTP fetch, provider web search) rather than a separate MCP stdio server.

## Decision

1. **Skills:** Add first-class `SKILL.md` packages `search-jobs`, `tailor-cv`, `draft-cover-letter` and wire them into `TASK_SKILL_MAP` for `job_match` / `cv_extract`.
2. **Vector store:** Add optional **Qdrant** via Docker Compose profile `vector` and a minimal **`QDRANT_URL`** probe surfaced on `/api/health` — no embedding pipeline in this increment.
3. **kagent:** Do not embed kagent in this repo; use **abox** for platform sandbox memory/gateway demos; document in `docs/swimlane-b-agent-harness.md`.
4. **MCP:** Keep **in-process tools** as the default; treat external MCP servers as a future extension behind the same tool-result contract.
5. **CI:** Add `scripts/verify-swimlane-b-skills.sh` to guard required skill files on every PR.

## Consequences

- **Positive:** Clear swimlane-B scope in-repo; health check proves vector sidecar when enabled; CI guards skill layout.
- **Negative:** Embeddings / kagent / external MCP are not fully implemented — follow-up tasks or separate services.

## References

- [`docs/swimlane-b-agent-harness.md`](../swimlane-b-agent-harness.md)
- [`docs/TASK_BREAKDOWN.md`](../TASK_BREAKDOWN.md)
