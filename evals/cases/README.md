# Evaluation cases

Each subdirectory is one scenario, for example:

```
cases/match-cv-jobs-001/
  cv.txt
  jobs.json
  expected.md
```

The runner loads these, calls the agent (or a test harness), and compares outputs to expectations.
