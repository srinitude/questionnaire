# Questionnaire

[![skills.sh compatible](https://img.shields.io/badge/skills.sh-compatible-111111?style=flat-square)](https://skills.sh/s/srinitude/questionnaire)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![Validate](https://github.com/srinitude/questionnaire/actions/workflows/validate.yml/badge.svg)](https://github.com/srinitude/questionnaire/actions/workflows/validate.yml)

A portable Agent Skills package for running evidence-aware decision questionnaires. It creates a run-scoped browser-ready frontend, `state.json`, transcript, glossary, research notes, and ADR artifacts while an agent asks one firm, recommended-answer question at a time.

Website: [questionnaire.dev](https://questionnaire.dev)

## Install

```bash
npx skills add srinitude/questionnaire
```

To preview the skills exposed by this repository:

```bash
npx skills add srinitude/questionnaire --list
```

## Use Cases

- Run a guided setup interview for a product, architecture, research, or design decision.
- Turn a vague plan into a structured intake with a durable transcript and state file.
- Keep a browser-ready questionnaire artifact beside project-local docs.
- Capture glossary terms, research notes, and hard-to-reverse decisions as ADRs.
- Support freeform, choice, ranked, scale, yes/no, file metadata, matrix, and branching questions.

## Package Structure

```text
.
├── SKILL.md
├── agents/
│   └── openai.yaml
├── assets/
│   └── questionnaire-template.html
├── evals/
│   └── evals.json
├── references/
│   ├── agent-skills-compliance.md
│   ├── question-generation-primitives.md
│   ├── questionnaire-journeys.md
│   └── ui-design-system.yaml
├── requirements.txt
└── scripts/
    ├── start-questionnaire.py
    └── validate-questionnaire-state.py
```

## Usage

From a project root:

```bash
python3 scripts/start-questionnaire.py
```

For non-interactive agent or test runs:

```bash
python3 scripts/start-questionnaire.py \
  --project-dir /path/to/project \
  --timestamp 2026-05-18:09-30-00 \
  --no-open
```

The initializer creates:

```text
.questionnaire/<YYYY-MM-DD:HH-MM-SS>/
├── CONTEXT.md
├── adrs/
├── index.html
├── research/
├── state.json
└── transcript.md
```

`state.json` is the source of truth. The browser frontend can import/export JSON and keep a local draft, but filesystem writes are handled by the agent.

## Validation

Validate the skill package:

```bash
skills-ref validate "$PWD"
```

If `skills-ref` is not installed:

```bash
git clone --depth 1 https://github.com/agentskills/agentskills /tmp/agentskills
uv run --project /tmp/agentskills/skills-ref skills-ref validate "$PWD"
```

Validate the bundled scripts and resources:

```bash
python3 -m py_compile scripts/start-questionnaire.py scripts/validate-questionnaire-state.py
python3 scripts/start-questionnaire.py --help
python3 scripts/validate-questionnaire-state.py --help
python3 -m json.tool evals/evals.json >/dev/null
uv run --with-requirements requirements.txt python -c "import yaml; yaml.safe_load(open('references/ui-design-system.yaml'))"
```

Validate a generated run state:

```bash
python3 scripts/validate-questionnaire-state.py path/to/.questionnaire/<timestamp>/state.json
```

The same checks run in GitHub Actions for pushes and pull requests.

## Requirements

- Python 3.9 or newer.
- PyYAML for repository YAML validation, installed from `requirements.txt`, through `uv`, or through an existing Python environment.

The runtime scripts themselves use only the Python standard library.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

Please keep changes focused on the portable skill package: update `SKILL.md` for runbook behavior, `references/` for long-form guidance and design tokens, `assets/` for the frontend template, and `scripts/` for deterministic automation or validation.

## Security

Report security concerns using the guidance in [SECURITY.md](SECURITY.md). Do not include secrets, private screenshots, credentials, local project files, or proprietary questionnaire artifacts in public issues.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
