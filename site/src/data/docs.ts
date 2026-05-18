export interface DocPage {
  slug: string;
  title: string;
  summary: string;
  body: string[];
}

export const docs: DocPage[] = [
  {
    slug: "overview",
    title: "Overview",
    summary: "Questionnaire runs are guided, stateful conversations that produce decision-grade artifacts.",
    body: [
      "It keeps teams aligned, captures rationale, and accelerates high-quality decisions.",
    ],
  },
  {
    slug: "get-started",
    title: "Get started",
    summary: "Install the skill and start a project-local questionnaire run.",
    body: [
      "Install with npx skills add srinitude/questionnaire.",
      "Run python3 scripts/start-questionnaire.py from a project root, or pass --project-dir for non-interactive runs.",
      "The initializer creates a local run directory with a browser-ready index.html, state.json, transcript, glossary, research folder, and ADR folder.",
    ],
  },
  {
    slug: "artifact-model",
    title: "Artifact model",
    summary: "Understand the durable files created during a run.",
    body: [
      "state.json is the source of truth for run state, active question, answers, decisions, research links, and UI state.",
      "transcript.md records the human-readable interrogation trail.",
      "CONTEXT.md stores resolved glossary terms only.",
      "research/ captures source-backed checks when an answer depends on outside facts.",
      "adrs/ stores hard-to-reverse decisions with context, options, consequences, and revisit triggers.",
    ],
  },
  {
    slug: "state-schema",
    title: "State schema",
    summary: "Use the same shape in the browser, exports, and agent-managed files.",
    body: [
      "Top-level keys are run, project, current_question, questions, decisions, glossary, research, adrs, exports, and ui.",
      "Every question includes id, status, prompt, recommended_answer, why_it_matters, answer_type, options, user_answer, research fields, follow_up_logic, and created_at.",
      "The browser can import and export this shape, while the agent validates and writes the project-local file.",
    ],
  },
  {
    slug: "question-types",
    title: "Question types",
    summary: "Pick answer controls that match the decision pressure.",
    body: [
      "Supported types include freeform, single_choice, multi_choice, ranked_choice, scale, yes_no, file_upload, matrix, and branching.",
      "Use single-choice when one direction must win, multi-choice when several constraints apply, and freeform when premature options would hide important context.",
      "File upload questions should capture metadata in the browser and let the agent use local files or attachments as model context.",
    ],
  },
  {
    slug: "agent-workflow",
    title: "Agent workflow",
    summary: "Ask one firm question at a time and update artifacts after every answer.",
    body: [
      "The agent inspects the project before asking anything that local files can answer.",
      "Each question includes a recommended answer and a reason it matters.",
      "After each answer, the agent updates state, transcript, glossary, research, or ADRs when warranted, then validates the state before continuing.",
    ],
  },
  {
    slug: "browser-demo-boundaries",
    title: "Browser demo boundaries",
    summary: "Separate local browser drafting from durable filesystem writes.",
    body: [
      "The public demo runs entirely in the visitor's browser.",
      "localStorage preserves drafts for recovery, and reset clears the browser copy.",
      "Import, validation, JSON export, and transcript export are explicit visitor actions.",
      "The real skill still relies on the agent to write files into the project run directory.",
    ],
  },
  {
    slug: "validation",
    title: "Validation",
    summary: "Keep state files and skill packages mechanically checkable.",
    body: [
      "Run python3 scripts/validate-questionnaire-state.py path/to/state.json to validate a generated run.",
      "Validate the skill package with skills-ref validate when available.",
      "Validate scripts with python3 -m py_compile and keep JSON/YAML resources parser-clean.",
    ],
  },
  {
    slug: "security-privacy",
    title: "Security/privacy",
    summary: "Protect local project context and browser drafts.",
    body: [
      "The public demo does not upload draft answers.",
      "Do not paste secrets, credentials, private screenshots, or proprietary artifacts into public issue reports.",
      "Use explicit export when you want to move browser state into a real project run.",
    ],
  },
  {
    slug: "contributing",
    title: "Contributing",
    summary: "Keep changes focused on the portable skill package and its docs.",
    body: [
      "Change SKILL.md for runbook behavior, references/ for long-form guidance, assets/ for the standalone frontend, and scripts/ for deterministic automation.",
      "Keep public docs concise and original.",
      "Run validation before opening a pull request.",
    ],
  },
];

export function findDoc(slug: string): DocPage | undefined {
  return docs.find((doc) => doc.slug === slug);
}
