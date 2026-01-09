// vite.config.ts
//
// PURPOSE
// -------
// Vite config for React + TypeScript.
// - Tailwind v4 plugin
// - "@" alias to /src
// - Relative base so builds work in GitHub Pages AND local preview

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // ✅ Works everywhere: GitHub Pages subpath + local preview
  base: "./",
});
