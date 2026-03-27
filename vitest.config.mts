import { defineConfig } from "vitest/config";

export default defineConfig({
  css: {
    // Prevent Vitest from loading the project's postcss.config.mjs,
    // which requires a native Tailwind v4 binding unavailable in Node.
    postcss: { plugins: [] },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
