# Questionnaire Journeys

## Journey: Agent-Guided Decision Session

| Attribute | Value |
|-----------|-------|
| Priority | Critical |
| User Type | User working with an agent |
| Frequency | Every invocation |
| Success Metric | A specific decision or next question is captured after each answer |

### User Goal

"I want the agent to interrogate my plan one decision at a time, keep the evidence visible, and leave behind useful project artifacts."

### Preconditions

- The agent is in a project directory or has `--project-dir`.
- The initializer has created `.questionnaire/<timestamp>/`.
- `state.json` contains an active question.

### Steps

1. Agent creates the run directory and opens `index.html` immediately.
2. Agent rewrites the starter question for the actual task.
3. User answers in chat or in the frontend.
4. Agent updates `state.json` and `transcript.md`.
5. Agent updates `CONTEXT.md`, `research/`, or `adrs/` only when the answer warrants it.
6. Agent validates state and asks the next question.

### Success Criteria

- The active question, recommendation, rationale, and answer type are visible.
- The decision trail and research/evidence rail update without hiding the active question.
- The user can export JSON and transcript from the browser.
- The filesystem state passes `scripts/validate-questionnaire-state.py`.

### Potential Friction

- The cwd is not a project root. Recovery: ask for `--project-dir`.
- The browser cannot write files. Recovery: use export/import and agent-managed files.
- The user answers vaguely. Recovery: ask a narrower follow-up with a recommended answer.

## Journey: Self-Serve Browser Review

| Attribute | Value |
|-----------|-------|
| Priority | High |
| User Type | User reviewing a run artifact |
| Frequency | Common |
| Success Metric | User can inspect, answer, import, and export without a server |

### User Goal

"I want to open the questionnaire artifact directly and understand what has been decided."

### Preconditions

- `index.html` exists in the run directory.
- A valid or partially valid `state.json` is available for import.

### Steps

1. User opens `index.html` through a `file://` URL.
2. User imports `state.json` or uses the embedded starter state.
3. User moves between `Question`, `Trail`, `Context`, and `Export` on mobile or scans the three-zone layout on desktop.
4. User edits an answer locally and exports JSON or transcript.

### Success Criteria

- No network or server is needed.
- Invalid JSON import is recoverable and does not erase current draft state.
- Mobile tabs prevent rail content from burying the active question.
- All controls remain keyboard and touch accessible.

### Potential Friction

- Imported state is missing keys. Recovery: show an inline error and keep current draft.
- Long answers overflow. Recovery: wrap text and keep panel scroll local to the page.
- File uploads cannot be persisted. Recovery: store file metadata and notes only.

## Journey: Research-Backed Branch

| Attribute | Value |
|-----------|-------|
| Priority | High |
| User Type | Agent and user |
| Frequency | When answers introduce external facts |
| Success Metric | Research changes or validates the next question |

### User Goal

"I want the agent to check outside facts when my answer depends on a standard, API, competitor, compliance rule, or fast-changing claim."

### Preconditions

- The user's answer introduced an external claim or dependency.
- Web search is available or the agent can record an unavailable research note.

### Steps

1. Agent identifies the external claim in the answer.
2. Agent searches when available.
3. Agent writes `research/<question-slug>.md` with sources, changed assumptions, and remaining uncertainty.
4. Agent updates `state.json.questions[].research_required` and `research_artifact`.
5. Agent asks the next question using the research result.

### Success Criteria

- Research is not run after purely subjective answers.
- Sources and uncertainty are visible in the research note.
- The next question changes because of the evidence or states that evidence did not alter the recommendation.

### Potential Friction

- Search is unavailable. Recovery: write `status: unavailable` and ask a conservative follow-up.
- Sources conflict. Recovery: ask a question that exposes which assumption matters.

## Journey: Hard Decision To ADR

| Attribute | Value |
|-----------|-------|
| Priority | Medium |
| User Type | Agent and future maintainers |
| Frequency | Only for hard-to-reverse decisions |
| Success Metric | The ADR explains why the decision was made and when to revisit it |

### User Goal

"I want important decisions to survive beyond the chat transcript."

### Preconditions

- The decision affects architecture, data model, security/privacy, external vendor/API, compliance, deployment/runtime, pricing/business model, or expensive UX flow.

### Steps

1. Agent classifies the decision as hard to reverse.
2. Agent creates the next numbered `adrs/000N-short-slug.md`.
3. Agent links the ADR in `state.json.adrs`.
4. Agent validates that the referenced ADR file exists.

### Success Criteria

- ADR includes Context, Question, Decision, Options Considered, Rationale, Consequences, Research Used, and Revisit Trigger.
- Minor preferences stay in `decisions` instead of becoming ADRs.

## Responsive Acceptance Checks

- At desktop width, show the active question as the dominant central panel, with rail content visible on both sides.
- Below 860px, collapse rails into tabs named `Question`, `Trail`, `Context`, and `Export`.
- Keep all touch targets at least 44px tall on mobile.
- Do not rely on hover for critical actions.
- Keep body copy readable at 200 percent browser zoom.
- Keep invalid import, empty state, long answer, and no-research states visible and recoverable.
