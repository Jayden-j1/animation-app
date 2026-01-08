// src/components/Transition/PageTransition.tsx
//
// PURPOSE
// -------
// Provides consistent, authored page transitions on navigation.
// - Uses AnimatePresence for exit + enter
// - Uses location.key so each navigation triggers a new animation
//
// ACCESSIBILITY
// -------------
// Respects prefers-reduced-motion:
// - Removes movement and blur
// - Uses only a tiny fade

import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { usePrefersReducedMotion } from "@/motion/reduceMotion";
import { pageVariants } from "@/motion/variants";

type Props = {
  children: React.ReactNode;
};

export function PageTransition({ children }: Props) {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();

  // Reduced motion: minimal fade only.
  if (reduced) {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.12 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Full motion: shared page variants.
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.key}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
