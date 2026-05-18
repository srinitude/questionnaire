import type { APIRoute } from "astro";
import { docs } from "../data/docs";
import { SITE_URL } from "../data/seo";

export const GET: APIRoute = () => {
  const urls = ["/", ...docs.map((doc) => `/docs/${doc.slug}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${SITE_URL}${url}</loc></url>`)
    .join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
