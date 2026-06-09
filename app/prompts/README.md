# `app/prompts` — versioned prompts & model config

Store system prompts, model names, temperature, and safety preambles as files (YAML/JSON/Markdown).

- Changes go through **PR + CI + evals gate** like code.
- Keep **PII out of committed secrets**; use placeholders and runtime injection where needed.
