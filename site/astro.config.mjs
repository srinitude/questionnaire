import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://questionnaire.dev",
  output: "static",
  vite: {
    preview: {
      allowedHosts: [
        "questionnaire.dev",
        "www.questionnaire.dev",
        ".railway.app",
      ],
    },
  },
});
