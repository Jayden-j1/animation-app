// src/components/Transition/PageTransition.tsx
//
// PURPOSE
// -------
// Route enter/exit wrapper using Motion AnimatePresence.
//
// Fixes "blank screen during navigation" with AnimatePresence mode="wait":
// - Do NOT render <Outlet/> directly in the exiting tree.
// - Freeze each route element by location.key.
// React 19 note:
// - Avoid reading/writing refs during render. Store in an effect, then render from state.

import * as React from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/motion/reduceMotion";

export function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduced = usePrefersReducedMotion();

  // Map of key -> frozen element (stored outside render usage)
  const frozenByKeyRef = React.useRef<Record<string, React.ReactNode>>({});

  // Snapshot we actually render for the current key
  const [renderNode, setRenderNode] = React.useState<React.ReactNode>(outlet);

  // Freeze the outlet per navigation key (effect runs after render)
  React.useEffect(() => {
    const key = location.key;

    // If we don't have a frozen node for this key, store it
    if (!frozenByKeyRef.current[key]) {
      frozenByKeyRef.current[key] = outlet;
    }

    // Update snapshot to the frozen node for this key
    setRenderNode(frozenByKeyRef.current[key]);

    // Optional cleanup: keep last ~6 keys
    const keys = Object.keys(frozenByKeyRef.current);
    if (keys.length > 6) {
      for (const k of keys.slice(0, keys.length - 6)) {
        delete frozenByKeyRef.current[k];
      }
    }
  }, [location.key, outlet]);

  return (
    <div className="min-h-dvh bg-[#05060a]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.key}
          className="min-h-dvh bg-[#05060a]"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={
            reduced ? { duration: 0.12 } : { duration: 0.26, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {renderNode}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
