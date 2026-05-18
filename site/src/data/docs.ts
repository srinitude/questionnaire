export interface DocPage {
  slug: string;
  title: string;
  summary: string;
  body: string[];
  sections?: Array<{
    title: string;
    body?: string[];
    bullets?: string[];
    code?: {
      label: string;
      source: string;
    };
  }>;
}

export const docs: DocPage[] = [
  {
    slug: "overview",
    title: "Overview",
    summary: "Questionnaire runs are guided, stateful conversations that produce decision-grade artifacts.",
    body: [
      "It keeps teams aligned, captures rationale, and accelerates high-quality decisions.",
    ],
    sections: [
      {
        title: "When to use it",
        body: [
          "Use Questionnaire when a decision has enough ambiguity, consequence, or stakeholder context that a normal chat thread would lose the trail.",
        ],
        bullets: [
          "Architecture choices where constraints and reversibility matter.",
          "Product or research decisions that need evidence and rationale.",
          "Setup interviews where the agent should keep asking until the plan is specific.",
          "Team handoffs where transcript, context, and ADR files must survive the session.",
        ],
      },
      {
        title: "What the browser proves",
        body: [
          "The homepage demo uses the same state shape as a real run. It can autosave, validate, import, export JSON, and export a transcript without claiming browser access to your filesystem.",
        ],
      },
    ],
  },
  {
    slug: "get-started",
    title: "Get started",
    summary: "Install the skill and start a project-local questionnaire run.",
    body: [
      "A run starts in a real project directory and creates artifacts under .questionnaire/<timestamp>/.",
    ],
    sections: [
      {
        title: "Install",
        body: [
          "Install the skill from the public repository, then invoke it from the project you want the artifacts to describe.",
        ],
        code: {
          label: "install",
          source: "npx skills add srinitude/questionnaire",
        },
      },
      {
        title: "Start a run",
        body: [
          "Run the initializer from a project root. It creates the run directory, copies the standalone HTML, writes the first state.json, and opens index.html in your default browser.",
        ],
        code: {
          label: "start",
          source: "python3 scripts/start-questionnaire.py\npython3 scripts/start-questionnaire.py --project-dir /path/to/project",
        },
      },
      {
        title: "Answer the first question",
        body: [
          "The agent rewrites the starter question for the actual task, presents one question with a recommended answer, and explains why the question matters.",
          "You can answer in chat or edit the local browser draft. The durable project files are still written by the agent.",
        ],
      },
      {
        title: "Keep the run moving",
        bullets: [
          "After each answer, state.json and transcript.md are updated.",
          "CONTEXT.md changes only when a reusable term needs a definition.",
          "research/ changes only when an external claim, dependency, or uncertainty needs evidence.",
          "adrs/ changes only when the answer creates a hard-to-reverse decision.",
        ],
      },
    ],
  },
  {
    slug: "artifact-model",
    title: "Artifact model",
    summary: "Understand the durable files created during a run.",
    body: [
      "The run directory is the core promise of Questionnaire: each conversation leaves a small, reviewable set of files.",
    ],
    sections: [
      {
        title: "Run directory",
        body: [
          "Every run lives under .questionnaire/<timestamp>/. The browser can read and export drafts, but the agent is responsible for writing durable files into that directory.",
        ],
        code: {
          label: "directory",
          source: ".questionnaire/2026-05-18:12-00-00/\n  index.html\n  state.json\n  transcript.md\n  CONTEXT.md\n  research/\n  adrs/",
        },
      },
      {
        title: "state.json",
        body: [
          "The source of truth for run status, active question, answers, decisions, research references, ADR references, exports, and UI state.",
        ],
      },
      {
        title: "transcript.md",
        body: [
          "The human-readable trail. It should capture the question, the recommended answer, the user's answer, and the decision that resulted.",
        ],
      },
      {
        title: "CONTEXT.md",
        body: [
          "A glossary only. Use it for terms the agent and user will reuse, not scratch notes, hidden reasoning, or implementation decisions.",
        ],
      },
      {
        title: "research/",
        body: [
          "Research notes hold source-backed checks when an answer depends on an external fact, standard, API, competitor, compliance issue, or changing dependency.",
        ],
      },
      {
        title: "adrs/",
        body: [
          "ADR files record hard-to-reverse decisions with context, options considered, consequences, and revisit triggers.",
        ],
      },
    ],
  },
  {
    slug: "state-schema",
    title: "State schema",
    summary: "Use the same shape in the browser, exports, and agent-managed files.",
    body: [
      "state.json is intentionally explicit so a run can resume, validate, export, and recover without guessing.",
    ],
    sections: [
      {
        title: "Top-level keys",
        bullets: [
          "run: run id, creation time, run directory, index path, and status.",
          "project: project root, display name, and detected root markers.",
          "current_question: the id of the one active question.",
          "questions: ordered question objects, including answers and routing hints.",
          "decisions: normalized decisions captured from answered questions.",
          "glossary: reusable terms for CONTEXT.md.",
          "research: research artifacts and summaries.",
          "adrs: ADR references and titles.",
          "exports: filenames for transcript, context, and state.",
          "ui: browser layout, active tab, theme, and local draft settings.",
        ],
      },
      {
        title: "Question object",
        body: [
          "Every question is self-contained. The frontend can render it, the agent can update it, and the validator can check that required fields exist.",
        ],
        code: {
          label: "question",
          source: `{
  "id": "q-problem-definition",
  "status": "active",
  "prompt": "What is the core problem we are trying to solve?",
  "recommended_answer": "We lack a repeatable context-to-artifact process.",
  "why_it_matters": "The root problem anchors every downstream decision.",
  "answer_type": "freeform",
  "options": [],
  "custom_option_enabled": true,
  "user_answer": "",
  "research_required": false,
  "research_artifact": "",
  "follow_up_logic": [],
  "created_at": "2026-05-18:12-00-00"
}`,
        },
      },
      {
        title: "Recovery model",
        body: [
          "If the browser draft is lost, state.json remains the durable source. If state.json is exported from the browser, the agent can import it, validate it, and write it back into the project run directory.",
        ],
      },
    ],
  },
  {
    slug: "question-types",
    title: "Question types",
    summary: "Pick answer controls that match the decision pressure.",
    body: [
      "Answer types are rendering hints and pressure tools. The agent still decides what question should come next.",
    ],
    sections: [
      {
        title: "Supported types",
        bullets: [
          "freeform: use when premature options would hide important context.",
          "single_choice: use when one direction must win.",
          "multi_choice: use when several constraints or concerns can apply.",
          "ranked_choice: use when options need explicit ordering.",
          "scale: use for confidence, urgency, severity, or fit.",
          "yes_no: use for binary gates that truly branch the run.",
          "file_upload: use for browser-side file metadata, not filesystem writes.",
          "matrix: use when multiple options need the same criteria.",
          "branching: use shallow declarative rules for existing next questions.",
        ],
      },
      {
        title: "Recommended answer rule",
        body: [
          "Every question must include a recommended answer. The recommendation gives the user something concrete to accept, edit, or reject, and it exposes the agent's current interpretation.",
        ],
      },
      {
        title: "Branching rule",
        body: [
          "Branching should stay shallow. A browser route may choose an existing next_question_id, but the agent remains responsible for creating new questions and keeping state coherent.",
        ],
      },
    ],
  },
  {
    slug: "agent-workflow",
    title: "Agent workflow",
    summary: "Ask one firm question at a time and update artifacts after every answer.",
    body: [
      "Questionnaire is agent-led. The browser helps draft and inspect state, but the agent keeps the run honest and durable.",
    ],
    sections: [
      {
        title: "Before asking",
        bullets: [
          "Inspect the project when local files can answer part of the question.",
          "Rewrite the starter question for the user's actual task.",
          "Choose the smallest question that can move the decision forward.",
          "Include a recommended answer and why the question matters.",
        ],
      },
      {
        title: "After each answer",
        bullets: [
          "Update state.json immediately.",
          "Append the question, recommendation, answer, and decision to transcript.md.",
          "Update CONTEXT.md only for reusable terms.",
          "Add research notes for external facts, standards, APIs, compliance issues, competitors, or changing dependencies.",
          "Write an ADR when the answer creates an architecture, data model, privacy, vendor, deployment, pricing, or UX-flow decision that is expensive to unwind.",
        ],
      },
      {
        title: "Question quality",
        body: [
          "Do not ask what the project already reveals. Do not accept vague answers when implementation depends on specificity. Press until the answer can become a decision, constraint, option, or next question.",
        ],
      },
      {
        title: "Validation loop",
        code: {
          label: "validate",
          source: "python3 scripts/validate-questionnaire-state.py .questionnaire/<timestamp>/state.json",
        },
      },
    ],
  },
  {
    slug: "browser-demo-boundaries",
    title: "Browser demo boundaries",
    summary: "Separate local browser drafting from durable filesystem writes.",
    body: [
      "The public demo is intentionally real about what the browser can and cannot do.",
    ],
    sections: [
      {
        title: "What happens in the browser",
        bullets: [
          "Seeded adoption questions load immediately.",
          "Answers autosave to localStorage for recovery.",
          "Import validates a state.json-shaped file before replacing the draft.",
          "JSON export downloads the current state.",
          "Transcript export downloads a Markdown transcript derived from answered questions.",
          "Reset clears the browser draft and returns to the seed run.",
        ],
      },
      {
        title: "What does not happen in the browser",
        bullets: [
          "No project files are written by browser JavaScript.",
          "No answers leave the browser unless the visitor explicitly exports or shares them.",
          "No server is required to draft, validate, import, or export demo state.",
          "No uploaded file content is treated as durable project context.",
        ],
      },
      {
        title: "Why the boundary matters",
        body: [
          "The real skill runs with an agent that can write local project files. The website demonstrates the state and artifact loop without pretending a public webpage can safely mutate a visitor's filesystem.",
        ],
      },
    ],
  },
  {
    slug: "validation",
    title: "Validation",
    summary: "Keep state files and skill packages mechanically checkable.",
    body: [
      "Validation keeps the run resumable and keeps the skill package portable.",
    ],
    sections: [
      {
        title: "State validation",
        body: [
          "Validate generated or imported state before treating it as the durable run source.",
        ],
        code: {
          label: "state",
          source: "python3 scripts/validate-questionnaire-state.py path/to/state.json",
        },
      },
      {
        title: "Script validation",
        body: [
          "Python helpers should compile cleanly before publishing or installing the skill.",
        ],
        code: {
          label: "scripts",
          source: "python3 -m py_compile scripts/start-questionnaire.py scripts/validate-questionnaire-state.py",
        },
      },
      {
        title: "Skill package validation",
        body: [
          "Use the official skills-ref validator when available. If it is unavailable, keep local checks honest and state which validation was skipped.",
        ],
        code: {
          label: "skill",
          source: "skills-ref validate .",
        },
      },
      {
        title: "Website validation",
        body: [
          "The Astro site should build statically from site/ and keep visual-contract tests around the demo and docs shell.",
        ],
        code: {
          label: "site",
          source: "cd site\nnpm test\nnpm run build",
        },
      },
    ],
  },
  {
    slug: "security-privacy",
    title: "Security/privacy",
    summary: "Protect local project context and browser drafts.",
    body: [
      "Questionnaire separates browser-local drafts from agent-managed project files so users can inspect the loop without losing control of their data.",
    ],
    sections: [
      {
        title: "Public demo",
        bullets: [
          "Draft answers stay in localStorage.",
          "Reset clears the local browser draft.",
          "Import reads only the selected file in the browser.",
          "Export is the explicit handoff path.",
          "The demo does not need a login or server-side session.",
        ],
      },
      {
        title: "Real project runs",
        bullets: [
          "Treat state.json, transcript.md, CONTEXT.md, research notes, and ADRs as project artifacts.",
          "Do not commit secrets, credentials, private screenshots, or proprietary records unless the project policy allows it.",
          "Research notes should cite sources without storing private tokens or dashboard secrets.",
          "File upload questions should capture metadata and notes; the agent should use explicit local paths or attachments for content.",
        ],
      },
      {
        title: "Review before sharing",
        body: [
          "Before sending a run directory to someone else, review the transcript, glossary, research notes, and ADRs as carefully as any other decision record.",
        ],
      },
    ],
  },
  {
    slug: "contributing",
    title: "Contributing",
    summary: "Keep changes focused on the portable skill package and its docs.",
    body: [
      "The repository is primarily a portable Agent Skill package. The website lives in site/ so installers and validators can distinguish runtime skill files from public docs.",
    ],
    sections: [
      {
        title: "Where changes belong",
        bullets: [
          "SKILL.md: core runbook behavior, trigger description, and invocation flow.",
          "references/: long-form skill guidance, journeys, design system notes, and decision references.",
          "assets/: standalone browser template copied into each run directory.",
          "scripts/: deterministic helpers for starting and validating runs.",
          "site/: Astro website, public docs, demo data, social metadata, and visual tests.",
        ],
      },
      {
        title: "Content rules",
        bullets: [
          "Keep public docs original and concise.",
          "Do not copy private local skill text into public files.",
          "Do not add deployment notes to user-facing skill-install docs unless they affect skill usage.",
          "Keep the root skill package authoritative for runtime behavior.",
        ],
      },
      {
        title: "Validation before PRs",
        code: {
          label: "check",
          source: "python3 -m py_compile scripts/start-questionnaire.py scripts/validate-questionnaire-state.py\ncd site\nnpm test\nnpm run build",
        },
      },
    ],
  },
];

export function findDoc(slug: string): DocPage | undefined {
  return docs.find((doc) => doc.slug === slug);
}
