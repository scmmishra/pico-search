/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom",
    benchmark: {
      include: ["test/bench/**"],
    },
    coverage: {
      reporter: ["cobertura", "text"],
    },
  },
});
