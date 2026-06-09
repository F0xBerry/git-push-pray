# `app/` — application runtime

Runnable services and everything the agent needs at runtime.

## Layout

| Path | Purpose |
|------|---------|
| `api/` | HTTP API (sync requests, health, auth boundary). |
| `worker/` | Background jobs (queues, long-running agent steps). |
| `prompts/` | Versioned system prompts and model config (same PR flow as code). |
| `skills/` | `SKILL.md` and skill assets (search-jobs, tailor-cv, draft-cover-letter). |

## Rules (hackathon brief)

- **Prompt / skill change = PR** — must pass the same CI and `evals/` gate as code.
- **No secrets in this tree** — use env + secret manager (see `platform/`).

## Upstream demo app

Fork or vendor the reference prototype when you wire real code:

- <https://github.com/GregoryKoshelenko/devops-sre-job-match-app-example>

Until then, this directory is the contract for where services and agent assets live.
