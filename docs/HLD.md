# High-Level Design (HLD) — Scout engineering harness

> **Status:** draft — replace with your team's diagram and component list.

## System context

Scout is an AI job-search assistant. This repository implements the **platform harness**: build, deploy, evaluate, secure, and cost-control the agent — not the recruiting ML quality itself.

## Logical components

1. **Clients** — web or API consumers.
2. **`app/api`** — HTTP edge, authentication, rate limits.
3. **`app/worker`** — agent execution, tool calls, embeddings.
4. **`app/skills` + `app/prompts`** — versioned agent configuration.
5. **`platform/`** — Kubernetes manifests + GitOps.
6. **`evals/`** — quality and safety gates in CI.
7. **LLM gateway** — secrets, guardrails, routing (e.g. AgentGateway) — detailed in ADRs.

## Diagram

Embed your architecture diagram here (export PNG from draw.io / Excalidur, or link to Mermaid in README if your renderer supports it).

## Interfaces (fill in)

| From | To | Protocol | Notes |
|------|-----|----------|--------|
| API | Worker | queue / gRPC / HTTP | choose one |
| Worker | Vector DB | | embeddings + retrieval |
| Worker | MCP servers | MCP | job boards, etc. |
| Worker | LLM | HTTPS via gateway | provider-agnostic |
