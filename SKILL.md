---
name: questionnaire
description: Use when the user wants a guided decision questionnaire, setup interview, plan stress-test, structured intake, or docs-aware decision workflow. Creates a run-scoped browser-ready questionnaire frontend plus state, transcript, glossary, research notes, and ADR artifacts while asking one firm, evidence-aware question at a time.
compatibility: Requires Python 3.9+ for bundled scripts. Web search is optional but should be used when available and relevant.
---

# Questionnaire

## Goal

Run a firm but productive questionnaire session that turns vague plans into specific decisions, while keeping all evidence and decisions in project-local artifacts.

The skill creates a run directory at:

```text
$CURRENT_PROJECT_DIR/.questionnaire/<YYYY-MM-DD:HH-MM-SS>/
```

Each run contains a copied browser-ready frontend (`index.html`), the source-of-truth `state.json`, `transcript.md`, `CONTEXT.md`, `research/`, and `adrs/`.

## Runtime Contract

- Ask one question at a time.
- Include a recommended answer with every question.
- Explain why the question matters.
- Press on vague answers until the decision is specific enough to implement or document.
- Use multiple-choice questions with a custom option when the choice set is clear.
- Use freeform questions when premature options would hide important context.
- Use research-thinking lenses when the next question needs a non-obvious probe, analogy, contradiction check, boundary case, stakeholder rotation, or problem reframing.
- Use web search after an answer only when the answer introduces an external dependency, factual claim, standard, API/library, competitor, design reference, compliance issue, domain term, or unclear technical constraint.
- If web search is unavailable, still write a research note with `status: unavailable`, the unresolved claim, what should be checked later, and how uncertainty affects the next question.
- Update files after every answer. Do not leave the UI, transcript, glossary, and state out of sync.

## Invocation Flow

1. Run the initializer from this skill directory:

```bash
python3 scripts/start-questionnaire.py
```

Use `--project-dir <path>` when the intended project root is not the current working directory. Use `--open` or `--no-open` for non-interactive runs.

2. Rewrite the starter question in `state.json` for the user's actual task before presenting it.
3. Present the active question in chat and optionally point to the generated `index.html`.
4. After each answer, update `state.json` and append to `transcript.md`.
5. If the answer creates reusable terminology, update `CONTEXT.md`.
6. If the answer introduces external facts or constraints, search when possible and write `research/<question-slug>.md`.
7. If the answer creates a hard-to-reverse decision, write an ADR in `adrs/`.
8. Validate the state:

```bash
python3 scripts/validate-questionnaire-state.py <run-dir>/state.json
```

9. Ask the next question.

## Project Root Resolution

The initializer resolves `$CURRENT_PROJECT_DIR` from the invocation cwd by default. Treat the cwd as the project root only when it contains at least one root marker:

- `.git`
- `package.json`
- `pyproject.toml`
- `Cargo.toml`
- `go.mod`
- `app/`
- `docs/`

If no marker exists, ask the user for the intended project directory before creating `.questionnaire/`. In non-interactive runs, fail with a clear error unless `--project-dir` is supplied.

## State Schema

`state.json` is the source of truth. The frontend imports, edits, and exports JSON, but it does not write to the filesystem.

Top-level keys:

```text
run, project, current_question, questions, decisions, glossary, research, adrs, exports, ui
```

Every question must include:

```text
id, status, prompt, recommended_answer, why_it_matters, answer_type, options,
custom_option_enabled, user_answer, research_required, research_artifact,
follow_up_logic, created_at
```

Supported `answer_type` values:

```text
freeform, single_choice, multi_choice, ranked_choice, scale, yes_no,
file_upload, matrix, branching
```

For file uploads, capture client-side inventory only: file name, MIME type, size, optional preview metadata, and notes. The agent must use local file paths or user-provided attachments as model context; the HTML must not attempt filesystem writes.

For branching, keep `follow_up_logic` shallow and declarative. Each rule should use:

```text
when, operator, value, next_question_id, note
```

The HTML may route to an existing target question. The agent remains responsible for creating new branch questions.

## Question Generation

Read `references/question-generation-primitives.md` when the user is vague, the plan is strategic, the domain is unfamiliar, or the next question is not obvious.

Prefer questions that test one of these:

- Term clarity: overloaded words, fuzzy nouns, conflicting glossary terms.
- Scenario pressure: edge cases, failure paths, real actors, concrete examples.
- Dependency pressure: external systems, standards, APIs, compliance, runtime constraints.
- Tradeoff pressure: cost, speed, reversibility, safety, UX complexity, operational burden.
- Research pressure: what has changed, what evidence is missing, what assumption may be stale.
- Creative pressure: analogy, inversion, constraint manipulation, abstraction movement, stakeholder rotation.

Do not ask a question that can be answered by inspecting the project. Explore the project instead, then ask the next unresolved question.

## Glossary And ADRs

`CONTEXT.md` is a glossary only. It must define domain terms without implementation details, scratch notes, or decisions.

Create an ADR only for hard-to-reverse decisions such as architecture, data model, security/privacy, external vendor/API, compliance, deployment/runtime, pricing/business model, or UX flow choices that would be expensive to unwind.

ADR files live under `adrs/` as:

```text
0001-short-slug.md
```

Use these sections:

```text
Context
Question
Decision
Options Considered
Rationale
Consequences
Research Used
Revisit Trigger
```

## Frontend Artifact

The canonical template is `assets/questionnaire-template.html`. On each invocation, copy it to the run directory as `index.html`.

The frontend must remain:

- self-contained HTML/CSS/JS
- usable under `file://`
- free of CDNs, external images, external fonts, and server requirements
- responsive with desktop zones for question, evidence/trail, and context/export
- mobile-collapsed into `Question`, `Trail`, `Context`, and `Export`

Use `references/ui-design-system.yaml` as the visual token source and `references/questionnaire-journeys.md` for flow expectations.

## Support Files

- `assets/questionnaire-template.html`: standalone questionnaire frontend.
- `references/ui-design-system.yaml`: visual tokens and implementation notes.
- `references/questionnaire-journeys.md`: critical journeys, recovery paths, and UX acceptance checks.
- `references/question-generation-primitives.md`: question-generation lenses and research-aware probes.
- `scripts/start-questionnaire.py`: creates run directories and starter files.
- `scripts/validate-questionnaire-state.py`: validates `state.json` shape and file references.
- `evals/evals.json`: compact trigger boundary evals.
