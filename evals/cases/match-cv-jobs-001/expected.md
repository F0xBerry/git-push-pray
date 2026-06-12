# Expected — CV ↔ jobs (fixture `match-cv-jobs-001`)

- The CV emphasizes **Kubernetes**, **Terraform**, **GitOps-style** work.
- Job 0 should rank **semantically closer** than job 1 (platform vs pure frontend).
- Automated runner uses **token overlap + title match** as a cheap proxy; LLM-as-judge can extend this (see `evals/runner/judge-llm.mjs` stub).
