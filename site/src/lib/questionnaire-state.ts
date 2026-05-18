export type QuestionStatus = "active" | "pending" | "answered" | "skipped" | "blocked" | "archived";

export type AnswerType =
  | "freeform"
  | "single_choice"
  | "multi_choice"
  | "ranked_choice"
  | "scale"
  | "yes_no"
  | "file_upload"
  | "matrix"
  | "branching";

export interface QuestionOption {
  label: string;
  value: string;
  description: string;
}

export interface QuestionnaireQuestion {
  id: string;
  status: QuestionStatus;
  prompt: string;
  recommended_answer: string;
  why_it_matters: string;
  answer_type: AnswerType;
  options: QuestionOption[];
  custom_option_enabled: boolean;
  user_answer: string;
  research_required: boolean;
  research_artifact: string;
  follow_up_logic: Array<{
    when: string;
    operator: string;
    value: string;
    next_question_id: string;
    note: string;
  }>;
  created_at: string;
}

export interface QuestionnaireState {
  run: {
    id: string;
    created_at: string;
    run_dir: string;
    index_html: string;
    status: string;
  };
  project: {
    root: string;
    name: string;
    root_markers: string[];
  };
  current_question: string;
  questions: QuestionnaireQuestion[];
  decisions: Array<{
    id: string;
    question_id: string;
    decision: string;
    created_at: string;
  }>;
  glossary: Array<{
    term: string;
    definition: string;
  }>;
  research: Array<{
    id: string;
    artifact: string;
    summary: string;
  }>;
  adrs: Array<{
    id: string;
    path: string;
    title: string;
  }>;
  exports: {
    transcript: string;
    context: string;
    state: string;
  };
  ui: {
    active_tab: string;
    layout: string;
    theme: string;
    local_draft_enabled: boolean;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const TOP_LEVEL_KEYS = [
  "run",
  "project",
  "current_question",
  "questions",
  "decisions",
  "glossary",
  "research",
  "adrs",
  "exports",
  "ui",
] as const;

const QUESTION_FIELDS = [
  "id",
  "status",
  "prompt",
  "recommended_answer",
  "why_it_matters",
  "answer_type",
  "options",
  "custom_option_enabled",
  "user_answer",
  "research_required",
  "research_artifact",
  "follow_up_logic",
  "created_at",
] as const;

function question(
  id: string,
  status: QuestionStatus,
  prompt: string,
  recommendedAnswer: string,
  whyItMatters: string,
  answerType: AnswerType,
  options: QuestionOption[] = [],
): QuestionnaireQuestion {
  return {
    id,
    status,
    prompt,
    recommended_answer: recommendedAnswer,
    why_it_matters: whyItMatters,
    answer_type: answerType,
    options,
    custom_option_enabled: true,
    user_answer: "",
    research_required: false,
    research_artifact: "",
    follow_up_logic: [],
    created_at: "2026-05-18:00-00-00",
  };
}

export function seedQuestionnaireState(): QuestionnaireState {
  return {
    run: {
      id: "questionnaire-dev-demo",
      created_at: "2026-05-18:00-00-00",
      run_dir: ".questionnaire/questionnaire-dev-demo",
      index_html: ".questionnaire/questionnaire-dev-demo/index.html",
      status: "active",
    },
    project: {
      root: "browser-local-demo",
      name: "questionnaire.dev adoption run",
      root_markers: ["site-demo"],
    },
    current_question: "q-problem-definition",
    questions: [
      question(
        "q-problem-definition",
        "active",
        "What is the core problem we are trying to solve?",
        "We lack a consistent, repeatable process for capturing stakeholder context and converting it into decision-ready documentation.",
        "A clear problem definition anchors every downstream decision. It reduces rework, aligns stakeholders, and improves the quality of options we generate.",
        "freeform",
        [
          {
            label: "Use the recommendation",
            value: "recommended",
            description: "Keep the decision focused on repeatable context capture and artifacts.",
          },
          {
            label: "Narrow the problem",
            value: "narrow",
            description: "Make the scope smaller before choosing options or artifacts.",
          },
          {
            label: "Rewrite from scratch",
            value: "rewrite",
            description: "Use the browser draft as a prompt for the agent-managed run.",
          },
        ],
      ),
      question(
        "q-context-goals",
        "pending",
        "Which context and goals must the answer preserve?",
        "Capture the stakeholders, deadline, decision owner, success horizon, and the artifacts that need to survive after the conversation.",
        "Context and goals prevent the questionnaire from optimizing for a tidy answer while losing the reason the decision matters.",
        "single_choice",
        [
          {
            label: "Stakeholder alignment",
            value: "stakeholder_alignment",
            description: "The run should resolve who needs to trust the answer.",
          },
          {
            label: "Execution clarity",
            value: "execution_clarity",
            description: "The run should produce next steps and durable ownership.",
          },
          {
            label: "Research confidence",
            value: "research_confidence",
            description: "The run should identify what evidence must be checked.",
          },
        ],
      ),
      question(
        "q-constraints",
        "pending",
        "What constraints should shape the options?",
        "List the non-negotiables first: time, budget, technical boundaries, privacy requirements, review expectations, and the cost of reversing the choice.",
        "Constraints turn an open-ended discussion into a decision-grade comparison surface.",
        "multi_choice",
        [
          { label: "Time", value: "time", description: "Deadline, sequencing, and review windows." },
          { label: "Technical fit", value: "technical_fit", description: "Stack, integration, and maintenance boundaries." },
          { label: "Security/privacy", value: "security_privacy", description: "Data exposure, permissions, and local artifact rules." },
        ],
      ),
      question(
        "q-options",
        "pending",
        "Which options are actually on the table?",
        "Compare only options someone can execute, reject, or research next. Do not include vague preferences as options.",
        "Options are where teams often confuse taste for a decision. Naming executable choices keeps the run honest.",
        "ranked_choice",
        [
          { label: "Use Questionnaire now", value: "use_now", description: "Run the skill for the current decision." },
          { label: "Prototype manually", value: "manual", description: "Use a lightweight checklist without artifacts." },
          { label: "Defer the workflow", value: "defer", description: "Wait until the decision has higher consequence." },
        ],
      ),
      question(
        "q-risks-tradeoffs",
        "pending",
        "What risks and tradeoffs deserve explicit pressure?",
        "Record the cost of being wrong, what the team gives up, and which assumptions need research before the decision is treated as stable.",
        "Risk pressure is what separates a useful questionnaire from a polished confirmation bias machine.",
        "freeform",
      ),
      question(
        "q-success-criteria",
        "pending",
        "What success criteria would make the decision defensible later?",
        "Define observable evidence that the decision worked, who will review it, and which artifact should be revisited if reality changes.",
        "Success criteria make the transcript and ADRs useful after the original conversation is forgotten.",
        "freeform",
      ),
    ],
    decisions: [],
    glossary: [
      {
        term: "run directory",
        definition: "The project-local folder containing index.html, state.json, transcript.md, CONTEXT.md, research notes, and ADRs.",
      },
      {
        term: "agent-managed filesystem",
        definition: "The agent, not browser JavaScript, writes durable files to the user's project.",
      },
    ],
    research: [
      {
        id: "research-browser-boundary",
        artifact: "research/browser-boundary.md",
        summary: "Browser drafts stay local; durable filesystem writes are agent-managed.",
      },
      {
        id: "research-state-recovery",
        artifact: "research/state-recovery.md",
        summary: "state.json is the recovery point for resuming or transferring a run.",
      },
      {
        id: "research-adoption-fit",
        artifact: "research/adoption-fit.md",
        summary: "The skill fits decisions that need evidence, rationale, and a reviewable trail.",
      },
    ],
    adrs: [
      {
        id: "adr-0001-local-drafts",
        path: "adrs/0001-local-drafts-agent-filesystem.md",
        title: "Keep browser drafts local and make filesystem writes agent-managed",
      },
      {
        id: "adr-0002-run-directory",
        path: "adrs/0002-run-directory-as-contract.md",
        title: "Use the run directory as the durable contract",
      },
    ],
    exports: {
      transcript: "transcript.md",
      context: "CONTEXT.md",
      state: "state.json",
    },
    ui: {
      active_tab: "Question",
      layout: "agent_guided",
      theme: "engraved_lacquer_brass",
      local_draft_enabled: true,
    },
  };
}

export function validateQuestionnaireState(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { valid: false, errors: ["state root must be an object."] };
  }

  const data = value as Record<string, unknown>;
  const missing = TOP_LEVEL_KEYS.filter((key) => !(key in data));
  if (missing.length) {
    errors.push(`Missing top-level keys: ${missing.join(", ")}`);
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    errors.push("questions must be a non-empty list.");
  } else {
    const active = data.questions.filter((candidate) => {
      return !!candidate && typeof candidate === "object" && (candidate as QuestionnaireQuestion).status === "active";
    });
    if (active.length !== 1) {
      errors.push(`Exactly one question must have status active; found ${active.length}.`);
    }

    data.questions.forEach((candidate, index) => {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
        errors.push(`questions[${index}] must be an object.`);
        return;
      }
      const q = candidate as Record<string, unknown>;
      QUESTION_FIELDS.forEach((field) => {
        if (!(field in q)) {
          errors.push(`questions[${index}] missing required field: ${field}`);
        }
      });
    });
  }

