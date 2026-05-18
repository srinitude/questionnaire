import {
  answerCurrentQuestion,
  downloadText,
  exportTranscript,
  importQuestionnaireState,
  seedQuestionnaireState,
  type QuestionnaireState,
  validateQuestionnaireState,
} from "../lib/questionnaire-state";

const STORAGE_KEY = "questionnaire.dev.demo.state";

const root = document.querySelector<HTMLElement>("[data-questionnaire-demo]");
const promptEl = document.querySelector<HTMLElement>("[data-question-prompt]");
const recommendationEl = document.querySelector<HTMLElement>("[data-question-recommendation]");
const whyEl = document.querySelector<HTMLElement>("[data-question-why]");
const optionsEl = document.querySelector<HTMLElement>("[data-question-options]");
const answerInput = document.querySelector<HTMLTextAreaElement>("[data-answer-input]");
const answerButton = document.querySelector<HTMLButtonElement>("[data-answer-button]");
const resetButtons = document.querySelectorAll<HTMLButtonElement>("[data-reset-button]");
const skipButton = document.querySelector<HTMLButtonElement>("[data-skip-button]");
const artifactsEl = document.querySelector<HTMLElement>("[data-artifacts]");
const counterEl = document.querySelector<HTMLElement>("[data-question-counter]");
const validationEl = document.querySelector<HTMLElement>("[data-validation-state]");
const saveStatusEl = document.querySelector<HTMLElement>("[data-save-status]");
const importStatusEl = document.querySelector<HTMLElement>("[data-import-status]");
const exportJsonButton = document.querySelector<HTMLButtonElement>("[data-export-json]");
const exportTranscriptButton = document.querySelector<HTMLButtonElement>("[data-export-transcript]");
const importButton = document.querySelector<HTMLButtonElement>("[data-import-button]");
const importInput = document.querySelector<HTMLInputElement>("[data-import-json]");
const runStepsEl = document.querySelector<HTMLElement>("[data-run-steps]");

let state = loadState();

function loadState(): QuestionnaireState {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return seedQuestionnaireState();
  }
  const imported = importQuestionnaireState(stored);
  return imported.valid && imported.state ? imported.state : seedQuestionnaireState();
}

function saveState(): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (saveStatusEl) {
    saveStatusEl.textContent = "Autosaved locally";
  }
}

function activeQuestion() {
  return state.questions.find((question) => question.id === state.current_question) ?? state.questions[0];
}

function render(): void {
  if (!root) return;
  const question = activeQuestion();
  const activeIndex = state.questions.findIndex((candidate) => candidate.id === question.id);
  const validation = validateQuestionnaireState(state);

  if (promptEl) promptEl.textContent = question.prompt;
  if (recommendationEl) recommendationEl.textContent = question.recommended_answer;
  if (whyEl) whyEl.textContent = question.why_it_matters;
  if (counterEl) counterEl.textContent = `Question ${activeIndex + 1} of ${state.questions.length}`;
  if (validationEl) validationEl.textContent = validation.valid ? "Valid state" : `${validation.errors.length} state issue`;
  if (answerInput) answerInput.value = question.user_answer || question.recommended_answer;

  if (optionsEl) {
    optionsEl.innerHTML = "";
    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.innerHTML = `<strong>${option.label}</strong><span>${option.description}</span>`;
      button.addEventListener("click", () => {
        if (answerInput) {
          answerInput.value = `${option.label}: ${option.description}`;
          question.user_answer = answerInput.value;
          saveState();
        }
      });
      optionsEl.append(button);
    });
  }

  renderRunSteps(activeIndex);
  renderArtifacts();
}

