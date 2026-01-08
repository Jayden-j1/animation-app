// src/features/dimensions/nature/NatureArrival.tsx
//
// PURPOSE
// -------
// "Finish the portal entry" on the Nature dimension:
// - Iris dissolve reveal (radial mask expands)
// - Soft "audio-less rhythm ramp" (brightness/contrast easing) on arrival
//
// NOTES
// -----
// - Respects prefers-reduced-motion (falls back to simple fade).
// - Designed to wrap NatureScene inside DimensionPage.

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { tokens } from "@/motion/tokens";

type Props = {
  children: React.ReactNode;
};

export function NatureArrival({ children }: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: tokens.duration.base, ease: tokens.ease.out }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative"
      // Iris starts small, slightly dimmer + higher contrast (like stepping into shade)
      initial={{
        opacity: 0.001,
        filter: "brightness(0.95) contrast(1.06) saturate(1.02)",
        clipPath: "circle(12% at 50% 52%)",
      }}
      // Iris opens wide; ramp lands at neutral (felt before seen)
      animate={{
        opacity: 1,
        filter: "brightness(1) contrast(1) saturate(1)",
        clipPath: "circle(140% at 50% 52%)",
      }}
      transition={{
        duration: 0.9,
        ease: tokens.ease.out,
      }}
    >
      {children}

      {/* Vignette lift: fades out as the iris completes, so arrival feels intentional */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        initial={{ opacity: 0.35 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: tokens.ease.out }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 78%)",
        }}
      />
    </motion.div>
  );
}
