import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The Vite entry lives in demo/index.html so the repo-root index.html can be
// the self-contained build that opens with a double-click.
export default defineConfig({
  root: "demo",
  publicDir: "../public",
  plugins: [react()],
  base: "./", // relative paths so the build works on GitHub Pages under /<repo-name>/
  build: { outDir: "../dist", emptyOutDir: true },
});
