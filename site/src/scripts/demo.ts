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
const resetButton = document.querySelector<HTMLButtonElement>("[data-reset-button]");
const artifactsEl = document.querySelector<HTMLElement>("[data-artifacts]");
const counterEl = document.querySelector<HTMLElement>("[data-question-counter]");
const validationEl = document.querySelector<HTMLElement>("[data-validation-state]");
const saveStatusEl = document.querySelector<HTMLElement>("[data-save-status]");
const importStatusEl = document.querySelector<HTMLElement>("[data-import-status]");
const exportJsonButton = document.querySelector<HTMLButtonElement>("[data-export-json]");
const exportTranscriptButton = document.querySelector<HTMLButtonElement>("[data-export-transcript]");
const importInput = document.querySelector<HTMLInputElement>("[data-import-json]");

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
  if (answerInput) answerInput.value = question.user_answer;

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

  renderArtifacts();
}

function renderArtifacts(): void {
  if (!artifactsEl) return;
  const artifacts = [
    ["state.json", `${state.questions.filter((question) => question.status === "answered").length}/${state.questions.length} answered`],
    ["transcript.md", `${state.decisions.length} decisions captured`],
    ["CONTEXT.md", `${state.glossary.length} glossary terms`],
    ["research/", `${state.research.length} notes`],
    ["adrs/", `${state.adrs.length} records`],
  ];

  artifactsEl.innerHTML = artifacts
    .map(([name, detail]) => `<div class="artifact-row"><code>${name}</code><span>${detail}</span></div>`)
    .join("");
}

answerInput?.addEventListener("input", () => {
  const question = activeQuestion();
  question.user_answer = answerInput.value;
  saveState();
});

answerButton?.addEventListener("click", () => {
  const answer = answerInput?.value.trim();
  if (!answer) {
    if (importStatusEl) importStatusEl.textContent = "Write an answer before advancing.";
    return;
  }
  state = answerCurrentQuestion(state, answer);
  saveState();
  render();
});

resetButton?.addEventListener("click", () => {
  state = seedQuestionnaireState();
  window.localStorage.removeItem(STORAGE_KEY);
  if (importStatusEl) importStatusEl.textContent = "Draft reset. Browser storage cleared.";
  render();
});

exportJsonButton?.addEventListener("click", () => {
  downloadText("questionnaire-demo-state.json", JSON.stringify(state, null, 2), "application/json");
});

exportTranscriptButton?.addEventListener("click", () => {
  downloadText("questionnaire-demo-transcript.md", exportTranscript(state), "text/markdown");
});

importInput?.addEventListener("change", async () => {
  const file = importInput.files?.[0];
  if (!file) return;
  const source = await file.text();
  const imported = importQuestionnaireState(source);
  if (!imported.valid || !imported.state) {
    if (importStatusEl) importStatusEl.textContent = imported.errors.join(" ");
    return;
  }
  state = imported.state;
  saveState();
  if (importStatusEl) importStatusEl.textContent = `Imported ${file.name}.`;
  render();
});

render();
