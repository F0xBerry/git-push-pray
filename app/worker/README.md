# `app/worker` — background worker

Long-running or queued work: agent loops, embeddings, tool calls to MCP servers.

**Contract:** share types/config with `app/api` via a small internal package or duplicated OpenAPI — pick one convention for the team.
