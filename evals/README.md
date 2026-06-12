# `evals/` — quality & safety evaluation suite

Automated checks on agent outputs: matching, cover letters, hallucination **proxies**, plus CI gate vs **`baseline.json`**.

## Quick run

```bash
node evals/runner/run.mjs
```

## Layout

| Path | Purpose |
|------|---------|
| `baseline.json` | Minimum scores per case type (CI fails if lower). |
| `cases/<id>/` | `meta.json`, fixtures (`cv.txt`, `jobs.json`, …), `expected.md`. |
| `runner/run.mjs` | Deterministic scorer + exit code gate. |
| `runner/judge-llm.mjs` | Stub for future LLM-as-judge (C3). |

## Docs

- [`docs/swimlane-c-evals.md`](../docs/swimlane-c-evals.md)

## References

- Agent eval patterns: [Solo.io AgentEvals announcement](https://www.solo.io/press-releases/introducing-new-agentic-open-source-project-agentevals)