  if (typeof data.current_question === "string" && Array.isArray(data.questions)) {
    const ids = data.questions
      .filter((candidate): candidate is QuestionnaireQuestion => !!candidate && typeof candidate === "object")
      .map((candidate) => candidate.id);
    if (!ids.includes(data.current_question)) {
      errors.push(`current_question does not match a question id: ${data.current_question}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function importQuestionnaireState(source: string): ValidationResult & { state?: QuestionnaireState } {
  try {
    const parsed = JSON.parse(source) as unknown;
    const validation = validateQuestionnaireState(parsed);
    return validation.valid ? { ...validation, state: parsed as QuestionnaireState } : validation;
  } catch (error) {
    return { valid: false, errors: [`Invalid JSON: ${(error as Error).message}`] };
  }
}

export function answerCurrentQuestion(state: QuestionnaireState, answer: string): QuestionnaireState {
  const next = structuredClone(state) as QuestionnaireState;
  const currentIndex = next.questions.findIndex((candidate) => candidate.id === next.current_question);
  if (currentIndex === -1) {
    return next;
  }

  const current = next.questions[currentIndex];
  current.status = "answered";
  current.user_answer = answer;
  next.decisions.push({
    id: `d-${String(next.decisions.length + 1).padStart(4, "0")}`,
    question_id: current.id,
    decision: current.id === "q-problem-definition"
      ? "Capture the core problem and continue into context and goals."
      : `Capture answer for ${current.prompt}`,
    created_at: "2026-05-18:00-00-00",
  });

  const following = next.questions[currentIndex + 1];
  if (following) {
    following.status = "active";
    next.current_question = following.id;
  } else {
    next.current_question = current.id;
    current.status = "active";
    next.run.status = "complete";
  }

  return next;
}

export function exportTranscript(state: QuestionnaireState): string {
  const lines = [
    "# Questionnaire Demo Transcript",
    "",
    `Run: ${state.run.id}`,
    `Project: ${state.project.name}`,
    "",
  ];

  state.questions.forEach((questionItem) => {
    lines.push(`## ${questionItem.id}`);
    lines.push("");
    lines.push(`Question: ${questionItem.prompt}`);
    lines.push("");
    lines.push(`Recommended answer: ${questionItem.recommended_answer}`);
    lines.push("");
    if (questionItem.user_answer) {
      lines.push(`Answer: ${questionItem.user_answer}`);
      lines.push("");
    }
  });

  state.decisions.forEach((decision) => {
    lines.push(`Decision: ${decision.decision}`);
  });

  return `${lines.join("\n").trim()}\n`;
}

export function downloadText(filename: string, content: string, type = "text/plain"): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
