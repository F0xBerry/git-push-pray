#!/usr/bin/env bash
# CI / local: Swimlane B — required SKILL.md files exist (B3/B4 + harness deps).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
for s in search-jobs tailor-cv draft-cover-letter job-search cv-extraction agent-tools structured-output; do
  f="app/skills/$s/SKILL.md"
  if [[ ! -f "$f" ]]; then
    echo "missing: $f" >&2
    exit 1
  fi
done
bash "$ROOT/scripts/verify-skills-security.sh"
echo "swimlane-b skills OK"
