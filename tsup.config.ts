import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["lib/sw/sw.ts"],
    outDir: "./public",
    clean: true,
    format: ["iife"],
    dts: false,
    shims: true,
    minify: true,
    outExtension() {
      return {
        js: `.js`,
      };
    },
  },
  {
    entry: ["lib/swr/index.ts"],
    outDir: "./dist",
    clean: true,
    format: ["esm"],
    dts: true,
    shims: true,
  },
]);
