import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const content = `User-agent: *
Allow: /

Sitemap: ${import.meta.env.HOST}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
