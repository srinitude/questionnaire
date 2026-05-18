export const SITE_URL = "https://questionnaire.dev";

export const socialImage = {
  path: "/og/questionnaire-og.svg",
  width: 1200,
  height: 630,
  alt: "Questionnaire demo-first Agent Skill docs with state.json and artifact trail panels",
};

export const defaultSeo = {
  title: "Questionnaire | Evidence-aware Agent Skill docs",
  description: "Run guided decision questionnaires with state.json, transcripts, glossary, research notes, ADRs, and a browser-ready local demo.",
  canonical: `${SITE_URL}/`,
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
