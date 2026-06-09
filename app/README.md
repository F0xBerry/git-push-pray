# `app/` — Scout monorepo (runtime)

Vendored from the hackathon demo app [devops-sre-job-match-app-example](https://github.com/GregoryKoshelenko/devops-sre-job-match-app-example), split for a clear harness layout.

## Layout

| Path | Role |
|------|------|
| `web/` | Vite + React UI (static build served by nginx in Docker/K8s). |
| `api/` | Express API + agent logic (`/api/*`, health at `/api/health`). |
| `worker/` | Placeholder background worker (heartbeat); replace with queues / jobs. |
| `skills/` | Markdown skills consumed by the API (`SKILLS_DIR` → `/app/skills` in containers). |
| `prompts/` | Extra prompt assets (keep versioned with PR + evals). |

## Local run (Docker Compose)

From the **repository root**:

```bash
docker compose up --build
```

Open `http://localhost:8080`. API is proxied as `/api/` → `api:3001`.

## Kubernetes

Manifests live under `platform/kustomize/`. Build with:

```bash
kubectl kustomize platform/kustomize/overlays/dev
# or: kustomize build platform/kustomize/overlays/dev
```

Set `images:` in each overlay to your real registry (defaults assume `ghcr.io/f0xberry/...`).

## Secrets

Do **not** commit API keys. Use `.env` locally (gitignored) or cluster Secrets / External Secrets for prod.
