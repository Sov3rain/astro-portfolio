// @ts-check
import { defineConfig } from "astro/config";
import customTheme from "./shiki_theme.json";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: customTheme,
    },
  },
});
