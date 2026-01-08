// src/motion/tokens.ts
//
// PURPOSE
// -------
// Motion tokens: one source of truth for timing/easing.
// Keeps the entire UI feeling cohesive.
//
// NOTE
// ----
// Some components import { tokens }.
// We export both `motionTokens` (original) and `tokens` (alias) to avoid churn.

export const motionTokens = {
  duration: {
    fast: 0.18,
    base: 0.35,
    slow: 0.6,
  },
  ease: {
    out: [0.16, 1, 0.3, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
  },
};

// Backward-compatible alias
export const tokens = motionTokens;
