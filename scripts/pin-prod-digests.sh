#!/usr/bin/env bash
# Wrapper: updates prod overlay image digests (see scripts/pin_prod_digests.py).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec python3 "${ROOT}/scripts/pin_prod_digests.py" "$@"
