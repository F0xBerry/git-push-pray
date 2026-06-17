# Статус swimlanes (сводка по репозиторию)

Актуально на момент последнего прохода CI-конфига. Детали: `docs/TASK_BREAKDOWN.md`, per-lane доки ниже.

| Swimlane | Тема | В репозитории | Вне / следующий шаг |
|----------|------|----------------|----------------------|
| **A** | Platform & SDLC | Monorepo, Dockerfiles, **GitHub Actions** (api/web/kustomize/evals jobs), **Kustomize** dev/staging/prod, **Argo CD** install + Application, prod **digest** + `scripts/pin_prod_digests.py`, Codespaces-friendly заметки | Полный **push образов в registry** из CI — по желанию в отдельном workflow |
| **B** | Agent harness | `app/skills/**`, wiring в `loader.ts`, **опциональный Qdrant** в compose + `/api/health` → `vector`, CI guard skills | **kagent** — abox; **эмбеддинги/RAG** в коде; отдельный **MCP**-сервер |
| **C** | Evals & CI gates | `evals/cases/**`, `baseline.json`, **`evals/runner/run.mjs`**, job **swimlane-c-evals**, **Vitest** в `app/api`, stub `judge-llm.mjs` | **LLM-as-judge**; интеграционные тесты agent+tools; **paths**-только PR для eval (см. `docs/swimlane-c-evals.md`) |
| **D** | Security & FinOps | README/ADR, общие принципы, пересечение с evals как задел | ESO/Vault, guardrails, FinOps-модель, cosign — отдельные задачи |
| **E** | Docs & delivery | README, HLD, ADR 0003–0005, topology, swimlane docs | Финальная **диаграмма** в HLD, **демо-скрипт/запись** |

## Быстрые команды проверки локально

```bash
bash scripts/verify-swimlane-b-skills.sh
node evals/runner/run.mjs
cd app/api && npm run typecheck && npm run test && npm run build
kubectl kustomize platform/kustomize/overlays/dev
```

## CI jobs (`.github/workflows/ci.yml`)

| Job | Назначение |
|-----|------------|
| `swimlane-c-evals` | Детерминированные eval + judge stub |
| `swimlane-b` | Наличие обязательных `SKILL.md` |
| `api` | typecheck → test → build |
| `web` | build |
| `kustomize` | Рендер **dev, staging, prod** overlays |
