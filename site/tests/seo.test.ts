import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL, defaultSeo, jsonLd, socialImage } from "../src/data/seo";

describe("SEO and social metadata", () => {
  it("defines canonical homepage metadata for search and social sharing", () => {
    expect(SITE_URL).toBe("https://questionnaire.dev");
    expect(defaultSeo.title).toContain("Questionnaire");
    expect(defaultSeo.description.length).toBeGreaterThanOrEqual(120);
    expect(defaultSeo.description.length).toBeLessThanOrEqual(160);
    expect(defaultSeo.canonical).toBe("https://questionnaire.dev/");
    expect(defaultSeo.openGraph.type).toBe("website");
    expect(defaultSeo.openGraph.image).toBe("https://questionnaire.dev/og/questionnaire-og.svg");
    expect(defaultSeo.twitter.card).toBe("summary_large_image");
  });

  it("exposes software application structured data", () => {
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("SoftwareApplication");
    expect(jsonLd.name).toBe("Questionnaire");
    expect(jsonLd.url).toBe("https://questionnaire.dev/");
    expect(jsonLd.applicationCategory).toContain("Developer");
  });

  it("ships a first-party share image path", () => {
    expect(socialImage.path).toBe("/og/questionnaire-og.svg");
    expect(socialImage.width).toBe(1200);
    expect(socialImage.height).toBe(630);
    expect(socialImage.alt).toContain("Questionnaire");
  });

  it("publishes llms.txt for LLM crawlers", () => {
    const content = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");

    expect(content).toContain("# Questionnaire");
    expect(content).toContain("https://questionnaire.dev/docs/get-started/");
    expect(content).toContain("https://github.com/srinitude/questionnaire");
    expect(content).not.toMatch(/Railway/i);
  });
});
