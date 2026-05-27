# Question Generation Primitives

Use these lenses when the next question is not obvious, the user gives a vague answer, a branch is stuck, or the plan needs sharper evidence.

This reference adapts three families of ideas:

- domain-glossary interrogation: challenge terms against project language and docs
- structured research ideation: diverge, converge, and refine toward defensible questions
- creative research thinking: use analogy, inversion, constraints, abstraction, and contradiction to escape shallow questions

When a local `creative-thinking-for-research` skill or equivalent capability is available, use it before asking questions that require non-obvious probes, domain reframing, novel research directions, or synthesis across conflicting constraints.

## Question Loop

1. Inspect first. If the answer can be found in project files, docs, code, or existing `.questionnaire` artifacts, read those before asking.
2. Identify what the current answer changed: term, dependency, risk, decision, assumption, or branch.
3. Choose one lens from this reference. Do not combine many lenses into a multi-part question.
4. Ask one question. Include a recommended answer and why it matters.
5. Update `state.json`, `transcript.md`, `CONTEXT.md`, research notes, and ADRs as applicable.
6. Validate state before the next question.

## Glossary And Domain Lenses

Use when the user uses domain words that could mean more than one thing.

- Glossary conflict: compare the user's word against `CONTEXT.md`. If a term conflicts, ask which meaning is canonical.
- Canonical naming: propose one precise term when the user says "account", "project", "workspace", "agent", "run", "thread", "source", or another overloaded noun.
- Boundary scenario: invent one concrete scenario that exposes whether two concepts are distinct.
- Code/doc check: if the user states how a system works, inspect code and docs before accepting it.
- Lazy glossary capture: update `CONTEXT.md` only when a term is resolved. Keep it as a glossary, not a spec.

Question form:

```text
You used [term]. In this project should that mean [A] or [B]? Recommended answer: [A], because [reason].
```

## Research-Aware Lenses

Use when the answer introduces a factual claim, external dependency, product category, API, standard, domain term, competitor, compliance issue, or design reference.

- What changed: ask whether recent tooling, regulation, model capability, pricing, platform rules, or user behavior changes the decision.
- Evidence gap: ask what source would change the recommendation.
- Boundary probe: ask where the proposed approach breaks: scale, latency, data quality, adversarial input, permissions, offline mode, or handoff.
- Simplicity test: ask what can be removed while preserving the outcome.
- Stakeholder rotation: ask the same decision from end user, developer, operator, adversary, regulator, and maintainer perspectives.
- Two-sentence clarity: force the user to state the problem and insight in two short sentences when a plan stays fuzzy.

When web search is available and relevant, search before the next question and write `research/<question-slug>.md` with sources, what changed, and remaining uncertainty. When search is unavailable, write the same artifact with `status: unavailable`.

## Creative Lenses

Use sparingly, when a normal clarifying question would only collect more surface detail.

- Problem reformulation: restate the problem by changing the objective, actor, timescale, granularity, or formalism.
- Structural analogy: strip away domain nouns and ask where the same relationship appears in another field.
- Constraint manipulation: list hard, soft, and hidden constraints, then ask which soft constraint can be relaxed, tightened, or replaced.
- Inversion: negate a standard assumption and ask whether the opposite creates a better design.
- Abstraction ladder: move up to a general principle, down to an extreme concrete case, or sideways to an adjacent domain.
- Adjacent possible: ask what has recently become possible that changes the option set.
- Contradiction synthesis: when two goals seem opposed, ask whether the tradeoff is fundamental or an artifact of the current framing.
- Composition/decomposition: combine two existing primitives or split a tangled concept into smaller pieces.

Question form:

```text
If we invert the assumption that [assumption], what decision would change first? Recommended answer: [answer], because [reason].
```

## Decision Pressure Lenses

Use when an answer appears decisive but may be too weak to implement.

- Reversibility: ask how expensive it is to change later.
- Consequence: ask what breaks if the decision is wrong.
- Migration: ask how users or data move from old to new behavior.
- Accountability: ask who owns the decision and who pays the operational cost.
- Failure recovery: ask what the user sees when the happy path fails.
- Measurability: ask how the team will know the decision worked.

Create an ADR only when a decision is hard to reverse, surprising without context, and the result of a genuine tradeoff.

## Answer-Type Selection

- `freeform`: use for first-pass framing, ambiguous domains, or sensitive tradeoffs.
- `single_choice`: use when one option must win.
- `multi_choice`: use when several constraints or surfaces can apply.
- `ranked_choice`: use when priority order matters.
- `scale`: use for confidence, risk tolerance, or intensity.
- `yes_no`: use for a true binary decision.
- `file_upload`: use when local files, screenshots, diagrams, docs, or multimodal resources should become model context.
- `matrix`: use when comparing options across criteria.
- `branching`: use when an answer should route to a known follow-up path.

## Quality Bar

A good next question is:

- single-purpose
- specific enough to answer now
- grounded in current artifacts or research
- paired with a recommended answer
- clear about why it matters
- able to change the next artifact or decision

A bad next question:

- asks several things at once
- repeats a question already answered
- asks for information present in the repo
- collects preferences without affecting the plan
- hides a major tradeoff behind a yes/no prompt
