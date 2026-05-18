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
    current_question: "q-adoption-fit",
    questions: [
      question(
        "q-adoption-fit",
        "active",
        "Should your team adopt Questionnaire for the decisions you are about to make?",
        "Use Questionnaire when the decision needs one firm question at a time, visible rationale, and durable artifacts instead of a loose chat transcript.",
        "The answer determines whether this workflow should become part of your project setup or remain an occasional planning tool.",
        "single_choice",
        [
          {
            label: "Adopt for this work",
            value: "adopt",
            description: "Use the skill when decisions need traceable artifacts and follow-up pressure.",
          },
          {
            label: "Use occasionally",
            value: "occasional",
            description: "Keep it for high-risk planning, architecture, research, or design sessions.",
          },
          {
            label: "Not a fit",
            value: "not_fit",
            description: "Skip when a normal checklist or short discussion is enough.",
          },
        ],
      ),
      question(
        "q-artifact-trust",
        "pending",
        "Which artifact would make this decision feel trustworthy after the chat ends?",
        "Start with state.json and transcript.md, then add CONTEXT.md, research notes, or ADRs only when the answer changes reusable terms, evidence, or hard-to-reverse choices.",
        "The artifact set is the difference between a useful interrogation and a memory-hole conversation.",
        "multi_choice",
        [
          { label: "state.json", value: "state", description: "Source of truth for run state and questions." },
          { label: "transcript.md", value: "transcript", description: "Readable record of questions, recommendations, and answers." },
          { label: "ADRs", value: "adrs", description: "Durable records for hard-to-reverse decisions." },
        ],
      ),
      question(
        "q-boundary",
        "pending",
        "Where should the browser stop and the agent take over?",
        "Let the browser draft, validate, import, and export. Let the agent write files, run research, update ADRs, and validate project-local state.",
        "A clear boundary protects privacy and avoids implying that a static website can write to a visitor's filesystem.",
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
    research: [],
    adrs: [],
    exports: {
      transcript: "transcript.md",
      context: "CONTEXT.md",
      state: "state.json",
    },
    ui: {
      active_tab: "Question",
      layout: "agent_guided",
      theme: "dark_lacquer_brass",
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
    decision: current.id === "q-adoption-fit"
      ? "Capture visitor workflow fit and continue into artifact trust."
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
