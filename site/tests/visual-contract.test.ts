import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { seedQuestionnaireState } from "../src/lib/questionnaire-state";

const repoRoot = join(process.cwd(), "..");

describe("screenshot-led visual contract", () => {
  it("uses the questionnaire.dev console navigation from the reference", () => {
    const page = readFileSync(join(process.cwd(), "src/pages/index.astro"), "utf8");

    ["Overview", "Guides", "Reference", "Skill docs", "ADRs", "Examples"].forEach((label) => {
      expect(page).toContain(label);
    });

    expect(page).toContain("Run a questionnaire. Produce decision-grade artifacts.");
    expect(page).toContain("data-run-steps");
    expect(page).not.toContain("bottom-dock");
    expect(page).not.toContain("Documentation highlights");
    expect(page).not.toContain("overview-section");
  });

  it("seeds a six-question decision-grade run like the reference surface", () => {
    const state = seedQuestionnaireState();

    expect(state.questions).toHaveLength(6);
    expect(state.current_question).toBe("q-problem-definition");
    expect(state.questions.map((question) => question.prompt)).toEqual([
      "What is the core problem we are trying to solve?",
      "Which context and goals must the answer preserve?",
      "What constraints should shape the options?",
      "Which options are actually on the table?",
      "What risks and tradeoffs deserve explicit pressure?",
      "What success criteria would make the decision defensible later?",
    ]);
  });

  it("shares the same labeled console structure in the standalone skill template", () => {
    const template = readFileSync(join(repoRoot, "assets/questionnaire-template.html"), "utf8");

    expect(template).toContain("ARTIFACT TRAIL");
    expect(template).toContain("CONTEXT & EXPORT");
    expect(template).toContain("LIVE QUESTIONNAIRE RUN");
    expect(template).toContain("SAVE & CONTINUE");
  });

  it("defines the engraved desk visual system in CSS", () => {
    const css = readFileSync(join(process.cwd(), "src/styles/global.css"), "utf8");

    ["desk-stage", "workbench", "brass-plate", "overflow: hidden"].forEach((className) => {
      expect(css).toContain(className);
    });
  });

  it("keeps docs overview in the reference strip layout", () => {
    const nav = readFileSync(join(process.cwd(), "src/components/DocsNav.astro"), "utf8");
    const docsPage = readFileSync(join(process.cwd(), "src/pages/docs/[slug].astro"), "utf8");
    const css = readFileSync(join(process.cwd(), "src/styles/global.css"), "utf8");

    ["Getting started", "How it works", "Artifacts", "Patterns", "Configuration", "Integrations"].forEach((label) => {
      expect(nav).toContain(label);
    });
    expect(docsPage).toContain("docs-overview-grid");
    expect(css).toContain("docs-strip-item");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.28fr)");
  });
});
