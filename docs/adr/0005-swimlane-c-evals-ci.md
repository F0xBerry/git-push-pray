# ADR 0005: Swimlane C — eval fixtures + CI gate + API unit tests

## Status

Accepted

## Context

Swimlane C requires versioned eval cases, cover-letter quality checks, optional LLM-as-judge, a merge-blocking CI gate, and API correctness tests.

## Decision

1. **Fixtures (`evals/cases/`)** — each scenario is a directory with `meta.json`, inputs, and `expected.md` for humans; the runner scores deterministically without LLM keys so CI stays reliable.
2. **Gate (`evals/runner/run.mjs`)** — reads `evals/baseline.json` and exits non-zero below threshold; prints JSON report for logs.
3. **LLM judge** — stub in `evals/runner/judge-llm.mjs`; real provider wiring deferred behind `EVALS_LLM_JUDGE` when keys exist.
4. **Unit tests** — `vitest` in `app/api` for small pure/agent-wiring checks (`encodeQuery`, skill map contents).
5. **CI** — separate job runs eval runner; API job runs `npm run test` before build.

## Consequences

- **Positive:** PRs cannot merge if fixtures regress against baseline; fast feedback without cloud spend.
- **Negative:** Heuristic scores are not semantic quality; LLM judge still to implement for production-grade evals.

## References

- [`docs/swimlane-c-evals.md`](../swimlane-c-evals.md)
