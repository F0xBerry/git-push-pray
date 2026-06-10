# Scout — Job Searcher AI Assistant (DevOps Hackathon)

Engineering harness around an agentic AI job-search assistant: commit-to-prod
SDLC, evals in CI, PII protection, secrets management and FinOps.

## Monorepo layout

```text
app/
  web/           # Vite + React UI (from hackathon demo)
  api/           # Express API + agent (from demo `server/`)
  worker/        # Placeholder worker (extend for queues / jobs)
  prompts/       # Versioned prompts
  skills/        # SKILL.md assets (SKILLS_DIR in API container)
platform/        # Kustomize (+ optional Argo CD)
evals/           # Eval suite + CI gate (to be wired)
docs/            # ADR, HLD, task breakdown
docker/          # nginx template for `web` image
```

See each top-level `README.md` for ownership hints and next steps.

## Quick start (local)

```bash
docker compose up --build
```

UI: `http://localhost:8080` — `/api/` проксируется на сервис `api`.

## Kubernetes

```bash
kubectl kustomize platform/kustomize/overlays/dev
# or: kustomize build platform/kustomize/overlays/dev
```

В overlays заданы образы `ghcr.io/f0xberry/scout-{api,web,worker}` — **замени** на свой GHCR/ECR и теги после первого push из CI.

## Docker images (build from repo root)

| Dockerfile | Image role |
|------------|------------|
| `Dockerfile.api` | Node API + bundled `app/skills` |
| `Dockerfile.web` | nginx + статика из `app/web` |
| `Dockerfile.worker` | минимальный worker |

## Docs

- `docs/TASK_BREAKDOWN.md` — swimlanes и задачи.
- `docs/HLD.md` — черновик HLD (добавь диаграмму).
- `docs/adr/` — ADR.

## Code owners

Файл **`CODEOWNERS`** (не шаблон): сейчас указан `@F0xBerry`. Добавь коллабораторов строками `/path @user1 @user2` при необходимости.

## Security

Не коммить `.env` и ключи LLM. Для прод — Secrets / External Secrets / AgentGateway.

## Upstream demo

Исходное приложение: [GregoryKoshelenko/devops-sre-job-match-app-example](https://github.com/GregoryKoshelenko/devops-sre-job-match-app-example).
