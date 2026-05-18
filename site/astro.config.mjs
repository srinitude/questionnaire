import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://questionnaire.dev",
  output: "static",
  vite: {
    preview: {
      allowedHosts: [
        "questionnaire.dev",
        "www.questionnaire.dev",
        "site-production-eadb.up.railway.app",
      ],
    },
  },
});
