# High-Level Design (HLD) — Scout engineering harness

> **Status:** draft — replace with your team's diagram and component list.

## System context

Scout is an AI job-search assistant. This repository implements the **platform harness**: build, deploy, evaluate, secure, and cost-control the agent — not the recruiting ML quality itself.

## Logical components

1. **Clients** — web or API consumers.
2. **`app/api`** — HTTP edge, authentication, rate limits.
3. **`app/worker`** — agent execution, tool calls, embeddings.
4. **`app/skills` + `app/prompts`** — versioned agent configuration (Swimlane B: см. [`docs/swimlane-b-agent-harness.md`](../swimlane-b-agent-harness.md), ADR 0004).
5. **`platform/`** — Kubernetes manifests (Kustomize) и опционально Argo CD.
6. **`evals/`** — quality and safety gates in CI (Swimlane C: см. [`docs/swimlane-c-evals.md`](swimlane-c-evals.md)).
7. **LLM gateway** — secrets, guardrails, routing (e.g. AgentGateway) — detailed in ADRs.

## Diagram

См. топологию **abox + Scout**: [`docs/abox-and-scout-topology.md`](abox-and-scout-topology.md) (Mermaid + ADR `docs/adr/0003-abox-vs-scout-clusters.md`).

Вставь сюда экспорт из Excalidraw / draw.io при необходимости для слайдов.

## abox (hackathon sandbox)

Репозиторий [den-vasyliev/abox](https://github.com/den-vasyliev/abox): `make run` — локальный KinD с AgentGateway, kagent и платформенным стеком. Как совмещать со Scout из этого репо (Kustomize / Argo) — см. ссылку выше.

## Interfaces (fill in)

| From | To | Protocol | Notes |
|------|-----|----------|--------|
| API | Worker | queue / gRPC / HTTP | choose one |
| Worker | Vector DB | | embeddings + retrieval |
| Worker | MCP servers | MCP | job boards, etc. |
| Worker | LLM | HTTPS via gateway | provider-agnostic |
