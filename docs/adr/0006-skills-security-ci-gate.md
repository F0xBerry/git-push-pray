# ADR 0006: Skills markdown — CI security gate (secrets, grounding, PII sections)

## Status

Accepted

## Context

Skills ship as versioned `SKILL.md` text bundled into the API image. They influence model behavior but are not compiled code, so regressions (accidental secret paste, missing data-handling language, weak tool/schema grounding) are easy to merge unnoticed. Non-functional requirements from Swimlane D (PII awareness, resistance to treating postings as trusted instructions) intersect with Swimlane B (skills as product artifacts).

We needed a **merge-blocking, keyless** check that scales with the repo without running the full LLM stack.

## Decision

1. **Dedicated script** — `scripts/verify-skills-security.sh` scans **every** `app/skills/*/SKILL.md`.
2. **Secret-shaped tokens** — fail the build if content matches conservative regexes for common API key / token / PEM private-key shapes (documentation must use redacted placeholders, not live material).
3. **Grounding cues** — each skill must contain explicit language tying behavior to **tool output**, **schemas**, **verified listings**, **allow-lists**, or **never invent**-style rules so prompts stay aligned with the architecture (tools-first job discovery, schema-bound JSON).
4. **PII / governance headers** — for skills that routinely consume CV or listing text (`draft-cover-letter`, `tailor-cv`, `cv-extraction`, `job-analyzer`, `job-crawler`, `job-match-scoring`), require a top-level markdown section **`## Forbidden`**, **`## Data handling`**, or **`## Security`** so governance is reviewable in PR diff.
5. **CI wiring** — `scripts/verify-swimlane-b-skills.sh` invokes the security script after the required-file list check; no extra GitHub Actions job (same `swimlane-b` job latency budget).

## Consequences

- **Positive:** PRs cannot merge obvious secret leaks or skills that omit minimal PII/grounding language; reviewers see structured sections in diffs.
- **Negative:** Static text checks do **not** replace runtime prompt-injection defenses, output guardrails, or secrets management (ESO/Vault/AgentGateway) — those remain separate work (Swimlane D). False positives are possible if new skills use unusual phrasing; extend the allow-patterns or headings in the script when intentional.

## References

- [`scripts/verify-skills-security.sh`](../../scripts/verify-skills-security.sh)
- [`scripts/verify-swimlane-b-skills.sh`](../../scripts/verify-swimlane-b-skills.sh)
- [`docs/swimlane-b-agent-harness.md`](../swimlane-b-agent-harness.md)
- [`docs/TASK_BREAKDOWN.md`](../TASK_BREAKDOWN.md) — Swimlane D (D5 partial overlap)
