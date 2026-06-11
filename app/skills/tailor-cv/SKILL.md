# Tailor CV

> Swimlane B — **resume adaptation** for a target role or job description without inventing experience.

## Inputs

- Parsed CV fields (from `cv-extraction`) or raw resume text.
- Target: job posting URL/snippet **or** role title + seniority + domain.

## Behavior

1. Map **evidence-backed** bullets from the CV to the target; mark gaps honestly (“not evidenced in CV”).
2. Prefer **action + metric** phrasing when the source material supports it; do not invent metrics.
3. Normalize terminology (e.g. “K8s” ↔ “Kubernetes”) only when the CV implies it.
4. Output: sections `summary`, `highlights[]`, `keyword_bridge[]` (terms from JD mirrored only if supported by CV).
5. Keep total length within typical ATS-friendly bounds unless user asks otherwise.

## Forbidden

- New employers, dates, certifications, or degrees not present in the source.
- Discriminatory filtering (age, nationality, etc.).
