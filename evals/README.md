# `evals/` — quality & safety evaluation suite

Automated checks on agent outputs: matching, cover letters, hallucinations, plus regression cases for **prompt injection** and **PII leakage**.

## Layout

| Path | Purpose |
|------|---------|
| `cases/` | One folder per scenario: fixtures (CV, jobs), `expected.md` or structured expectations. |
| `runner/` | Scripts that invoke the agent / judge and emit scores (exit non-zero below baseline for CI gate). |

## CI gate

The pipeline should run `evals/` on every PR (especially prompt/skill changes) and **block merge** if scores fall below the stored baseline — see hackathon success criteria.

## References

- Agent eval patterns: [Solo.io AgentEvals announcement](https://www.solo.io/press-releases/introducing-new-agentic-open-source-project-agentevals)
