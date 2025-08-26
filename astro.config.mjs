// @ts-check
import { defineConfig } from "astro/config";
import darkTheme from "./minimal-dark.json";
import lightTheme from "./minimal-light.json";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        dark: darkTheme,
        light: lightTheme,
      },
    },
  },
  site: "https://samuelduval.me",
  integrations: [sitemap()],
});