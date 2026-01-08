/// <reference types="vite/client" />

/**
 * src/vite-env.d.ts
 *
 * PURPOSE
 * -------
 * Ensures TypeScript understands Vite globals AND
 * provides a fallback type shim for Tailwind's Vite plugin
 * if your installed version doesn't ship TS declarations.
 *
 * This eliminates:
 * "Cannot find module '@tailwindcss/vite' or its corresponding type declarations."
 */

// Fallback shim (harmless if types already exist)
declare module "@tailwindcss/vite" {
  import type { Plugin } from "vite";
  const tailwindcss: () => Plugin;
  export default tailwindcss;
}
