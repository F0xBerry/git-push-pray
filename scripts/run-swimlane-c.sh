#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
node evals/runner/run.mjs
node evals/runner/judge-llm.mjs
cd app/api && npm run typecheck && npm run test
