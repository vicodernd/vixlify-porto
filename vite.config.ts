import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Minimal ambient declaration so this config type-checks without @types/node.
declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    // Honor the port assigned by the harness (autoPort) via PORT; falls back to
    // Vite's default 5173 when unset.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
});
