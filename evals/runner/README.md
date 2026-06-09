# Eval runner

Place the CLI or scripts here, e.g. `python -m evals.runner` or `node evals/runner/index.js`.

Requirements:

- Deterministic enough for CI (pin judge model/version in config).
- Exit code `0` = pass; non-zero = fail gate.
- Print or upload a report (scores per axis) for PR visibility.
