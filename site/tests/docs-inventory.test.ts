import { describe, expect, it } from "vitest";
import { docs } from "../src/data/docs";

describe("operator docs inventory", () => {
  it("ships the approved visitor-facing docs without Railway deployment docs", () => {
    expect(docs.map((doc) => doc.slug)).toEqual([
      "overview",
      "get-started",
      "artifact-model",
      "state-schema",
      "question-types",
      "agent-workflow",
      "browser-demo-boundaries",
      "validation",
      "security-privacy",
      "contributing",
    ]);

    expect(docs.some((doc) => /railway/i.test(`${doc.title} ${doc.body.join(" ")}`))).toBe(false);
  });

  it("includes the full operator documentation content map", () => {
    const bySlug = Object.fromEntries(docs.map((doc) => [doc.slug, doc]));

    expect(bySlug["get-started"].sections?.map((section) => section.title)).toEqual([
      "Install",
      "Start a run",
      "Answer the first question",
      "Keep the run moving",
    ]);
    expect(bySlug["artifact-model"].sections?.map((section) => section.title)).toEqual([
      "Run directory",
      "state.json",
      "transcript.md",
      "CONTEXT.md",
      "research/",
      "adrs/",
    ]);
    expect(bySlug["state-schema"].sections?.some((section) => section.title === "Question object")).toBe(true);
    expect(bySlug["question-types"].sections?.[0]?.bullets?.join(" ")).toContain("branching");
    expect(bySlug["agent-workflow"].sections?.some((section) => section.title === "Validation loop")).toBe(true);
    expect(bySlug["browser-demo-boundaries"].sections?.[1]?.bullets?.join(" ")).toContain("No project files are written");
    expect(bySlug["validation"].sections?.some((section) => section.title === "Website validation")).toBe(true);
    expect(bySlug["security-privacy"].sections?.[0]?.bullets?.join(" ")).toContain("localStorage");
    expect(bySlug["contributing"].sections?.[0]?.bullets?.join(" ")).toContain("site/");
  });
});
