#!/usr/bin/env bash
# CI / local: every app/skills/*/SKILL.md — no obvious secrets, grounding hints, PII/data headers where required.
set -euo pipefail
shopt -s nullglob
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SKILL_GLOB=(app/skills/*/SKILL.md)
if ((${#SKILL_GLOB[@]} == 0)); then
  echo "no SKILL.md under app/skills/" >&2
  exit 1
fi

# Skills that must declare explicit boundaries (markdown ## Forbidden | Data handling | Security).
PII_SECTION_SKILLS=(
  draft-cover-letter
  tailor-cv
  cv-extraction
  job-analyzer
  job-crawler
  job-match-scoring
)

fail=0

# --- 1) Obvious secret / key material (fail if any match) ---
# Keep patterns conservative to avoid false positives on documentation.
SECRET_PATTERNS=(
  'sk-proj-[A-Za-z0-9_-]{20,}'
  'sk-(live|test)-[A-Za-z0-9]{20,}'
  'sk-ant-api[0-9]{2}-[A-Za-z0-9_-]{20,}'
  'AKIA[0-9A-Z]{16}'
  'ASIA[0-9A-Z]{16}'
  'AROA[0-9A-Z]{16}'
  'ghp_[A-Za-z0-9]{36,}'
  'github_pat_[A-Za-z0-9_]{20,}'
  'xox[baprs]-[0-9A-Za-z-]{20,}'
  'AIza[0-9A-Za-z_-]{35}'
  '-----BEGIN[[:space:]]+(RSA[[:space:]]+|EC[[:space:]]+|OPENSSH[[:space:]]+)?PRIVATE[[:space:]]+KEY-----'
)

scan_secrets() {
  local f=$1
  local p
  for p in "${SECRET_PATTERNS[@]}"; do
    if grep -Eq "$p" "$f" 2>/dev/null; then
      echo "SECURITY: possible secret / key material matches pattern in $f — remove or redact." >&2
      grep -En "$p" "$f" >&2 || true
      return 1
    fi
  done
  return 0
}

# --- 2) Grounding / untrusted data (every skill must align with tool- or schema-bound behavior) ---
grounding_ok() {
  local f=$1
  grep -Eiq \
    'never[[:space:]]+(fabricate|invent)|do[[:space:]]+not[[:space:]]+invent|from[[:space:]]+tool[[:space:]]+output|allow-list|guardrail|trusted[[:space:]]+text|omit[[:space:]]+fields[[:space:]]+that[[:space:]]+are[[:space:]]+truly[[:space:]]+unknown|output[[:space:]]+json[[:space:]]+only|verified[[:space:]]+listings|never[[:space:]]+invent[[:space:]]+listings|real[[:space:]]+`applyurl`|fetch_job_board|web_search_jobs' \
    "$f"
}

pii_section_ok() {
  local f=$1
  grep -Eiq '^##[[:space:]]+(forbidden|data handling|security)([[:space:]]|$)' "$f"
}

echo "skills security: scanning ${#SKILL_GLOB[@]} SKILL.md file(s)"

for f in "${SKILL_GLOB[@]}"; do
  [[ -f "$f" ]] || continue
  rel=${f#"$ROOT/"}
  if ! scan_secrets "$f"; then
    fail=1
    continue
  fi
  if ! grounding_ok "$f"; then
    echo "SECURITY: missing grounding / untrusted-data cues in $rel (add tool/schema bounds, never invent, etc.)." >&2
    fail=1
  fi
  dir=$(basename "$(dirname "$f")")
  for need in "${PII_SECTION_SKILLS[@]}"; do
    if [[ "$dir" == "$need" ]]; then
      if ! pii_section_ok "$f"; then
        echo "SECURITY: $rel must start a section ## Forbidden, ## Data handling, or ## Security (PII / governance)." >&2
        fail=1
      fi
      break
    fi
  done
done

if [[ "$fail" -ne 0 ]]; then
  echo "skills security: FAILED" >&2
  exit 1
fi
echo "skills security: OK"
