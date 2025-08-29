import type { APIRoute } from "astro";
import { turso } from "@/db/turso";

export const GET: APIRoute = async () => {
  const { rows } = await turso.execute("SELECT slug FROM posts");

  const urls = rows.map(
    (row) => `<url><loc>${import.meta.env.HOST}/posts/${row.slug}</loc></url>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
