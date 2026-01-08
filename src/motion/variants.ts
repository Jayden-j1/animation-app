// src/motion/variants.ts
//
// PURPOSE
// -------
// Shared animation variants for page transitions.
//
// PERFORMANCE NOTES
// -----------------
// Uses opacity + translateY for smooth compositing.
// Includes a small blur for polish; keep subtle because blur can be costly.

import { motionTokens } from "./tokens";

export const pageVariants = {
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease.out,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.inOut,
    },
  },
};
