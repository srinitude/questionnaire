export const SITE_URL = "https://questionnaire.dev";

export const socialImage = {
  path: "/og/questionnaire-og.svg",
  width: 1200,
  height: 630,
  alt: "Questionnaire.dev live run interface with artifact trail, active question, and context export panels",
};

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
