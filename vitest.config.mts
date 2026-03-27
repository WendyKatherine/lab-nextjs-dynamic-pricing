import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  css: {
    // Prevent Vitest from loading the project's postcss.config.mjs,
    // which requires a native Tailwind v4 binding unavailable in Node.
    postcss: { plugins: [] },
  },
  test: {
    include: ["src/**/*.test.ts", "app/**/*.test.ts"],
  },
});
