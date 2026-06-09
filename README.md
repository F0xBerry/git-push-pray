# Scout — Job Searcher AI Assistant (DevOps Hackathon)

Engineering harness around an agentic AI job-search assistant: commit-to-prod
SDLC, evals in CI, PII protection, secrets management and FinOps.

## Monorepo layout

```text
app/           # Worker + API, prompts, skills (runtime + versioned agent assets)
platform/      # Flux / Kustomize / Helm — infra and GitOps manifests
evals/         # Eval suite + CI gate inputs (cases + runner)
docs/          # ADR, HLD, task breakdown
scripts/       # Jira seeding and other tooling
```

See each top-level `README.md` for ownership hints and next steps.


## Security

Credentials live in `.env`, which is git-ignored. Never commit API tokens.
