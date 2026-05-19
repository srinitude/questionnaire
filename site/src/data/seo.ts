export const SITE_URL = "https://questionnaire.dev";

export interface SocialImage {
  path: string;
  width: 1200;
  height: 630;
  type: "image/png";
  alt: string;
}

const createSocialImage = (slug: string, alt: string): SocialImage => ({
  path: `/og/${slug}.png`,
  width: 1200,
  height: 630,
  type: "image/png",
  alt,
});

export const socialImagesByPath: Record<string, SocialImage> = {
  "/": createSocialImage(
    "home",
    "Questionnaire.dev live run interface showing artifact trail, active question, and context export panels",
  ),
  "/docs/overview/": createSocialImage(
    "overview",
    "Questionnaire overview docs social card with decision-grade artifact model and live run interface",
  ),
  "/docs/get-started/": createSocialImage(
    "get-started",
    "Questionnaire get started docs social card for installing the Agent Skill and starting a run",
  ),
  "/docs/artifact-model/": createSocialImage(
    "artifact-model",
    "Questionnaire artifact model docs social card showing state.json, transcript.md, CONTEXT.md, research, and ADRs",
  ),
  "/docs/state-schema/": createSocialImage(
    "state-schema",
    "Questionnaire state schema docs social card for browser drafts, exports, validation, and recovery",
  ),
  "/docs/question-types/": createSocialImage(
    "question-types",
    "Questionnaire question types docs social card covering freeform, choice, ranked, scale, and branching prompts",
  ),
  "/docs/agent-workflow/": createSocialImage(
    "agent-workflow",
    "Questionnaire agent workflow docs social card for asking one question at a time and updating artifacts",
  ),
  "/docs/browser-demo-boundaries/": createSocialImage(
    "browser-demo-boundaries",
    "Questionnaire browser demo boundaries social card explaining local drafts and agent-managed filesystem writes",
  ),
  "/docs/validation/": createSocialImage(
    "validation",
    "Questionnaire validation docs social card for checking state files, helper scripts, skill packages, and the website",
  ),
  "/docs/security-privacy/": createSocialImage(
    "security-privacy",
    "Questionnaire security and privacy docs social card for browser-local drafts and project artifact review",
  ),
  "/docs/contributing/": createSocialImage(
    "contributing",
    "Questionnaire contributing docs social card for keeping the portable Agent Skill package and Astro site clean",
  ),
};

export const getSocialImageForPath = (path: string): SocialImage => {
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;

  return socialImagesByPath[normalizedPath] ?? socialImagesByPath["/"];
};

export const socialImage = socialImagesByPath["/"];

export const defaultSeo = {
  title: "Questionnaire.dev | Decision-grade Agent Skill docs",
  description: "Experience a browser-local Questionnaire run, inspect the state.json schema, and learn how agents produce transcript.md, CONTEXT.md, research notes, and ADRs.",
  canonical: `${SITE_URL}/`,
  keywords: [
    "Questionnaire Agent Skill",
    "agent skills",
    "decision questionnaire",
    "state.json schema",
    "agent workflow",
    "ADR artifacts",
    "localStorage demo",
  ],
  openGraph: {
    type: "website",
    image: `${SITE_URL}${socialImage.path}`,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Questionnaire",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  url: `${SITE_URL}/`,
  description: defaultSeo.description,
  softwareHelp: `${SITE_URL}/docs/get-started/`,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};
