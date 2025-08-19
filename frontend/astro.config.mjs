import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    plugins: [
      tailwindcss({
        config: path.resolve("./tailwind.config.js"),
      }),
    ],
  },

  adapter: vercel(),
  integrations: [react()],
});