function renderRunSteps(activeIndex: number): void {
  if (!runStepsEl) return;

  runStepsEl.innerHTML = state.questions
    .map((question, index) => {
      const stateLabel = index === activeIndex ? "ACTIVE" : question.status === "answered" ? "DONE" : "";
      const detail = question.status === "answered" ? "answered" : index === activeIndex ? "live now" : "pending";
      return `
        <li class="question-step${index === activeIndex ? " is-active" : ""}${question.status === "answered" ? " is-done" : ""}">
          <span class="step-number">${index + 1}</span>
          <span class="step-copy">
            <strong>${escapeHtml(stepTitle(question.prompt))}</strong>
            <small>${detail}</small>
          </span>
          ${stateLabel ? `<em>${stateLabel}</em>` : ""}
        </li>
      `;
    })
    .join("");
}

function stepTitle(prompt: string): string {
  if (/core problem/i.test(prompt)) return "Problem Definition";
  if (/context and goals/i.test(prompt)) return "Context & Goals";
  if (/constraints/i.test(prompt)) return "Constraints";
  if (/options/i.test(prompt)) return "Options";
  if (/risks and tradeoffs/i.test(prompt)) return "Risks & Tradeoffs";
  if (/success criteria/i.test(prompt)) return "Success Criteria";
  return prompt.replace(/\?$/, "");
}

function renderArtifacts(): void {
  if (!artifactsEl) return;
  const artifacts = [
    { name: "state.json", detail: "Live state", kind: "file", live: true },
    { name: "transcript.md", detail: "Running transcript", kind: "file", live: false },
    { name: "CONTEXT.md", detail: "Project context", kind: "file", live: false },
    { name: "research/", detail: `${state.research.length} items`, kind: "folder", live: false },
    { name: "adrs/", detail: `${state.adrs.length} items`, kind: "folder", live: false },
  ];

  artifactsEl.innerHTML = artifacts
    .map(
      (artifact) => `
        <div class="artifact-row" data-kind="${artifact.kind}">
          <span class="artifact-icon" aria-hidden="true"></span>
          <span class="artifact-copy">
            <code>${escapeHtml(artifact.name)}</code>
            <span>${escapeHtml(artifact.detail)}</span>
          </span>
          ${artifact.live ? `<i aria-hidden="true"></i>` : ""}
        </div>
      `,
    )
    .join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setImportStatus(message: string, visible = true): void {
  if (!importStatusEl) return;
  importStatusEl.textContent = message;
  importStatusEl.dataset.visible = visible ? "true" : "false";
}

answerInput?.addEventListener("input", () => {
  const question = activeQuestion();
  question.user_answer = answerInput.value;
  saveState();
});

answerButton?.addEventListener("click", () => {
  const answer = answerInput?.value.trim();
  if (!answer) {
    setImportStatus("Write an answer before advancing.");
    return;
  }
  state = answerCurrentQuestion(state, answer);
  saveState();
  render();
});

resetButtons.forEach((resetButton) => resetButton.addEventListener("click", () => {
  state = seedQuestionnaireState();
  window.localStorage.removeItem(STORAGE_KEY);
  setImportStatus("Draft reset. Browser storage cleared.");
  render();
}));

skipButton?.addEventListener("click", () => {
  const fallback = activeQuestion().recommended_answer || "Skipped in browser demo.";
  state = answerCurrentQuestion(state, fallback);
  saveState();
  render();
});

exportJsonButton?.addEventListener("click", () => {
  downloadText("questionnaire-demo-state.json", JSON.stringify(state, null, 2), "application/json");
});

exportTranscriptButton?.addEventListener("click", () => {
  downloadText("questionnaire-demo-transcript.md", exportTranscript(state), "text/markdown");
});

importButton?.addEventListener("click", () => {
  importInput?.click();
});

importInput?.addEventListener("change", async () => {
  const file = importInput.files?.[0];
  if (!file) return;
  const source = await file.text();
  const imported = importQuestionnaireState(source);
  if (!imported.valid || !imported.state) {
    setImportStatus(imported.errors.join(" "));
    return;
  }
  state = imported.state;
  saveState();
  setImportStatus(`Imported ${file.name}.`);
  importInput.value = "";
  render();
});

render();
