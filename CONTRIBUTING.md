# Contributing

Thanks for helping improve Questionnaire.

## Development Setup

Clone the repository, then validate the skill package from the repository root:

```bash
skills-ref validate "$PWD"
python3 -m py_compile scripts/start-questionnaire.py scripts/validate-questionnaire-state.py
python3 scripts/start-questionnaire.py --help
python3 scripts/validate-questionnaire-state.py --help
python3 -m json.tool evals/evals.json >/dev/null
uv run --with-requirements requirements.txt python -c "import yaml; yaml.safe_load(open('references/ui-design-system.yaml'))"
npx skills add "$PWD" --list
```

If `skills-ref` is not installed, run the official reference implementation:

```bash
git clone --depth 1 https://github.com/agentskills/agentskills /tmp/agentskills
uv run --project /tmp/agentskills/skills-ref skills-ref validate "$PWD"
```

## Contribution Guidelines

- Keep the repository installable with `npx skills add srinitude/questionnaire`.
- Keep `SKILL.md` focused on the core workflow and non-obvious gotchas.
- Put long guidance, compliance notes, journey detail, and design tokens in `references/`.
- Keep the self-contained frontend in `assets/questionnaire-template.html`.
- Put deterministic repeated logic in `scripts/`.
- Preserve the `state.json` schema, generated run structure, and validator behavior.
- Avoid committing private screenshots, credentials, API keys, generated caches, local `.questionnaire/` runs, or proprietary questionnaire artifacts.

## Pull Requests

Before opening a pull request:

1. Run the validation commands above.
2. Update README or reference docs when behavior changes.
3. Keep commits focused and use clear commit messages.
4. Explain what changed, why it changed, and how it was validated.
