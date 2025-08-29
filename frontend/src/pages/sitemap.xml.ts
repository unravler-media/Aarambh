import type { APIRoute } from "astro";
import { turso } from "@/db/turso";

export const GET: APIRoute = async () => {
  // Assuming your posts table has slug + updated_at
  const { rows } = await turso.execute("SELECT slug, updated_at FROM posts ORDER BY updated_at DESC");

  const urls = rows
    .map((row) => {
      const lastmod = row.updated_at
        ? new Date(row.updated_at).toISOString().split("T")[0] // YYYY-MM-DD
        : new Date().toISOString().split("T")[0];

      return `
        <url>
          <loc>${import.meta.env.HOST}/posts/${row.slug}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
