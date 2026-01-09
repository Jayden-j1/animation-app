// src/components/Transition/PageTransition.tsx
//
// PURPOSE
// -------
// Cross-route enter/exit transitions.
// Keyed on location.key so it always re-runs correctly (incl. hash routing).
// Also ensures a stable background wrapper.

import * as React from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  children: React.ReactNode;
};

export function PageTransition({ children }: Props) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.key}
        className="min-h-dvh"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
