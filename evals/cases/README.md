# Evaluation cases

Each subdirectory is one scenario with **`meta.json`**:

```json
{
  "id": "match-cv-jobs-001",
  "type": "match_cv_jobs",
  "baselineKey": "match_cv_jobs"
}
```

Supported **`type`** values are implemented in `../runner/run.mjs`.

Example layout:

```
cases/match-cv-jobs-001/
  meta.json
  cv.txt
  jobs.json
  expected.md
```

Cover letter case adds `cv_ref.txt`, `job_snippet.txt`, `letter.txt`, plus `forbiddenPhrases` in `meta.json`.
