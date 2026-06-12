# Eval runner

| Script | Purpose |
|--------|---------|
| `run.mjs` | Load `cases/*/meta.json`, score against `../baseline.json`, exit **1** on failure. |
| `judge-llm.mjs` | Optional LLM-as-judge stub (C3). |

Run from repo root:

```bash
node evals/runner/run.mjs
```

CI: see `.github/workflows/ci.yml` job **Swimlane C — eval gate**.
