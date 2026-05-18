# Agent Skills Compliance Notes

Source refresh performed during package creation:

- `https://agentskills.io/` mapped with sitemap included and query parameters ignored.
- `https://agentskills.io/llms.txt` consulted as the canonical docs index.
- `https://agentskills.io/specification` consulted for package shape and frontmatter expectations.

Package implications:

- The skill root contains `SKILL.md`.
- `SKILL.md` starts with YAML frontmatter and uses `name` plus `description`.
- The parent directory and frontmatter name both use `questionnaire`.
- Runtime helpers live under `scripts/`.
- Long workflow and token references live under `references/`.
- The reusable frontend template lives under `assets/`.
- Codex UI metadata lives under `agents/openai.yaml`.

Validation expectations:

- Run `skills-ref validate <skill-root>` when `skills-ref` is available.
- If unavailable, use the local `writing-skills/scripts/quick_validate.py` fallback or the official reference validator from a fresh `agentskills/agentskills` clone.
- Validate Python scripts with `python3 -m py_compile` and `--help`.
- Validate `references/ui-design-system.yaml` with the visual design-system YAML validator.
- Validate generated run state with `scripts/validate-questionnaire-state.py`.
