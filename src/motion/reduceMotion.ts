// src/motion/reduceMotion.ts
//
// PURPOSE
// -------
// Central reduced-motion hook.
// Normalizes the return value to a strict boolean.
//
// WHY
// ---
// Some versions/types return `boolean | null` for `useReducedMotion()`.
// We coerce null -> false so consumers can rely on a boolean.

import { useReducedMotion } from "motion/react";

export function usePrefersReducedMotion(): boolean {
  return Boolean(useReducedMotion());
}
