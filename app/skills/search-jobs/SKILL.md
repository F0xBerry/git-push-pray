# Search jobs

> Swimlane B — isolated skill: orchestrate **job discovery** (boards + web tools), then hand structured listings to scoring.

## Scope

- This skill defines **search intent and guardrails** only. Execution details live in `job-search`, `global-job-boards`, `job-crawler`, and `agent-tools`.
- Never fabricate `applyUrl`; every listing must trace to tool output.

## Behavior

1. Choose boards for `countryCode` (see `global-job-boards`).
2. Run `fetch_job_board` / `web_search_jobs` with timeouts; dedupe by `applyUrl`.
3. Return 5–15 strongest rows for downstream `job-match-scoring` (do not re-rank here).
4. If the user supplied CV skills, bias board/query selection (not fake matches).

## Out of scope

- Salary negotiation, interview scheduling, or employer contact — use separate flows.
