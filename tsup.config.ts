import { defineConfig } from "tsup";
import packageJson from "./package.json";

export default defineConfig((options) => {
  return {
    entry: { index: "src/pico.ts" },
    minify: !options.watch,
    target: "ES2021",
    format: ["cjs", "esm"],
    splitting: false,
    dts: true,
    sourcemap: true,
    clean: true,
    esbuildOptions(options) {
      options.banner = {
        js: `// Pico Search v${
          packageJson.version
        } · The MIT License · Copyright © ${new Date().getFullYear()} Shivam Mishra.`,
      };
    },
  };
});
