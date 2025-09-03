import type { APIRoute } from "astro";
import { turso } from "@/db/turso";

export const GET: APIRoute = async () => {
  const { rows } = await turso.execute(
    "SELECT slug, updated_at FROM posts ORDER BY updated_at DESC"
  );

  const now = Date.now();

  const urls = rows
    .map((row) => {
      const updatedAt = row.updated_at ? new Date(row.updated_at) : new Date();
      const lastmod = updatedAt.toISOString().split("T")[0];

      // calculate age in days
      const ageDays = Math.floor((now - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

      let priority = "0.5";
      if (ageDays <= 7) {
        priority = "1.0";
      } else if (ageDays <= 30) {
        priority = "0.8";
      }

      return `
        <url>
          <loc>${import.meta.env.HOST}/posts/${row.slug}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>${priority}</priority>
        </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${urls}
  </urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
};
