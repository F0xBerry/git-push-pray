# Swimlane B — Agent Harness (реализация в репо)

**Epic:** Agent Harness — Memory, Skills, Protocols (`docs/TASK_BREAKDOWN.md`).

Кратко, что здесь сделано и куда смотреть дальше.

## B1 — kagent / candidate memory

**В этом репозитории** не поднимается kagent как отдельный Helm-чарт: для платформенного sandbox используй **[abox](https://github.com/den-vasyliev/abox)** (`make run`) — см. [`docs/abox-and-scout-topology.md`](abox-and-scout-topology.md).

Здесь: **API** хранит загрузки/данные в volume (`docker-compose` → `api-uploads`, `api-data`); долговременная «память кандидата» в проде — отдельное хранилище + vector (ниже).

## B2 — Vector store (семантика / кэш)

- **Локально (опционально):** сервис **Qdrant** в `docker-compose.yml` под профилем **`vector`**.
- Запуск: `docker compose --profile vector up -d` и в `.env` задать **`QDRANT_URL=http://qdrant:6333`** для сервиса `api`.
- **Проверка:** `GET /api/health` → поле **`vector`**: `enabled`, `ok`, при необходимости `detail`.

Индексация эмбеддингов и запросы к коллекциям — следующий шаг (отдельный модуль агента); контур URL + health уже есть.

## B3 / B4 — SKILL.md (изолированные навыки)

Добавлены каталоги:

| Skill | Назначение |
|-------|------------|
| `search-jobs` | Оркестрация поиска вакансий (ссылки на детальные skills). |
| `tailor-cv` | Адаптация резюме под роль/JD без выдумок. |
| `draft-cover-letter` | Короткое сопроводительное письмо по фактам CV/JD. |

Подключение к LLM-задачам: `app/api/ai/skills/loader.ts` — `job_match` и `cv_extract` включают эти skills в system appendix.

## B5 — MCP как инструменты

Серверные **tools** (HTTP job boards, web search по провайдеру) описаны в **`app/skills/agent-tools/SKILL.md`** и коде `app/api/agent/tools/`. Отдельный процесс **MCP stdio** (как в Cursor) в API пока не обязателен: тот же **контракт «инструмент → результат»** закрывается Express-агентом.

Расширение: вынести job boards в отдельный MCP-сервер и вызывать из worker — см. ADR `docs/adr/0004-swimlane-b-agent-harness.md`.

## B6 — Доставка skills в среды

- **Образ API:** `Dockerfile.api` копирует **`app/skills/`** в образ (`SKILLS_DIR=/app/skills`) — любой merge в `main` с изменением skills попадает в сборку CI → registry → GitOps (Swimlane A).
- **Проверка в CI:** job вызывает `scripts/verify-swimlane-b-skills.sh`.

## Связанные файлы

- `docker-compose.yml` — профиль `vector`, переменная `QDRANT_URL`
- `app/api/agent/vector-backend.ts` — health к Qdrant
- `scripts/verify-swimlane-b-skills.sh`
- `docs/adr/0004-swimlane-b-agent-harness.md`
