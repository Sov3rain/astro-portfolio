// @ts-check
import { defineConfig } from "astro/config";
import darkTheme from "./minimal-dark.json";
import lightTheme from "./minimal-light.json";

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
});
