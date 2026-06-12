#!/usr/bin/env node
/**
 * Stub for C3 — LLM-as-judge (optional). When EVALS_LLM_JUDGE=1 and keys exist,
 * extend this to call your provider and merge scores into CI artifacts.
 * Default: no-op success so CI stays green without secrets.
 */
if (process.env.EVALS_LLM_JUDGE === '1') {
  console.warn('[evals] EVALS_LLM_JUDGE=1 but judge not implemented — skipping');
}
process.exit(0);
