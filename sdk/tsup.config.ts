import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts", react: "src/react.tsx" },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ["react", "react-dom"],
  },
  {
    entry: { widget: "src/mount.ts" },
    format: ["iife"],
    globalName: "Tikka",
    outExtension: () => ({ js: ".js" }),
    dts: false,
    clean: false,
    sourcemap: true,
    minify: true,
    noExternal: [/.*/],
  },
]);
