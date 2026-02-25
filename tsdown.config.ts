import { defineConfig } from "tsdown";

export default defineConfig((options) => {
  return {
    entry: { index: "src/pico.ts" },
    minify: !options.watch,
    target: "ES2021",
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
  };
});
