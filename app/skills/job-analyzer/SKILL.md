# Job application analyzer

> Adapted from [job-search-skills/job-analyzer](https://github.com/sameergdogg/job-search-skills/blob/main/job-analyzer/SKILL.md). When CV data is present, assess fit and surface gaps alongside ranked results.

## Data handling

- Treat CV uploads and parsed fields as **PII**: use them only for ranking, tags, and short `rationale` inside the response schema; do not dump full raw CV text unless the user explicitly asked.
- **Never invent** employers, dates, or credentials to improve a match score.

## When CV data is provided

The user block may include `CV summary`, `CV skills`, and structured experience from upload. Use it for ranking and rationale — do not invent employers or dates.

## Compatibility indicators (embed in rationale or tags)

For each ranked job, mentally assess:

- ✅ **STRONG** — direct match in CV
- ⚠️ **PARTIAL** — adjacent experience
- ❌ **GAP** — required skill missing from CV

Prefer tags that name concrete skills (e.g. `Terraform`, `On-call`) over vague labels.

## Resume philosophy (for suggestions)

When generating `suggestions` (follow-up search queries), avoid keyword stuffing. Suggest queries that:

- Target roles where the user's **proven** skills overlap
- Explore adjacent titles (Tier 2) when direct matches are thin
- Adjust seniority or remote/hybrid filters

Do **not** output full cover letters or resume rewrites in the JSON — only `jobs`, `suggestions`, and structured fields in the schema.

## Surgical fit notes

In `rationale`, call out:

- One strength tied to a CV skill or achievement theme
- One gap or stretch (if any) in plain language

## Honesty

"Strong fit for X, but Y is a gap" is more useful than uniform high scores. Never fabricate experience to justify a match.

## Company research

Do not add extra JSON fields for company research. If compensation is unknown, use public-data `salaryEstimate` with an "estimate" note per the job-search skill.
