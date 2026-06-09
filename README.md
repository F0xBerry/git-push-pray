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

## Contents

- `docs/TASK_BREAKDOWN.md` — 5 swimlanes for a 4-person team (source of truth).
- `docs/HLD.md` — high-level design draft (replace with your diagram).
- `docs/adr/` — architectural decision records (add numbered ADRs).
- `CODEOWNERS.template` — copy to `CODEOWNERS` and set real `@` handles.
- `scripts/jira_seed.py` — creates/updates epics and tasks in Jira via REST API v3.

## Setup (Jira tooling only)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in your Jira credentials
```

## Seed Jira

```bash
python scripts/jira_seed.py --dry-run   # preview, creates nothing
python scripts/jira_seed.py             # create epics + tasks (idempotent)
```

The script auto-detects team-managed vs company-managed projects, links tasks to
their epic, and labels each issue with `swimlane-*` and `owner-*`. Re-running it
updates descriptions for matching summaries.

> In Jira, set **Board → Configure → Swimlanes → Base swimlanes on: Epics** to
> visualize the 5 lanes.

## Security

Credentials live in `.env`, which is git-ignored. Never commit API tokens.
