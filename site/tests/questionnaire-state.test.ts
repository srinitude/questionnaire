import { describe, expect, it } from "vitest";
import {
  answerCurrentQuestion,
  exportTranscript,
  importQuestionnaireState,
  seedQuestionnaireState,
  validateQuestionnaireState,
} from "../src/lib/questionnaire-state";

describe("questionnaire demo state", () => {
  it("ships a valid decision-grade seed state with the skill schema", () => {
    const state = seedQuestionnaireState();
    const validation = validateQuestionnaireState(state);

    expect(validation.valid).toBe(true);
    expect(state.current_question).toBe("q-problem-definition");
    expect(state.questions[0]?.recommended_answer).toContain("repeatable process");
    expect(state.exports).toEqual({
      transcript: "transcript.md",
      context: "CONTEXT.md",
      state: "state.json",
    });
  });

  it("answers the active question and advances the artifact trail", () => {
    const state = seedQuestionnaireState();
    const next = answerCurrentQuestion(state, "We need to stress-test a product architecture decision.");

    expect(next.questions[0]?.status).toBe("answered");
    expect(next.questions[0]?.user_answer).toContain("product architecture");
    expect(next.decisions.at(-1)?.decision).toContain("core problem");
    expect(next.current_question).toBe("q-context-goals");
  });

  it("imports only valid questionnaire-shaped JSON", () => {
    const valid = JSON.stringify(seedQuestionnaireState());
    const imported = importQuestionnaireState(valid);

    expect(imported.valid).toBe(true);
    expect(imported.state?.run.id).toBe("questionnaire-dev-demo");

    const invalid = importQuestionnaireState("{\"questions\":[]}");

    expect(invalid.valid).toBe(false);
    expect(invalid.errors).toContain("Missing top-level keys: run, project, current_question, decisions, glossary, research, adrs, exports, ui");
  });

  it("exports a readable transcript from answered questions and decisions", () => {
    const state = answerCurrentQuestion(seedQuestionnaireState(), "Use it for architecture reviews.");
    const transcript = exportTranscript(state);

    expect(transcript).toContain("# Questionnaire Demo Transcript");
    expect(transcript).toContain("Question: What is the core problem we are trying to solve?");
    expect(transcript).toContain("Answer: Use it for architecture reviews.");
    expect(transcript).toContain("Decision: Capture the core problem");
  });
});
