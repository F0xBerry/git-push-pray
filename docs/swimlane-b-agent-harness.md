# Swimlane B — Agent Harness (реализация в репо)

**Epic:** Agent Harness — Memory, Skills, Protocols (`docs/TASK_BREAKDOWN.md`).

Ниже — что **сделано в коде/репо** и что остаётся **вне репозитория** или на следующие итерации.

## Статус по пунктам B1–B6

| ID | Задача | В репозитории сейчас |
|----|--------|----------------------|
| **B1** | kagent для памяти кандидата | **Не деплоим** kagent из этого репо. Рекомендация: платформенный sandbox **[abox](https://github.com/den-vasyliev/abox)** — см. [`docs/abox-and-scout-topology.md`](abox-and-scout-topology.md). Локальные загрузки API — volumes в `docker-compose`. |
| **B2** | Vector store (эмбеддинги, семантика) | **Опционально в compose:** сервис **Qdrant** (профиль `vector`), переменная **`QDRANT_URL`**, проверка в **`GET /api/health` → `vector`**. Индексация/поиск эмбеддингов в коде API — следующий шаг. |
| **B3** | SKILL: `search-jobs`, `tailor-cv`, `draft-cover-letter` | **Сделано:** каталоги `app/skills/{search-jobs,tailor-cv,draft-cover-letter}/SKILL.md`, подключены в `app/api/ai/skills/loader.ts`. |
| **B4** | Resume skills | **Сделано:** `tailor-cv` + существующий `cv-extraction`. |
| **B5** | MCP как tools | **Частично:** in-process **tools** (HTTP boards, web search) — `app/skills/agent-tools/SKILL.md` + `app/api/agent/tools/`. Отдельный **MCP stdio**-сервер в репо **не** поднимали — при необходимости вынести job boards за процесс. |
| **B6** | Доставка skills в среды | **Сделано:** skills в образе API (`Dockerfile.api`), CI **`scripts/verify-swimlane-b-skills.sh`** (наличие файлов + **`scripts/verify-skills-security.sh`** — секрети, grounding, PII-секції), `.github/workflows/ci.yml`. |

## Итог

**Полностью «закрыть» Swimlane B по смыслу хакатона** (включая kagent + вектор + внешний MCP) в одном репо **не требовалось** и часто **не делается** — часть намеренно на **abox** / внешние сервисы.  
**По репозиторию:** закрыты **B3, B4, B6**, **B5** на уровне текущей архитектуры tools, **B1** — документированно через abox; **B2** — **опциональный Qdrant в Docker Compose** + health, без полного RAG-пайплайна в коде.

## Связанные файлы

- `app/skills/search-jobs/`, `tailor-cv/`, `draft-cover-letter/`
- `app/api/ai/skills/loader.ts`
- `app/api/agent/vector-backend.ts` — health к Qdrant
- `docker-compose.yml` — профиль `vector`, `QDRANT_URL`
- `scripts/verify-swimlane-b-skills.sh` — обов’язкові `SKILL.md`
- `scripts/verify-skills-security.sh` — перевірка всіх skills на секрети, grounding та секції PII/даних
- `docs/adr/0004-swimlane-b-agent-harness.md`
