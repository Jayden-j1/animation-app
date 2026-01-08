// vite.config.ts
//
// PURPOSE
// -------
// Vite config for React + TypeScript.
// Adds Tailwind v4 plugin + `@` alias that maps to /src.
// TypeScript also needs matching paths config (tsconfig.app.json).

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
