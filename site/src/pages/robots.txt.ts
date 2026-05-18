import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response("User-agent: *\nAllow: /\nSitemap: https://questionnaire.dev/sitemap-index.xml\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
