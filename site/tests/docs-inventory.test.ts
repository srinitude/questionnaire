import { describe, expect, it } from "vitest";
import { docs } from "../src/data/docs";

describe("operator docs inventory", () => {
  it("ships the approved visitor-facing docs without Railway deployment docs", () => {
    expect(docs.map((doc) => doc.slug)).toEqual([
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
});
