# Swimlane C — Evals & CI Gates

**Epic:** Eval Suite & CI Quality Gates (`docs/TASK_BREAKDOWN.md`).

## Что в репозитории

| ID | Реализация |
|----|------------|
| **C1** | Каталог **`evals/cases/`** с фикстурами: `match-cv-jobs-001` (cv + jobs + expected.md), `cover-letter-001` (cv_ref, job_snippet, letter + expected). Каждый кейс с **`meta.json`** (тип, порог baseline). |
| **C2** | Оси cover letter (релевантность / тон / «галлюцинации») — **прокси-скоринг** в `evals/runner/run.mjs` + человекочитаемый **`expected.md`**. |
| **C3** | Заготовка **`evals/runner/judge-llm.mjs`** (пока no-op; при `EVALS_LLM_JUDGE=1` — место для LLM-as-judge). |
| **C4** | **CI job `swimlane-c-evals`**: `node evals/runner/run.mjs` — exit **≠0**, если score &lt; **`evals/baseline.json`**. |
| **C5** | **Vitest** в `app/api`: `test/http.test.ts`, `test/skills-loader.test.ts`; в CI **`npm run test`** до `build`. |
| **C6** | Рекомендация: в GitHub добавить **path filter** на PR только для `app/prompts/**`, `app/skills/**`, `evals/**` — см. [workflow paths](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpaths). Сейчас evals гоняются на **каждом** PR (строже). |

## Локальный запуск

```bash
# Детерминированные кейсы (без API ключей)
node evals/runner/run.mjs

# Unit-тесты API
cd app/api && npm run test
```

## Baseline

Пороги — **`evals/baseline.json`**. Понизить порог = ослабить гейт; поднять = жёстче. После улучшения агента зафиксируй новый минимум в PR.

## Связанные файлы

- `evals/runner/run.mjs`, `evals/baseline.json`
- `app/api/vitest.config.ts`, `app/api/test/*.test.ts`
- `.github/workflows/ci.yml`
- ADR: `docs/adr/0005-swimlane-c-evals-ci.md`
